'use client';

import React from 'react';
import { useWebRTC } from '@/context/WebRTCContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MicOff, VideoOff, User } from 'lucide-react';

const VideoContainer: React.FC = () => {
  const { 
    myVideo, 
    userVideo, 
    callAccepted, 
    callEnded, 
    stream,
    isAudioEnabled,
    isVideoEnabled
  } = useWebRTC();

  return (
    <div className="flex-1 relative bg-[#050505] flex flex-col items-center justify-center p-2 md:p-6 overflow-hidden">
      <div className="w-full h-full max-w-7xl flex flex-col md:flex-row gap-2 md:gap-6 relative z-10">
        
        {/* Owner (Local) Stream */}
        <motion.div 
          layout
          className={`relative rounded-2xl md:rounded-3xl overflow-hidden glass border border-white/10 bg-black/40 group flex-1 transition-all duration-500 ${
            callAccepted && !callEnded ? 'h-1/3 md:h-full' : 'h-full'
          }`}
        >
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="w-full h-full object-cover scale-x-[-1]"
          />
          
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass-dark border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Owner (You)
          </div>

          <AnimatePresence>
            {!isVideoEnabled && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-10"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <VideoOff className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-xs text-white/40 font-medium">Camera Disabled</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stranger (Remote) Stream */}
        <motion.div 
          layout
          className={`relative rounded-2xl md:rounded-3xl overflow-hidden glass border border-white/10 bg-black/40 flex-1 transition-all duration-500 ${
            callAccepted && !callEnded ? 'h-2/3 md:h-full' : 'hidden md:flex items-center justify-center'
          }`}
        >
          {callAccepted && !callEnded ? (
            <>
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass-dark border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 z-20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Stranger
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-12 text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 relative"
              >
                <User className="w-8 h-8 md:w-12 md:h-12 text-primary/30" />
                <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping" />
              </motion.div>
              <div className="hidden md:block">
                <h3 className="text-lg md:text-xl font-bold text-white/70">Waiting for Stranger</h3>
                <p className="text-xs md:text-sm text-white/30 max-w-xs mt-2">
                  Pick someone from the sidebar to start a real-time conversation.
                </p>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default VideoContainer;
