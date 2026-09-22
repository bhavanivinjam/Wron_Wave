import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Check, Eye, Ruler, Flame } from 'lucide-react';
import { BRAND_INFO } from '../data/mockProducts';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onQuickWhatsApp, 
  onOpenQuickView, 
  onOpenSizeGuide 
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const currentImage = (isHovered && images.length > 1) ? images[1] : images[0];

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const discountedPrice = Math.round(product.price * 0.5);

  return (
    <div 
      className="group bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950 cursor-pointer" onClick={() => onOpenQuickView && onOpenQuickView(product)}>
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.tag && (
            <span className="px-2.5 py-0.5 bg-black/80 backdrop-blur-md border border-zinc-700 text-white text-[10px] font-black uppercase tracking-wider rounded-md">
              {product.tag}
            </span>
          )}
          <span className="px-2 py-0.5 bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider rounded-md self-start">
            50% OFF CODE
          </span>
        </div>

        {/* Stock Urgency Tag */}
        {product.stockCount && product.stockCount <= 5 && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="px-2 py-0.5 bg-amber-950/90 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold rounded-md flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Only {product.stockCount} left
            </span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenQuickView && onOpenQuickView(product);
          }}
          className="absolute inset-x-4 bottom-11 py-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-700 text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 hover:bg-black z-20 shadow-xl"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View / Multi-Angle</span>
        </button>

        {/* Category & GSM Badge Footer */}
        <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] text-zinc-300 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded uppercase tracking-wider font-mono truncate max-w-[65%]">
            {product.categoryLabel}
          </span>
          {product.gsm && (
            <span className="text-[9px] text-amber-300 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 px-1.5 py-0.5 rounded font-mono">
              {product.gsm}
            </span>
          )}
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Title */}
          <h3 
            onClick={() => onOpenQuickView && onOpenQuickView(product)}
            className="text-sm sm:text-base font-black text-white uppercase tracking-tight group-hover:text-amber-400 transition line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Sizing Chips & Size Guide Link */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5 text-[10px] font-semibold">
              <span className="uppercase tracking-wider text-zinc-500">
                Select Size:
              </span>
              <button
                type="button"
                onClick={() => onOpenSizeGuide && onOpenSizeGuide(product.category)}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3 h-3" />
                <span>Size Chart</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold font-mono flex items-center justify-center transition ${
                    selectedSize === size
                      ? 'bg-white text-black font-bold ring-2 ring-white/50 shadow-md'
                      : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-zinc-800 space-y-3">
          
          {/* Price breakdown */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg sm:text-xl font-black text-white font-mono">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-500 line-through ml-2 font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-400 font-semibold block uppercase font-mono">
                With WAVE50 Code:
              </span>
              <span className="text-xs font-black text-amber-300 font-mono">
                ₹{discountedPrice}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* Add to Bag */}
            <button
              onClick={handleAdd}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
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
              className="py-2.5 px-2 rounded-xl text-xs font-bold bg-zinc-800/90 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-700/60 border border-zinc-700 text-zinc-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
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
