import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, User, Minimize2 } from 'lucide-react';
import { chatWithNova } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import { cn } from '../../lib/utils';

interface ChatBotProps {
  isOpenExternal?: boolean;
  setIsOpenExternal?: (open: boolean) => void;
  initialMessage?: string | null;
}

export default function ChatBot({ isOpenExternal, setIsOpenExternal, initialMessage }: ChatBotProps) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isOpenInternal;
  const setIsOpen = setIsOpenExternal || setIsOpenInternal;

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm Nova, your AI news intelligence. I can summarize articles, explain complex topics about India/Hyderabad, or discuss current trends. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage) {
      setMessages(prev => [...prev, { role: 'user', content: initialMessage }]);
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (customInput?: string) => {
    const textToSubmit = customInput || input;
    if (!textToSubmit.trim() || loading) return;

    if (!customInput) {
        setMessages(prev => [...prev, { role: 'user', content: textToSubmit }]);
        setInput('');
    }
    
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      const response = await chatWithNova(textToSubmit, history as any);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble processing that right now. Power levels are fluctuating..." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 z-[100] w-14 h-14 bg-primary rounded-2xl red-glow flex items-center justify-center transition-all",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <Bot className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-8 right-8 z-[100] w-[90vw] md:w-[400px] h-[550px] glass-dark rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-primary/20"
          >
            {/* Header */}
            <div className="p-4 bg-primary/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                   <Bot className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-display font-bold text-sm tracking-widest">NOVA INTELLIGENCE</h3>
                   <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] uppercase font-black opacity-50">Online</span>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex items-end gap-2",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-white/10" : "bg-primary/20"
                  )}>
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-primary" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed",
                    msg.role === 'user' ? "bg-white/5 rounded-br-none" : "bg-primary/5 border border-primary/10 rounded-bl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2">
                   <div className="bg-primary/20 w-6 h-6 rounded flex items-center justify-center"><Bot className="w-3 h-3 text-primary" /></div>
                   <div className="flex gap-1">
                      <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
                      <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100"></span>
                      <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200"></span>
                   </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-black/20 border-t border-white/5">
               <div className="relative flex items-center">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Nova intelligence..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary/50"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 p-2 bg-primary rounded-lg hover:red-glow transition-all disabled:opacity-50"
                    disabled={!input.trim() || loading}
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </div>
               <p className="text-[10px] text-center mt-3 opacity-30 font-bold uppercase tracking-widest">
                  Powered by Gemini Neural Engine
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
