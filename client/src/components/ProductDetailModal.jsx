import React, { useState } from 'react';
import { X, Sparkles, ShoppingBag, Phone, Check, ShieldCheck, Ruler, Truck, RotateCcw } from 'lucide-react';
import { BRAND_INFO } from '../data/mockProducts';

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onQuickWhatsApp, 
  onOpenSizeGuide 
}) {
  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [isAdded, setIsAdded] = useState(false);

  const discountedPrice = Math.round(product.price * 0.5);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 flex flex-col justify-between bg-zinc-900/30 border-b md:border-b-0 md:border-r border-zinc-800/80">
          {/* Main Selected Image */}
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.tag && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm border border-zinc-700 text-white text-[10px] font-black uppercase tracking-wider rounded-md">
                {product.tag}
              </span>
            )}
            {/* View angle badge */}
            <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-zinc-300 text-[9px] font-mono uppercase tracking-wider rounded">
              {activeImageIndex === 0 ? "Front View" : activeImageIndex === 1 ? "Back / Fit" : "Fabric Detail"}
            </span>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImageIndex === idx 
                      ? 'border-amber-400 ring-2 ring-amber-400/20' 
                      : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center text-zinc-300 py-0.5">
                    {idx === 0 ? 'Front' : idx === 1 ? 'Back' : 'Detail'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Purchase Actions */}
        <div className="md:w-1/2 p-5 sm:p-7 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            {/* Category & Badge */}
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="uppercase tracking-wider font-mono">{product.categoryLabel}</span>
              {product.stockCount && (
                <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
                  🔥 Only {product.stockCount} drops left
                </span>
              )}
            </div>

            {/* Product Title */}
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              {product.name}
            </h2>

            {/* Price section with 50% launch banner */}
            <div className="mt-3 p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-amber-400">₹{discountedPrice}</span>
                <span className="text-sm text-zinc-500 line-through">₹{product.price}</span>
                <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-[10px] font-black rounded uppercase">
                  50% Launch OFF
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Use code <span className="text-white font-mono font-bold">WAVE50</span> at checkout for first 10 orders.
              </p>
            </div>

            {/* Garment Specifications */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-zinc-300">
              {product.gsm && (
                <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
                  <span className="text-zinc-500 block text-[10px] uppercase">Fabric Weight</span>
                  <span className="font-semibold text-white">{product.gsm}</span>
                </div>
              )}
              {product.fit && (
                <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
                  <span className="text-zinc-500 block text-[10px] uppercase">Fit Silhouette</span>
                  <span className="font-semibold text-white">{product.fit}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-400 leading-relaxed mt-4">
              {product.description}
            </p>

            {/* Model sizing info */}
            {product.modelInfo && (
              <p className="text-[11px] text-zinc-500 italic mt-2">
                ℹ️ {product.modelInfo}
              </p>
            )}

            {/* Size Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-white">Select Size:</span>
                <button
                  type="button"
                  onClick={() => onOpenSizeGuide && onOpenSizeGuide(product.category)}
                  className="text-amber-400 hover:underline flex items-center gap-1 text-xs font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-10 px-3 rounded-lg text-xs font-bold font-mono transition border ${
                      selectedSize === size
                        ? 'bg-white text-black border-white shadow-lg'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-zinc-800">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAdd}
                className="py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-lg"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onQuickWhatsApp(product, selectedSize)}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-emerald-950/50"
              >
                <Phone className="w-4 h-4" />
                <span>Order WhatsApp</span>
              </button>
            </div>

            {/* Delivery & Trust highlights */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-zinc-400" /> Door Delivery Hyderabad
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> 100% Quality Checked
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
