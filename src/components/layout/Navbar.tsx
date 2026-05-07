import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X, Globe, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import AuthModal from '../auth/AuthModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
          isScrolled ? "bg-surface/80 backdrop-blur-lg border-b border-white/5 py-3" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center red-glow group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,0,0,0.5)]">
               <span className="font-display font-black text-2xl italic text-white">R</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-black text-2xl tracking-tighter leading-none">
                RED<span className="text-primary italic">PULSE</span>
              </h1>
              <p className="text-[9px] uppercase tracking-[0.3em] font-black opacity-40 leading-none mt-1">Global Intelligence</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Latest', 'Tech', 'AI', 'Hyderabad', 'India'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-xs font-black hover:text-primary transition-colors uppercase tracking-[0.2em] opacity-60 hover:opacity-100"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:border-primary/50 transition-colors">
              <Search className="w-4 h-4 opacity-30" />
              <input 
                type="text" 
                placeholder="Search news..." 
                className="bg-transparent border-none focus:outline-none text-[10px] uppercase font-bold ml-2 w-32 placeholder:text-white/20"
              />
            </div>
            
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.8)]"></span>
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline opacity-60">Session Active</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:scale-[1.05] border border-primary/20 rounded-xl transition-all shadow-[0_0_15px_rgba(255,0,0,0.3)]"
              >
                <User className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Initialize Access</span>
              </button>
            )}

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
              className="absolute top-full left-0 right-0 bg-surface border-b border-white/10 p-8 md:hidden flex flex-col gap-6 shadow-2xl backdrop-blur-3xl"
            >
              {['Latest', 'Tech', 'AI', 'Hyderabad', 'India'].map((item) => (
                <a key={item} href="#" className="text-2xl font-display font-black uppercase tracking-widest hover:text-primary transition-colors">{item}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
