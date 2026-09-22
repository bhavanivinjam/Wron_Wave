import React from 'react';
import { ShoppingBag, Phone, ShieldCheck, Search, Sparkles, Package, Ruler } from 'lucide-react';
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
  setActiveCategory,
  onOpenTracker,
  onOpenSizeGuide
}) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/90">
      
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo */}
        <div 
          onClick={() => {
            setActiveCategory('all');
            setSearchTerm('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className="flex-shrink-0 cursor-pointer"
        >
          <BrandLogo />
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search oversized tees, 90s baggy jeans, vintage shirts..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 transition-all font-sans"
          />
        </div>

        {/* Center/Right Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Track Order Button */}
          <button
            onClick={onOpenTracker}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:text-white hover:border-zinc-600 transition font-mono"
            title="Track your order delivery"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Order</span>
          </button>

          {/* Size Guide Button */}
          <button
            onClick={() => onOpenSizeGuide && onOpenSizeGuide('printed-tees')}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:text-white hover:border-zinc-600 transition font-mono"
            title="View Streetwear Size Chart"
          >
            <Ruler className="w-3.5 h-3.5 text-zinc-400" />
            <span>Size Chart</span>
          </button>

          {/* Instagram Button */}
          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow @wron_wave on Instagram"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:text-white hover:border-pink-500/50 transition font-mono"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>@wron_wave</span>
          </a>

          {/* WhatsApp Direct Phone */}
          <a
            href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent('Hi WRON_WAVE! I would like to order clothing with Hyderabad delivery.')}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-emerald-900/50 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40 transition font-mono"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>7675833094</span>
          </a>

          {/* Admin Toggle */}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition ${
              isAdmin 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                : 'text-zinc-400 hover:text-zinc-200 border-zinc-800 bg-zinc-900/60'
            }`}
            title="Toggle Admin Orders Portal"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden lg:inline font-mono">{isAdmin ? 'Store' : 'Admin'}</span>
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white text-black hover:bg-zinc-200 transition-transform active:scale-95 shadow-md shadow-white/5"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] sm:text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Sub-Header: Search & Quick Links */}
      <div className="md:hidden px-4 pb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search drops..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>
        
        <button
          onClick={onOpenTracker}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-mono flex items-center gap-1"
        >
          <Package className="w-3.5 h-3.5 text-amber-400" />
          <span>Track</span>
        </button>
      </div>
    </header>
  );
}
