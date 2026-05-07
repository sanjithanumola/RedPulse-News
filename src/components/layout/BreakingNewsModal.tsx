import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Zap, ArrowRight } from 'lucide-react';

export default function BreakingNewsModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('seenBreakingNews');
      if (!hasSeen) {
        setShow(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('seenBreakingNews', 'true');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm" onClick={handleClose} />
          
          <motion.div
            initial={{ y: 100, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 100, scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-surface border border-primary/30 rounded-3xl overflow-hidden shadow-2xl red-glow"
          >
            <div className="p-8">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary rounded-lg animate-pulse">
                        <Zap className="w-5 h-5" />
                     </div>
                     <h2 className="font-display font-black text-xl tracking-tighter italic uppercase">Intelligence Alert</h2>
                  </div>
                  <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5 opacity-40" /></button>
               </div>

               <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold leading-tight">Gemini 4.0 Neural Core officially initialized in India</h3>
                  <p className="text-sm opacity-60 leading-relaxed">The global compute cluster has reached 100% capacity in the Hyderabad region, enabling near-instant news intelligence and predictive analysis.</p>
               </div>

               <div className="mt-8 flex gap-3">
                  <button 
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 bg-primary rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Investigate <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleClose}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest"
                  >
                    Dismiss
                  </button>
               </div>
            </div>
            
            <div className="h-1 w-full bg-white/5">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 5 }}
                 onAnimationComplete={handleClose}
                 className="h-full bg-primary"
               />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
