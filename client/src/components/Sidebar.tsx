'use client';

import React from 'react';
import { useSocket } from '@/context/SocketContext';
import { User as UserIcon, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onCallUser: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCallUser }) => {
  const { onlineUsers, me } = useSocket();

  const filteredUsers = onlineUsers.filter((user) => user.id !== me && user.id !== undefined);

  return (
    <motion.aside
      initial={false}
      animate={{ x: isOpen ? 0 : -300 }}
      className={`fixed lg:relative lg:translate-x-0 z-40 w-72 h-[calc(100vh-64px)] glass-dark border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
          Online Users ({filteredUsers.length})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        <AnimatePresence>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer flex items-center justify-between"
                onClick={() => onCallUser(user.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-primary/20 transition-colors">
                      <UserIcon className="w-5 h-5 text-white/50 group-hover:text-primary transition-colors" />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${user.busy ? 'bg-red-500' : 'bg-green-500'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                      Stranger ({user.username.split('_')[1] || user.id.substring(0, 5)})
                    </p>
                    <p className={`text-[10px] uppercase font-bold tracking-tighter ${user.busy ? 'text-red-500/70' : 'text-green-500/70'}`}>
                      {user.busy ? 'Busy In Call' : 'Active Now'}
                    </p>
                  </div>
                </div>
                
                <button className="p-2 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white">
                  <PhoneCall className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <UserIcon className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-sm text-white/30">No strangers online yet.</p>
              <p className="text-xs text-white/20 mt-1 italic">Waiting for someone to join...</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 glass border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">O</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white/80 truncate">Owner (You)</p>
            <p className="text-[10px] text-white/40 truncate font-mono">{me}</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
