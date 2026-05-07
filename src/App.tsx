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

  const categories: Category[] = [
    'General', 'Technology', 'AI', 'Hyderabad', 'India', 'Sports', 'Gaming', 'Business', 'Science'
  ];

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
      
      <main className="pt-24">
        {/* Ticker Row */}
        <NewsTicker />

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Header & Categories */}
          <section className="mb-12">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                <div>
                   <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-2">Global Intelligence Feed</h2>
                   <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-none">
                      THE WORLD <br /> <span className="text-gradient">IN REAL-TIME</span>
                   </h1>
                </div>
                <div className="flex flex-wrap gap-2">
                   {categories.map((c) => (
                     <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn(
                          "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                          category === c 
                            ? "bg-primary border-primary red-glow text-white" 
                            : "bg-white/5 border-white/10 hover:bg-white/10 opacity-60"
                        )}
                     >
                        {c}
                     </button>
                   ))}
                </div>
             </div>
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* News Feed - Left Side */}
            <div className="lg:col-span-8 space-y-12">
               
               {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="aspect-video glass animate-pulse rounded-2xl" />
                    ))}
                 </div>
               ) : (
                 <>
                   {/* Featured Row */}
                   {featuredArticle && (
                     <div className="grid grid-cols-1 gap-6">
                        <NewsCard 
                          featured 
                          article={featuredArticle} 
                          onClick={setSelectedArticle} 
                        />
                     </div>
                   )}

                   {/* Grid Row */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {regularArticles.map(article => (
                        <NewsCard 
                          key={article.id} 
                          article={article} 
                          onClick={setSelectedArticle} 
                        />
                      ))}
                   </div>

                   {articles.length === 0 && !loading && (
                      <div className="py-20 text-center glass rounded-3xl">
                         <Sparkles className="w-12 h-12 mx-auto opacity-20 mb-4" />
                         <h3 className="font-display text-xl opacity-60 uppercase tracking-widest">No intelligence found in this sector.</h3>
                         <p className="text-sm opacity-40 mt-2">Try switching frequency or searching global bands.</p>
                      </div>
                   )}
                 </>
               )}
            </div>

            {/* Sidebar - Right Side */}
            <aside className="lg:col-span-4 space-y-8">
               <SidebarWidgets />
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-display font-black">N</div>
            <span className="font-display font-black tracking-tighter text-xl uppercase">NewsNova AI</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-40">
             <a href="#" className="hover:text-primary transition-colors">Privacy Neural Ethics</a>
             <a href="#" className="hover:text-primary transition-colors">Operational Terms</a>
             <a href="#" className="hover:text-primary transition-colors">Intelligence Sources</a>
          </div>
          <p className="text-[10px] opacity-30 uppercase font-black tracking-widest">© 2026 Nova Media Group • Sub-Neural Div.</p>
        </div>
      </footer>

      {/* AI Components */}
      <ChatBot />
      <ArticleDetail 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
      <BreakingNewsModal />
    </div>
  );
}
