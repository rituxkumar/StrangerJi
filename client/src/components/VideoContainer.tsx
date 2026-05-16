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
    <div className="flex-1 relative bg-background flex flex-col items-center justify-center p-4 lg:p-6 overflow-hidden">
      <div className="w-full h-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 relative z-10">
        
        {/* Local Stream */}
        <motion.div 
          layout
          className="relative rounded-3xl overflow-hidden glass border border-white/10 bg-black/40 group"
        >
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="w-full h-full object-cover scale-x-[-1]"
          />
          
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass-dark border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Owner (You)
          </div>

          <AnimatePresence>
            {!isVideoEnabled && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <VideoOff className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-sm text-white/40 font-medium">Camera Disabled</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 flex gap-2">
            {!isAudioEnabled && (
              <div className="p-2 rounded-lg bg-red-500/20 text-red-500 border border-red-500/20">
                <MicOff className="w-4 h-4" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Remote Stream */}
        <motion.div 
          layout
          className="relative rounded-3xl overflow-hidden glass border border-white/10 bg-black/40"
        >
          {callAccepted && !callEnded ? (
            <>
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass-dark border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
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
                className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 relative"
              >
                <User className="w-12 h-12 text-primary/30" />
                <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white/70">Waiting for Stranger</h3>
                <p className="text-sm text-white/30 max-w-xs mt-2">
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
