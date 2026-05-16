const users = {}; // userId -> { socketId, username, status }

const handleSocketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // When a user joins
    socket.on('user-online', (userData) => {
      users[socket.id] = {
        id: socket.id,
        username: userData.username || `Stranger_${socket.id.substring(0, 5)}`,
        status: 'online',
      };
      
      console.log('User online:', users[socket.id].username);
      
      // Broadcast to everyone that a new user is online
      io.emit('update-user-list', Object.values(users));
    });

    // WebRTC Signaling: Call User
    socket.on('call-user', ({ userToCall, signalData, from, name }) => {
      console.log(`Calling user ${userToCall} from ${from}`);
      io.to(userToCall).emit('incoming-call', {
        signal: signalData,
        from,
        name,
      });
    });

    // WebRTC Signaling: Answer Call
    socket.on('answer-call', (data) => {
      console.log(`Answering call to ${data.to}`);
      io.to(data.to).emit('call-accepted', data.signal);
    });

    // ICE Candidate exchange (if using native WebRTC directly, but simple-peer handles signal)
    socket.on('ice-candidate', (data) => {
      io.to(data.to).emit('ice-candidate', data.candidate);
    });

    // Chat: Send Message
    socket.on('send-message', ({ to, message, from }) => {
      console.log(`Message from ${from} to ${to}: ${message}`);
      io.to(to).emit('receive-message', {
        message,
        from,
        timestamp: new Date().toISOString(),
      });
    });

    // Typing Indicator
    socket.on('typing', ({ to, from }) => {
      io.to(to).emit('typing', { from });
    });

    socket.on('stop-typing', ({ to, from }) => {
      io.to(to).emit('stop-typing', { from });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      if (users[socket.id]) {
        const username = users[socket.id].username;
        delete users[socket.id];
        console.log('User offline:', username);
        io.emit('update-user-list', Object.values(users));
      }
    });
  });
};

module.exports = { handleSocketEvents };
