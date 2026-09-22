import React from 'react';
import { Sparkles, Truck, Flame, Tag } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { BRAND_INFO } from '../data/mockProducts';

export default function MarqueeTicker({ onApplyCoupon }) {
  const items = [
    { icon: <Truck className="w-3.5 h-3.5 text-emerald-400 inline" />, text: "EXPRESS DOOR DELIVERY IN HYDERABAD" },
    { icon: <Flame className="w-3.5 h-3.5 text-amber-400 inline" />, text: "FIRST 10 CUSTOMERS GET 50% OFF" },
    { icon: <Tag className="w-3.5 h-3.5 text-pink-400 inline" />, text: "USE CODE: WAVE50" },
    { icon: <Sparkles className="w-3.5 h-3.5 text-amber-300 inline" />, text: "WEAR YOUR STORY • GOOD CLOTHES BETTER DAYS" },
    { icon: <InstagramIcon className="w-3.5 h-3.5 text-pink-400 inline" />, text: "TAG US @WRON_WAVE TO BE FEATURED" },
    { icon: <Truck className="w-3.5 h-3.5 text-emerald-400 inline" />, text: "DIRECT CASH ON DELIVERY & UPI AVAILABLE" },
  ];

  return (
    <div className="bg-zinc-950 border-b border-zinc-900 overflow-hidden py-2 select-none">
      <div className="flex w-max animate-marquee space-x-8 text-[11px] uppercase tracking-widest font-mono text-zinc-400">
        {/* Render twice for infinite loop */}
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            {item.icon}
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => onApplyCoupon && onApplyCoupon('WAVE50')}>
              {item.text}
            </span>
            <span className="text-zinc-700 ml-4 font-normal">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
