import React, { useState } from 'react';
import { Search, Bell, User, Menu, X, Globe, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-surface/80 backdrop-blur-lg border-b border-white/5 py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center red-glow group-hover:scale-110 transition-transform">
             <span className="font-display font-bold text-xl italic">N</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display font-bold text-xl tracking-tighter">
              NEWS<span className="text-primary italic">NOVA</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 -mt-1">Intelligence Division</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Latest', 'Tech', 'AI', 'Hyderabad', 'India'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest opacity-80 hover:opacity-100"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:border-primary/50 transition-colors">
            <Search className="w-4 h-4 opacity-50" />
            <input 
              type="text" 
              placeholder="Search news with AI..." 
              className="bg-transparent border-none focus:outline-none text-xs ml-2 w-48 placeholder:text-white/30"
            />
          </div>
          
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          </button>
          
          <button className="hidden lg:flex p-2 hover:bg-white/10 rounded-full transition-colors">
            <Globe className="w-5 h-5" />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Sign In</span>
          </button>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-surface border-b border-white/10 p-6 md:hidden flex flex-col gap-4"
          >
            {['Latest', 'Tech', 'AI', 'Hyderabad', 'India'].map((item) => (
              <a key={item} href="#" className="text-lg font-display uppercase tracking-widest">{item}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
