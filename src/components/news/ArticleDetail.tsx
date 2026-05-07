import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Brain, Scale, ShieldCheck, Share2, Bookmark, Volume2, Languages, AlertTriangle, Activity, CheckCircle2, PauseCircle } from 'lucide-react';
import { NewsArticle } from '../../types';
import { analyzeArticleAI } from '../../services/geminiService';
import { cn, formatDate } from '../../lib/utils';
import { supabase, toggleBookmark, getBookmarks } from '../../lib/supabase';

interface ArticleDetailProps {
  article: NewsArticle | null;
  onClose: () => void;
  onAskAI?: (article: NewsArticle) => void;
}

export default function ArticleDetail({ article, onClose, onAskAI }: ArticleDetailProps) {
  const [analysis, setAnalysis] = useState<NewsArticle['aiAnalysis'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'eli10'>('standard');
  const [isReading, setIsReading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user && article) {
        getBookmarks(user.id).then(bookmarks => {
          setIsBookmarked(bookmarks.includes(article.id));
        });
      }
    });
  }, [article]);

  const handleBookmark = async () => {
    if (!user || !article) {
      alert('Please initialize access to bookmark articles.');
      return;
    }
    const bookmarked = await toggleBookmark(user.id, article.id);
    setIsBookmarked(bookmarked);
  };

  useEffect(() => {
    if (article) {
      setLoading(true);
      setAnalysis(null);
      analyzeArticleAI(article)
        .then(setAnalysis)
        .finally(() => setLoading(false));
    }
  }, [article]);

  const toggleReading = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else if (article) {
      const utterance = new SpeechSynthesisUtterance(`${article.title}. ${article.description}. ${article.content}`);
      utterance.rate = 1.1;
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  if (!article) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        <div className="absolute inset-0 bg-surface/95 backdrop-blur-3xl" onClick={onClose} />
        
        <motion.div
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 40, opacity: 0 }}
          className="relative w-full max-w-7xl h-full glass-dark rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-[110] p-3 bg-white/5 hover:bg-primary rounded-2xl transition-all duration-300 border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Sidebar Area (Left) - AI Insights */}
          <div className="w-full md:w-96 border-r border-white/5 p-8 flex flex-col gap-6 overflow-y-auto bg-black/40">
            <div className="flex items-center gap-3 mb-2 p-4 bg-primary/5 rounded-2xl border border-primary/20">
               <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center red-glow shadow-[0_0_15px_rgba(255,0,0,0.4)]">
                  <Sparkles className="w-5 h-5 text-white" />
               </div>
               <div>
                  <h2 className="font-display font-black uppercase tracking-widest text-sm text-primary">Intelligence Hub</h2>
                  <p className="text-[10px] uppercase font-bold opacity-40">Neural Analysis v4.2</p>
               </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                ))}
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                {/* Summary Section */}
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative group transition-colors hover:border-primary/20">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-primary">
                         <Brain className="w-3.5 h-3.5" /> Intelligence
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{viewMode === 'eli10' ? 'ELI10' : 'CORE'}</span>
                   </div>
                   <p className="text-sm leading-relaxed opacity-80 mb-6 font-medium">
                     {viewMode === 'eli10' ? analysis.eli5 : analysis.summary}
                   </p>
                   <button 
                    onClick={() => setViewMode(viewMode === 'standard' ? 'eli10' : 'standard')}
                    className="w-full py-3 rounded-xl bg-primary text-[10px] font-black uppercase tracking-[0.1em] hover:bg-neutral-100 hover:text-black transition-all transform hover:scale-[1.02]"
                   >
                     {viewMode === 'standard' ? 'Simplify Explanation' : 'Standard Intelligence'}
                   </button>
                </div>

                {/* Sentiment & Truth Meter */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-[10px] font-black opacity-40 uppercase tracking-widest">
                         <Activity className="w-3.5 h-3.5" /> Sentiment
                      </div>
                      <p className={cn(
                        "text-sm font-black uppercase tracking-widest",
                        analysis.sentiment === 'Positive' ? "text-green-500" : analysis.sentiment === 'Negative' ? "text-primary" : "text-blue-400"
                      )}>{analysis.sentiment || 'Neutral'}</p>
                   </div>
                   <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-[10px] font-black opacity-40 uppercase tracking-widest">
                         <CheckCircle2 className="w-3.5 h-3.5" /> Factual Score
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest text-emerald-400">{analysis.truthMeter || 88}%</p>
                   </div>
                </div>

                {/* Bias Meter Enhanced */}
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                   <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.2em] font-black text-blue-400">
                      <Scale className="w-4 h-4" /> Bias Alignment
                   </div>
                   <div className="w-full h-2 bg-white/10 rounded-full mb-4 overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-600 transition-all duration-1000"
                        style={{ width: `${analysis.biasScore * 100}%` }}
                      />
                      <div className="absolute top-0 bottom-0 w-0.5 bg-white/30 left-1/2" />
                   </div>
                   <p className="text-[11px] opacity-50 italic leading-relaxed font-medium">
                     {analysis.biasAnalysis}
                   </p>
                </div>

                {/* Authenticity Guard */}
                <div className={cn(
                  "p-6 rounded-3xl border transition-colors",
                  analysis.isFakeNews ? "border-red-500/20 bg-red-500/5" : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                )}>
                   <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-widest font-black">
                      {analysis.isFakeNews ? (
                        <><AlertTriangle className="w-4 h-4 text-primary" /> Accuracy Warning</>
                      ) : (
                        <><ShieldCheck className="w-4 h-4" /> Integrity Verified</>
                      )}
                   </div>
                   {analysis.isFakeNews && (
                     <p className="text-[11px] opacity-70 leading-relaxed">{analysis.fakeNewsReason}</p>
                   )}
                </div>

                {/* Ask AI Contextual */}
                <button 
                  onClick={() => onAskAI?.(article)}
                  className="mt-4 w-full p-6 rounded-3xl bg-white text-black font-display font-black text-base uppercase tracking-tighter hover:bg-neutral-200 transition-all flex items-center justify-between group"
                >
                  Ask Nova About This <Brain className="w-5 h-5 transition-transform group-hover:scale-125" />
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center px-4">
                 <Bot className="w-12 h-12 mb-4" />
                 <p className="text-sm font-black uppercase tracking-widest">Linking with Intelligence Core...</p>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0 bg-surface">
            {/* Header with Parallax-ready Image */}
            <div className="relative aspect-[16/9] md:aspect-[21/10] overflow-hidden shrink-0 border-b border-white/5">
               <motion.img 
                 initial={{ scale: 1.1 }}
                 animate={{ scale: 1 }}
                 src={article.urlToImage} 
                 className="w-full h-full object-cover" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
               
               <div className="absolute bottom-10 left-10 right-10 z-10">
                 <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 bg-primary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">{article.category}</span>
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em]">{formatDate(article.publishedAt)}</span>
                    {article.location && (
                      <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">{article.location}</span>
                    )}
                 </div>
                 <h1 className="text-4xl md:text-6xl font-display font-black leading-[1.05] tracking-tight text-gradient max-w-4xl">{article.title}</h1>
               </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <div className="max-w-4xl mx-auto px-10 py-12">
                 <div className="flex flex-wrap items-center justify-between mb-12 py-6 border-y border-white/5 gap-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-display font-black text-primary text-xl">
                         {article.author[0]}
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">{article.author}</p>
                          <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] font-bold">{article.source} Intelligence Partner</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <button 
                        onClick={toggleReading}
                        className={cn(
                          "flex items-center gap-2 px-5 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest",
                          isReading ? "bg-primary red-glow text-white" : "glass hover:bg-white/10"
                        )}
                       >
                         {isReading ? <><PauseCircle className="w-4 h-4" /> Stop Audio</> : <><Volume2 className="w-4 h-4" /> Neural Audio</>}
                       </button>
                       <div className="flex gap-2">
                          <button className="w-11 h-11 rounded-2xl glass hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"><Languages className="w-4 h-4 opacity-70" /></button>
                          <button 
                            onClick={handleBookmark}
                            className={cn(
                              "w-11 h-11 rounded-2xl glass flex items-center justify-center transition-all border border-white/10",
                              isBookmarked ? "bg-primary border-primary text-white" : "hover:bg-white/10"
                            )}
                          >
                             <Bookmark className={cn("w-4 h-4", isBookmarked ? "fill-current" : "opacity-70")} />
                          </button>
                          <button className="w-11 h-11 rounded-2xl glass hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"><Share2 className="w-4 h-4 opacity-70" /></button>
                       </div>
                    </div>
                 </div>

                 <article className="prose prose-invert prose-2xl max-w-none">
                    <p className="text-2xl md:text-3xl font-light leading-relaxed mb-12 text-white/90">
                       {article.description}
                    </p>
                    <div className="text-lg md:text-xl opacity-60 leading-relaxed font-sans font-medium whitespace-pre-wrap selection:bg-primary selection:text-white pb-20">
                       {article.content}
                    </div>
                 </article>
               </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Bot(props: any) {
    return <Activity {...props} />
}
