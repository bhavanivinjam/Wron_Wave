import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Check, Flame } from 'lucide-react';
import { BRAND_INFO } from '../data/mockProducts';

export default function ProductCard({ product, onAddToCart, onQuickWhatsApp }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const discountedPrice = Math.round(product.price * 0.5);

  return (
    <div className="group bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-700 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-black/50">
      
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.tag && (
            <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-zinc-700 text-white text-[10px] font-bold uppercase tracking-wider rounded">
              {product.tag}
            </span>
          )}
          <span className="px-2 py-0.5 bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider rounded self-start">
            50% OFF AVAILABLE
          </span>
        </div>

        {/* Category Label Chip */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
          <span className="text-[10px] text-zinc-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded uppercase tracking-wider font-medium truncate block max-w-full">
            {product.categoryLabel}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight group-hover:text-zinc-200 transition line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Sizing Chips */}
          <div className="mt-3">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1.5">
              Select Size:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-xs font-semibold flex items-center justify-center transition ${
                    selectedSize === size
                      ? 'bg-white text-black font-bold ring-2 ring-white/50'
                      : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300 border border-zinc-700/60'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-zinc-850 space-y-3">
          
          {/* Price breakdown */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-white">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-500 line-through ml-2">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-400 font-semibold block">
                With WAVE50 code:
              </span>
              <span className="text-xs font-bold text-amber-300">
                ₹{discountedPrice}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* Add to Bag */}
            <button
              onClick={handleAdd}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-black hover:bg-zinc-200 active:scale-95'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            {/* Direct WhatsApp Order */}
            <button
              onClick={() => onQuickWhatsApp(product, selectedSize)}
              className="py-2.5 px-2 rounded-lg text-xs font-semibold bg-zinc-800/90 hover:bg-emerald-950/50 hover:text-emerald-300 hover:border-emerald-700/60 border border-zinc-700 text-zinc-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              title="Quick Order this item on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

