import React from 'react';
import { Layers, Sparkles, Compass, Shirt, Scissors, Flame } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Collections', icon: Layers },
  { id: 'printed-tees', label: 'Printed T-Shirts', icon: Flame, tag: 'Unique Art' },
  { id: 'overseas-tees', label: 'Overseas T-Shirts', icon: Compass, tag: 'Imported' },
  { id: 'vintage-formal', label: 'Vintage Classic Shirts', icon: Shirt, tag: 'Retro' },
  { id: 'baggy-jeans', label: 'Baggy Jeans (90s)', icon: Scissors, tag: 'Skate Cut' },
  { id: 'youth-outfits', label: 'Gen-Z Outfits', icon: Sparkles, tag: 'Trending' },
];

export default function CollectionTabs({ activeCategory, onSelectCategory }) {
  return (
    <div className="py-6 border-b border-zinc-900 sticky top-16 sm:top-20 z-30 bg-zinc-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                    : 'bg-zinc-900/80 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-850 hover:border-zinc-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-500'}`} />
                <span>{cat.label}</span>
                {cat.tag && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {cat.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

