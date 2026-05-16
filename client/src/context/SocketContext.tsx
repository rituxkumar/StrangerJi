'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  username: string;
  status: 'online' | 'offline';
}

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: User[];
  me: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [me, setMe] = useState<string>('');

  useEffect(() => {
    // Replace with your server URL
   const socketInstance = io(process.env.NEXT_PUBLIC_SERVER_URL as string);
    
    socketInstance.on('connect', () => {
      const myId = socketInstance.id || '';
      console.log('Connected to socket server with ID:', myId);
      setMe(myId);
      
      // Emit that we are online
      socketInstance.emit('user-online', {
        username: `Stranger_${myId.substring(0, 5)}`,
      });
    });

    socketInstance.on('update-user-list', (users: User[]) => {
      setOnlineUsers(users);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, me }}>
      {children}
    </SocketContext.Provider>
  );
};
