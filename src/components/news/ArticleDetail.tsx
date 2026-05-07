import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Brain, Scale, ShieldCheck, Share2, Bookmark, Volume2, Languages, AlertTriangle } from 'lucide-react';
import { NewsArticle } from '../../types';
import { analyzeArticleAI } from '../../services/geminiService';
import { cn, formatDate } from '../../lib/utils';

interface ArticleDetailProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export default function ArticleDetail({ article, onClose }: ArticleDetailProps) {
  const [analysis, setAnalysis] = useState<NewsArticle['aiAnalysis'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'eli10'>('standard');

  useEffect(() => {
    if (article) {
      setLoading(true);
      setAnalysis(null);
      analyzeArticleAI(article)
        .then(setAnalysis)
        .finally(() => setLoading(false));
    }
  }, [article]);

  if (!article) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
      >
        <div className="absolute inset-0 bg-surface/90 backdrop-blur-3xl" onClick={onClose} />
        
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          className="relative w-full max-w-6xl h-full glass-dark rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Sidebar Area (Left/Top) - AI Insights */}
          <div className="w-full md:w-80 border-r border-white/5 p-6 flex flex-col gap-6 overflow-y-auto bg-black/20">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
               </div>
               <h2 className="font-display font-bold uppercase tracking-widest text-sm">AI Insights</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-white/5 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                {/* Summary */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                   <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-widest font-black text-primary">
                      <Brain className="w-3 h-3" /> Core Intelligence
                   </div>
                   <p className="text-sm leading-relaxed opacity-80">
                     {viewMode === 'eli10' ? analysis.eli5 : analysis.summary}
                   </p>
                   <button 
                    onClick={() => setViewMode(viewMode === 'standard' ? 'eli10' : 'standard')}
                    className="mt-4 w-full py-2 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-tighter hover:bg-primary transition-colors hover:text-white"
                   >
                     {viewMode === 'standard' ? 'Explain Like I\'m 10' : 'Back to Standard Info'}
                   </button>
                </div>

                {/* Bias Meter */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                   <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-widest font-black text-blue-400">
                      <Scale className="w-3 h-3" /> Bias Spectrum
                   </div>
                   <div className="w-full h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000"
                        style={{ width: `${analysis.biasScore * 100}%` }}
                      />
                   </div>
                   <p className="text-[11px] opacity-70 italic leading-snug">
                     {analysis.biasAnalysis}
                   </p>
                </div>

                {/* Authenticity */}
                <div className={cn(
                  "p-4 rounded-2xl border bg-white/5",
                  analysis.isFakeNews ? "border-red-500/30 bg-red-500/5" : "border-green-500/30 bg-green-500/5"
                )}>
                   <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-widest font-black">
                      {analysis.isFakeNews ? (
                        <><AlertTriangle className="w-3 h-3 text-red-500" /> Potential Inaccuracy</>
                      ) : (
                        <><ShieldCheck className="w-3 h-3 text-green-500" /> Authenticity Verified</>
                      )}
                   </div>
                   {analysis.isFakeNews && (
                     <p className="text-[11px] opacity-70">{analysis.fakeNewsReason}</p>
                   )}
                </div>
              </div>
            ) : (
              <p className="text-xs opacity-40 italic">Initialize article analysis to see AI insights.</p>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header / Meta */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden shrink-0">
               <img src={article.urlToImage} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40" />
               
               <div className="absolute bottom-8 left-8 right-8">
                 <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-primary rounded uppercase font-black text-xs tracking-widest">{article.category}</span>
                    <span className="text-xs font-bold opacity-60 uppercase tracking-widest">{formatDate(article.publishedAt)}</span>
                 </div>
                 <h1 className="text-3xl md:text-5xl font-display font-extrabold leading-[1.1] tracking-tight">{article.title}</h1>
               </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
               <div className="max-w-3xl mx-auto">
                 <div className="flex items-center justify-between mb-12 py-4 border-y border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-black text-primary">
                         {article.author[0]}
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-widest">{article.author}</p>
                          <p className="text-[10px] opacity-40 uppercase tracking-widest">{article.source}</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <button className="w-10 h-10 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-colors"><Volume2 className="w-4 h-4" /></button>
                       <button className="w-10 h-10 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-colors"><Languages className="w-4 h-4" /></button>
                       <button className="w-10 h-10 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-colors"><Bookmark className="w-4 h-4" /></button>
                       <button className="w-10 h-10 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-colors"><Share2 className="w-4 h-4" /></button>
                    </div>
                 </div>

                 <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-xl md:text-2xl opacity-90 font-light leading-relaxed mb-8">
                       {article.description}
                    </p>
                    <div className="text-base md:text-lg opacity-70 leading-relaxed font-sans whitespace-pre-wrap">
                       {article.content}
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
