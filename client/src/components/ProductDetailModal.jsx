import React, { useState } from 'react';
import { X, ShoppingBag, Phone, Check, ShieldCheck, Ruler, Truck, Sparkles, Copy, MessageCircle } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import TelegramIcon from './TelegramIcon';
import { BRAND_INFO } from '../data/mockProducts';
import { sendWhatsAppOrder, sendInstagramOrder, sendTelegramOrder } from '../utils/orderChannels';
import { saveCustomerOrder } from '../services/cloudDb';

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onOpenSizeGuide 
}) {
  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'care'

  const discountedPrice = Math.round(product.price * 0.5);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const getOrderPayload = () => ({
    items: [{
      name: product.name,
      size: selectedSize,
      quantity: 1,
      price: discountedPrice,
      fabricType: product.fabricType
    }],
    subtotal: product.price,
    discount: product.price - discountedPrice,
    total: discountedPrice,
    coupon: 'WAVE50'
  });

  const recordDirectOrder = (channelName) => {
    const payload = getOrderPayload();
    saveCustomerOrder({
      id: `ORD-${Date.now().toString().slice(-4)}`,
      items: payload.items,
      subtotal: payload.subtotal,
      discount: payload.discount,
      total: payload.total,
      paymentMethod: 'UPI / COD',
      orderChannel: channelName,
      status: 'Channel Order Initiated',
      createdAt: new Date().toISOString()
    });
  };

  const handleDirectWhatsApp = () => {
    recordDirectOrder('WhatsApp (Drop Modal)');
    sendWhatsAppOrder(getOrderPayload());
  };

  const handleDirectInstagram = () => {
    recordDirectOrder('Instagram DM (Drop Modal)');
    sendInstagramOrder(getOrderPayload());
  };

  const handleDirectTelegram = () => {
    recordDirectOrder('Telegram (Drop Modal)');
    sendTelegramOrder(getOrderPayload());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 transition shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 flex flex-col justify-between bg-zinc-900/30 border-b md:border-b-0 md:border-r border-zinc-800/80">
          {/* Main Selected Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-inner">
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.tag && (
              <span className="absolute top-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md border border-zinc-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow">
                {product.tag}
              </span>
            )}
            <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-md text-zinc-200 text-[10px] font-mono uppercase tracking-wider rounded-md border border-zinc-800">
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
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImageIndex === idx 
                      ? 'border-amber-400 ring-2 ring-amber-400/20 scale-102' 
                      : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-center text-zinc-300 py-0.5 font-mono">
                    {idx === 0 ? 'Front' : idx === 1 ? 'Back' : 'Texture'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Garment Details & Multi-Channel Ordering */}
        <div className="md:w-1/2 p-5 sm:p-7 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            {/* Category & Stock */}
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="uppercase tracking-wider font-mono font-bold text-zinc-400">{product.categoryLabel}</span>
              {product.stockCount && (
                <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px] font-mono">
                  🔥 {product.stockCount} drops left
                </span>
              )}
            </div>

            {/* Product Title */}
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="mt-3 p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-amber-400 font-mono">₹{discountedPrice}</span>
                <span className="text-sm text-zinc-500 line-through font-mono">₹{product.price}</span>
                <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-700 text-emerald-400 text-[10px] font-black rounded uppercase">
                  50% Launch OFF
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Discount automatically applied for the first 10 orders with code <span className="text-white font-mono font-bold">WAVE50</span>.
              </p>
            </div>

            {/* Clothing Details Tabs (Specs vs Wash & Care) */}
            <div className="mt-4">
              <div className="flex border-b border-zinc-800 gap-4 text-xs font-bold uppercase tracking-wider mb-3">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1.5 transition ${activeTab === 'specs' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Clothing Specs & Fabric
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-1.5 transition ${activeTab === 'care' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Wash & Care
                </button>
              </div>

              {activeTab === 'specs' ? (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-mono">Fabric Type</span>
                      <span className="font-semibold text-zinc-100">{product.fabricType || '100% Combed Cotton'}</span>
                    </div>
                    <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-mono">Fabric Weight</span>
                      <span className="font-semibold text-zinc-100">{product.gsm || 'Heavyweight'}</span>
                    </div>
                  </div>

                  <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800/80 text-[11px]">
                    <span className="text-zinc-500 block text-[10px] uppercase font-mono">Fit & Silhouette</span>
                    <span className="font-semibold text-zinc-100">{product.fit || 'Streetwear Boxy Fit'}</span>
                  </div>

                  {product.printTech && (
                    <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800/80 text-[11px]">
                      <span className="text-zinc-500 block text-[10px] uppercase font-mono">Print & Stitch Technique</span>
                      <span className="font-semibold text-zinc-100">{product.printTech}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1.5">
                  <p className="font-semibold text-white">Garment Care Guidelines:</p>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    {product.care || 'Machine wash cold inside-out with like colors. Tumble dry on low or line dry in shade. Avoid iron directly over graphic prints.'}
                  </p>
                </div>
              )}
            </div>

            {/* Model sizing info */}
            {product.modelInfo && (
              <p className="text-[11px] text-zinc-400 italic mt-3 bg-zinc-900/40 p-2 rounded-lg border border-zinc-850">
                📏 {product.modelInfo}
              </p>
            )}

            {/* Size Selector */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-black uppercase tracking-wider text-white">Select Size:</span>
                <button
                  type="button"
                  onClick={() => onOpenSizeGuide && onOpenSizeGuide(product.category)}
                  className="text-amber-400 hover:underline flex items-center gap-1 text-xs font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>View Exact Size Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[46px] h-10 px-3 rounded-xl text-xs font-bold font-mono transition border ${
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

          {/* Social Commerce Purchase CTAs */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            
            {/* Add to Cart button */}
            <button
              type="button"
              onClick={handleAdd}
              className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-md"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to Shopping Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag (Size {selectedSize})</span>
                </>
              )}
            </button>

            {/* Direct Channel Order Buttons */}
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block mb-2 text-center">
                — Or Buy Directly Via Social Channels —
              </span>
              
              <div className="grid grid-cols-3 gap-2">
                {/* 1. WhatsApp */}
                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-950/60"
                  title="Buy directly on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                {/* 2. Instagram */}
                <button
                  type="button"
                  onClick={handleDirectInstagram}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
                  title="Order via Instagram DM"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Insta DM</span>
                </button>

                {/* 3. Telegram */}
                <button
                  type="button"
                  onClick={handleDirectTelegram}
                  className="py-2.5 px-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
                  title="Order via Telegram channel"
                >
                  <TelegramIcon className="w-4 h-4" />
                  <span>Telegram</span>
                </button>
              </div>
            </div>

            {/* Delivery highlights */}
            <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-zinc-400" /> Door Delivery Hyderabad
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> Pay Cash on Delivery / UPI
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
