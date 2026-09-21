import React from 'react';
import { Tag, Truck, MessageCircle, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { BRAND_INFO } from '../data/mockProducts';

export default function Hero({ onExploreClick, onApplyCoupon }) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950 py-12 sm:py-20">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-zinc-800/20 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Hero & Typography */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-zinc-900 border border-zinc-700/80 text-zinc-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Wear Your Story
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-zinc-900 border border-zinc-700/80 text-zinc-300">
                Good Clothes Better Days
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                <Truck className="w-3.5 h-3.5" /> Hyderabad Fast Delivery
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-none">
                STYLE FOR <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 underline decoration-zinc-700 decoration-wavy decoration-1">
                  EVERY VIBE.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Exclusive drop of heavyweight graphic tees, imported overseas fits, vintage button-down shirts, and authentic 90s baggy denim. Crafted for the streets.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-7 py-3.5 bg-white text-black font-bold uppercase tracking-wider text-xs sm:text-sm rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-white/5 active:scale-95"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent('Hi WRON_WAVE! I saw your collection and want to order via WhatsApp.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs sm:text-sm rounded-lg border border-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Trust Stats */}
            <div className="pt-4 border-t border-zinc-900 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">50%</p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">First 10 Orders</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">Heavyweight Cotton</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">Hyd</p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">Doorstep Delivery</p>
              </div>
            </div>

          </div>

          {/* Right Column: Promotional 50% Off Ticket Card (Matching the poster style) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-dashed border-zinc-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden group">
              
              {/* Corner badge */}
              <div className="absolute -top-1 -right-1 bg-white text-black font-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-bl-xl shadow">
                LAUNCH SPECIAL
              </div>

              {/* Distressed Header */}
              <div className="text-center space-y-1 pb-6 border-b border-dashed border-zinc-800">
                <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-semibold">
                  WRON_WAVE EXCLUSIVE
                </span>
                <div className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
                  FIRST 10
                </div>
                <div className="text-xs uppercase tracking-widest text-zinc-400">
                  CUSTOMERS GET A MASSIVE
                </div>
                <div className="inline-block bg-white text-black font-black text-5xl sm:text-6xl px-4 py-1 rounded-lg my-2 transform -rotate-1 shadow-xl">
                  50% OFF
                </div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">
                  ON THEIR ENTIRE FIRST ORDER
                </p>
              </div>

              {/* Coupon Code Strip */}
              <div className="mt-6 p-4 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">PROMO CODE</p>
                  <p className="text-lg font-mono font-bold tracking-widest text-amber-400">WAVE50</p>
                </div>
                <button
                  onClick={() => onApplyCoupon('WAVE50')}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition active:scale-95 flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Claim Code</span>
                </button>
              </div>

              {/* Contact direct footer */}
              <div className="mt-4 pt-4 border-t border-zinc-900/90 flex items-center justify-between text-xs text-zinc-400">
                <span>Orders & Enquiries:</span>
                <span className="font-mono text-white font-bold tracking-wider">7675833094</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

