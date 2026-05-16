'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import VideoContainer from '@/components/VideoContainer';
import ChatContainer from '@/components/ChatContainer';
import Controls from '@/components/Controls';
import { useWebRTC } from '@/context/WebRTCContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneIncoming } from 'lucide-react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
 const { 
  callUser, 
  receivingCall, 
  answerCall, 
  callAccepted, 
  callEnded ,
  callerName
} = useWebRTC();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  // Auto-open chat when call is established
  React.useEffect(() => {
    if (callAccepted && !callEnded) {
      setIsChatOpen(true);
    }
  }, [callAccepted, callEnded]);

  return (
    <main className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onCallUser={(id) => callUser(id)} 
        />
        
        <VideoContainer />
        
        <ChatContainer 
          isOpen={isChatOpen} 
          toggleChat={toggleChat} 
        />
      </div>

      <Controls toggleChat={toggleChat} />

      {/* Premium Incoming Call Modal */}
      <AnimatePresence>
        {receivingCall && !callAccepted && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="glass p-8 rounded-[2.5rem] border border-white/10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 animate-pulse" />
              
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
                <div className="absolute inset-2 rounded-full border border-primary/20 animate-pulse" />
                <PhoneIncoming className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Incoming Call</h2>
              <p className="text-white/50 mb-8 font-medium">
                <span className="text-primary font-bold">{callerName || 'Stranger'}</span> is calling you...
              </p>
              
              <div className="flex gap-4 relative z-10">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all font-bold text-sm border border-white/5"
                >
                  Decline
                </button>
                <button
                  onClick={answerCall}
                  className="flex-1 py-4 rounded-2xl bg-primary hover:bg-primary-dark transition-all font-bold text-sm shadow-lg shadow-primary/20 text-white"
                >
                  Accept
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
