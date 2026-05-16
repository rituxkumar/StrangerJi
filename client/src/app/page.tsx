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
  callEnded 
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
    </main>
  );
}
