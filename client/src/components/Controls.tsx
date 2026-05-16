'use client';

import React from 'react';
import { useWebRTC } from '@/context/WebRTCContext';
import { motion } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff,
  MessageSquare
} from 'lucide-react';

import { useChat } from '@/context/ChatContext';

interface ControlsProps {
  toggleChat: () => void;
}

const Controls: React.FC<ControlsProps> = ({ toggleChat }) => {
  const { unreadCount } = useChat();
  const { 
    leaveCall, 
    toggleVideo, 
    toggleAudio, 
    isVideoEnabled, 
    isAudioEnabled,
    callAccepted,
    callEnded
  } = useWebRTC();

  const inCall = callAccepted && !callEnded;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-dark p-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-2xl backdrop-blur-2xl"
      >
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-xl transition-all duration-300 ${
            isAudioEnabled 
              ? 'bg-white/5 text-white/70 hover:bg-white/10' 
              : 'bg-red-500/20 text-red-500 border border-red-500/30'
          }`}
        >
          {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-xl transition-all duration-300 ${
            isVideoEnabled 
              ? 'bg-white/5 text-white/70 hover:bg-white/10' 
              : 'bg-red-500/20 text-red-500 border border-red-500/30'
          }`}
        >
          {isVideoEnabled ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        <button
          onClick={toggleChat}
          className="p-4 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-all duration-300 relative"
        >
          <MessageSquare className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {inCall && (
          <button
            onClick={leaveCall}
            className="p-4 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-300 flex items-center gap-2 px-6 shadow-lg shadow-red-600/20"
          >
            <PhoneOff className="w-6 h-6" />
            <span className="hidden md:block font-bold">End Call</span>
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Controls;
