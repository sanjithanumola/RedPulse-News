import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Filter, TrendingUp, Sparkles } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import NewsTicker from './components/layout/NewsTicker';
import NewsCard from './components/news/NewsCard';
import ArticleDetail from './components/news/ArticleDetail';
import ChatBot from './components/ai/ChatBot';
import SidebarWidgets from './components/widgets/SidebarWidgets';
import BreakingNewsModal from './components/layout/BreakingNewsModal';
import { NewsArticle, Category } from './types';
import { fetchNews } from './lib/api';
import { cn } from './lib/utils';

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [category, setCategory] = useState<Category>('General');
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | null>(null);

  const categories: Category[] = [
    'General', 'Technology', 'AI', 'Hyderabad', 'India', 'Sports', 'Gaming', 'Business', 'Science'
  ];

  const handleAskAI = (article: NewsArticle) => {
    setChatInitialMessage(`I'm reading "${article.title}". Can you tell me more about its implications for ${article.location || 'the world'}?`);
    setIsChatOpen(true);
  };

  useEffect(() => {
    setLoading(true);
    fetchNews(category === 'General' ? undefined : category)
      .then(setArticles)
      .finally(() => setLoading(false));
  }, [category]);

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const regularArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <NewsTicker />

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          <section className="mb-16">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                   <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary mb-4 flex items-center gap-2">
                     <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                     Pulse Operational
                   </h2>
                   <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight leading-[0.9] text-gradient">
                      GLOBAL<br />INTELLIGENCE
                   </h1>
                </motion.div>
                <div className="flex flex-wrap gap-2 max-w-xl justify-end">
                   {categories.map((c, i) => (
                     <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn(
                          "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          category === c 
                            ? "bg-primary border-primary red-glow text-white" 
                            : "bg-white/[0.03] border-white/5 hover:border-primary/50 opacity-60"
                        )}
                     >
                        {c}
                     </motion.button>
                   ))}
                </div>
             </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
               {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="aspect-[16/10] glass animate-pulse rounded-3xl border border-white/5" />
                    ))}
                 </div>
               ) : (
                 <>
                   {featuredArticle && (
                     <NewsCard 
                       featured 
                       article={featuredArticle} 
                       onClick={setSelectedArticle} 
                     />
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {regularArticles.map(article => (
                        <NewsCard 
                          key={article.id} 
                          article={article} 
                          onClick={setSelectedArticle} 
                        />
                      ))}
                   </div>

                   {articles.length === 0 && (
                      <div className="py-32 text-center glass rounded-[3rem] border border-white/5">
                         <Sparkles className="w-16 h-16 mx-auto opacity-10 mb-6" />
                         <h3 className="font-display text-2xl opacity-40 uppercase tracking-[0.2em] font-black">Null Transmission</h3>
                         <p className="text-sm opacity-20 mt-4 uppercase tracking-widest font-bold">Scanning for alternative intelligence bands...</p>
                      </div>
                   )}
                 </>
               )}
            </div>

            <aside className="lg:col-span-4 space-y-10">
               <SidebarWidgets />
            </aside>
          </div>
        </div>
      </main>

      <footer className="mt-32 border-t border-white/5 py-20 px-6 bg-black/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-display font-black text-2xl red-glow shadow-[0_0_15px_rgba(255,0,0,0.4)]">R</div>
              <span className="font-display font-black tracking-tighter text-3xl uppercase">RedPulse Intelligence</span>
            </div>
            <p className="text-sm opacity-40 max-w-sm font-medium leading-relaxed">The world's first neural-driven news collective. Delivering verified intelligence through integrated AI systems in the Hyderabad region.</p>
          </div>
          <div className="space-y-4">
             <h4 className="text-xs font-black uppercase tracking-widest text-primary">Sectors</h4>
             <ul className="text-xs space-y-3 font-bold opacity-50 uppercase tracking-widest">
                <li className="hover:text-primary cursor-pointer transition-colors">Operational Tech</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Neural AI</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Telangana Division</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Global Trade</li>
             </ul>
          </div>
          <div className="space-y-4">
             <h4 className="text-xs font-black uppercase tracking-widest text-primary">Intelligence</h4>
             <ul className="text-xs space-y-3 font-bold opacity-50 uppercase tracking-widest">
                <li className="hover:text-primary cursor-pointer transition-colors">Neural Policy</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Bias Protocol</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Source Verification</li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] opacity-30 uppercase font-black tracking-[0.3em]">© 2026 RedPulse Neural Div. Operational Excellence.</p>
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-30">
              <span>Latency: 12ms</span>
              <span>Nodes: Active (11.02)</span>
           </div>
        </div>
      </footer>

      <ChatBot 
        isOpenExternal={isChatOpen} 
        setIsOpenExternal={setIsChatOpen} 
        initialMessage={chatInitialMessage} 
      />
      <ArticleDetail 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
        onAskAI={handleAskAI}
      />
      <BreakingNewsModal />
    </div>
  );
}
