import React from 'react';
import { Cloud, TrendingUp, TrendingDown, Bitcoin, Landmark, Zap } from 'lucide-react';

export default function SidebarWidgets() {
  return (
    <div className="space-y-6">
      {/* Weather */}
      <div className="glass p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 blur-3xl group-hover:bg-primary/40 transition-all" />
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50">Local Status</h3>
           <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/5">Hyderabad, IN</span>
        </div>
        <div className="flex items-center gap-4">
           <Cloud className="w-10 h-10 text-white/50" />
           <div>
              <p className="text-3xl font-display font-bold">34°C</p>
              <p className="text-xs opacity-60">Mostly Cloudy • PM Rainfall</p>
           </div>
        </div>
      </div>

      {/* Markets */}
      <div className="glass p-5 rounded-2xl">
         <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Market Pulse</h3>
         <div className="space-y-4">
            <MarketItem label="SENSEX" price="74,120.50" change="+1.2%" up />
            <MarketItem label="NIFTY 50" price="22,450.15" change="+0.8%" up />
            <MarketItem label="BTC/USD" price="$142,500" change="-0.4%" />
            <MarketItem label="GOLD" price="72,400" change="+0.2%" up />
         </div>
         <button className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all">View All Markers</button>
      </div>

      {/* AI Newsletter */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-dark/40 border border-primary/20 red-glow">
         <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4" />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Neural Daily</h3>
         </div>
         <p className="text-xs opacity-80 mb-4 leading-relaxed">Get our AI-curated intelligence report delivered to your brain's inbox daily.</p>
         <div className="flex gap-2">
            <input type="email" placeholder="Email" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-primary transition-colors outline-none" />
            <button className="bg-white text-black px-3 rounded-lg text-xs font-black">JOIN</button>
         </div>
      </div>
    </div>
  );
}

function MarketItem({ label, price, change, up }: { label: string, price: string, change: string, up?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
         <div className={cn("w-1 h-4 rounded", up ? "bg-green-500" : "bg-red-500")} />
         <span className="text-xs font-bold tracking-tight">{label}</span>
      </div>
      <div className="text-right">
         <p className="text-xs font-bold">{price}</p>
         <p className={cn("text-[8px] font-black", up ? "text-green-500" : "text-red-500")}>{change}</p>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
