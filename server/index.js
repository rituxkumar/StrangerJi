const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { handleSocketEvents } = require('./socket');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*', // In production, replace with your client URL
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('StrangerJi Server is running');
});

// Pass io instance to socket handlers
handleSocketEvents(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
