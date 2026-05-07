import React from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { NewsArticle } from '../../types';
import { cn, formatDate } from '../../lib/utils';

interface NewsCardProps {
  article: NewsArticle;
  onClick: (article: NewsArticle) => void;
  featured?: boolean;
  key?: string | number;
}

export default function NewsCard({ article, onClick, featured }: NewsCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(article)}
      className={cn(
        "group cursor-pointer relative rounded-2xl overflow-hidden glass hover:border-primary/30 transition-all duration-500",
        featured ? "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto" : "aspect-[4/3]"
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={article.urlToImage} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-0.5 bg-primary rounded text-[10px] font-bold uppercase tracking-widest">
            {article.category}
          </span>
          {article.location && (
            <span className="px-2.5 py-0.5 bg-white/10 rounded text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              {article.location}
            </span>
          )}
        </div>

        <h3 className={cn(
          "font-display font-bold leading-tight group-hover:text-primary transition-colors",
          featured ? "text-2xl md:text-4xl" : "text-lg md:text-xl"
        )}>
          {article.title}
        </h3>

        <div className={cn(
          "flex items-center gap-4 mt-4 text-[10px] uppercase tracking-wider font-bold opacity-60",
          featured ? "opacity-100" : ""
        )}>
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3" />
            {article.author}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {formatDate(article.publishedAt)}
          </div>
        </div>

        {featured && (
          <p className="mt-4 text-sm opacity-80 line-clamp-2 max-w-2xl font-medium">
            {article.description}
          </p>
        )}

        <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           Read Full Intelligence <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* AI Indicators */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-primary transition-colors">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
