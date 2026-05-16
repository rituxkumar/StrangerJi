'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { useWebRTC } from '@/context/WebRTCContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, X } from 'lucide-react';

interface ChatContainerProps {
  isOpen: boolean;
  toggleChat: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ isOpen, toggleChat }) => {
  const { messages, sendMessage, typingStatus, sendTypingStatus, resetUnreadCount } = useChat();
  const { me } = useSocket();
  const { caller, callAccepted, callEnded } = useWebRTC();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // For this simple version, we chat with the current caller or the last active user
  const chatTarget = caller;

  useEffect(() => {
    if (isOpen) {
      resetUnreadCount();
    }
  }, [isOpen, resetUnreadCount]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && chatTarget) {
      sendMessage(chatTarget, input.trim());
      setInput('');
      sendTypingStatus(chatTarget, false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (chatTarget) {
      sendTypingStatus(chatTarget, e.target.value.length > 0);
    }
  };

  const isStrangerTyping = chatTarget && typingStatus[chatTarget];

  return (
    <motion.div
      initial={false}
      animate={{ x: isOpen ? 0 : 400 }}
      className={`fixed lg:relative lg:translate-x-0 z-40 w-full md:w-96 h-[calc(100vh-64px)] glass-dark border-l border-white/10 flex flex-col transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
            Chat
          </h2>
          {callAccepted && !callEnded && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] text-primary font-bold">Active</span>
            </div>
          )}
        </div>
        <button onClick={toggleChat} className="lg:hidden p-1 hover:bg-white/5 rounded-lg text-white/50">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-8">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs mt-1">Start a conversation with a stranger!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col ${msg.from === me ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.from === me 
                    ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20' 
                    : 'bg-white/10 text-white/90 rounded-tl-none border border-white/10'
                }`}
              >
                {msg.message}
              </div>
              <span className="text-[10px] text-white/20 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))
        )}
        
        {isStrangerTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[10px] text-white/30 italic">Stranger is typing...</span>
          </motion.div>
        )}
      </div>

      <div className="p-4 glass-dark border-t border-white/5">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={callAccepted ? "Type a message..." : "Connect to a stranger first..."}
            disabled={!callAccepted}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/20 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || !callAccepted}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg disabled:opacity-30 disabled:bg-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const MessageSquare = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default ChatContainer;
