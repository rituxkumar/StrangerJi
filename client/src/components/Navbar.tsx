'use client';

import React from 'react';
import { Video, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="h-16 glass-dark border-b border-white/10 px-4 flex items-center justify-between z-50 relative">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ rotate: -20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          className="bg-primary/20 p-2 rounded-xl"
        >
          <Video className="text-primary w-6 h-6" />
        </motion.div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          StrangerJi.
        </h1>
      </div>

      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6 text-white/70" />
      </button>
      
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-500 uppercase tracking-wider">Live</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
