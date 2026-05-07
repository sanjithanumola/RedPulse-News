import React from 'react';
import { TrendingUp, Zap } from 'lucide-react';

export default function NewsTicker() {
  const items = [
    "AI Regulation Framework Launched in India",
    "Hyderabad Sees 25% Increase in Tech Jobs",
    "New Quantum Breakthrough at TIFR",
    "T20 World Cup: Semi-Finals Approaching",
    "SpaceX Successfully Lands Starship in Indian Ocean"
  ];

  return (
    <div className="bg-primary/10 border-y border-primary/20 py-2 relative overflow-hidden backdrop-blur-sm">
      <div className="flex items-center gap-4 px-6 relative z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary rounded text-[10px] font-black uppercase tracking-widest animate-pulse">
           <Zap className="w-3 h-3 fill-current" />
           Breaking
        </div>
        
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee h-full">
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center text-sm font-medium mr-12 opacity-90 hover:opacity-100 cursor-pointer">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                {item}
              </span>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="inline-block animate-marquee h-full" aria-hidden="true">
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center text-sm font-medium mr-12 opacity-90 hover:opacity-100 cursor-pointer">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
