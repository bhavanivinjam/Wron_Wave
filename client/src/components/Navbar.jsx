import React from 'react';
import { ShoppingBag, Phone, ShieldCheck, Search, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';
import InstagramIcon from './InstagramIcon';
import { BRAND_INFO } from '../data/mockProducts';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  searchTerm, 
  setSearchTerm, 
  isAdmin, 
  setIsAdmin,
  activeCategory,
  setActiveCategory
}) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-zinc-900 via-neutral-800 to-zinc-900 text-xs py-1.5 px-4 text-center border-b border-zinc-800/80 flex items-center justify-center gap-3 font-medium">
        <span className="flex items-center gap-1.5 text-zinc-300">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          DOOR DELIVERY IN HYDERABAD AREAS
        </span>
        <span className="text-zinc-600 hidden sm:inline">•</span>
        <span className="text-amber-400 font-semibold tracking-wide hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> FIRST 10 CUSTOMERS: GET 50% OFF (CODE: WAVE50)
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div onClick={() => setActiveCategory('all')} className="flex-shrink-0">
          <BrandLogo />
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search oversized tees, 90s baggy jeans, vintage shirts..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Instagram Button */}
          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow @wron_wave on Instagram"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-600 transition"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
            <span className="font-mono">@wron_wave</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent('Hi WRON_WAVE! I want to check out your collection.')}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-emerald-900/50 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>7675833094</span>
          </a>

          {/* Admin Toggle */}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition ${
              isAdmin 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                : 'text-zinc-400 hover:text-zinc-200 border-zinc-800 bg-zinc-900/50'
            }`}
            title="Toggle Admin Orders Portal"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden lg:inline">{isAdmin ? 'Store View' : 'Admin'}</span>
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-transform active:scale-95 shadow-md shadow-white/5"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] sm:text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search streetwear collection..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>
      </div>
    </header>
  );
}
