'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

interface Message {
  from: string;
  message: string;
  timestamp: string;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (to: string, message: string) => void;
  typingStatus: { [userId: string]: boolean };
  sendTypingStatus: (to: string, isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket, me } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingStatus, setTypingStatus] = useState<{ [userId: string]: boolean }>({});

  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('typing', ({ from }) => {
      setTypingStatus((prev) => ({ ...prev, [from]: true }));
    });

    socket.on('stop-typing', ({ from }) => {
      setTypingStatus((prev) => ({ ...prev, [from]: false }));
    });

    return () => {
      socket.off('receive-message');
      socket.off('typing');
      socket.off('stop-typing');
    };
  }, [socket]);

  const sendMessage = (to: string, message: string) => {
    if (!socket) return;
    
    const newMessage = {
      from: me,
      message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    socket.emit('send-message', { to, message, from: me });
  };

  const sendTypingStatus = (to: string, isTyping: boolean) => {
    if (!socket) return;
    socket.emit(isTyping ? 'typing' : 'stop-typing', { to, from: me });
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, typingStatus, sendTypingStatus }}>
      {children}
    </ChatContext.Provider>
  );
};
