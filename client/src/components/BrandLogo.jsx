import React from 'react';

export default function BrandLogo({ className = "h-9", showText = true }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none cursor-pointer group">
      {/* Crown + Stylized 'W' Wave matching official flyer & shirt print */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Crown Motif */}
        <svg
          viewBox="0 0 40 18"
          fill="currentColor"
          className="w-5 sm:w-6 h-auto text-amber-400 group-hover:scale-110 transition-transform mb-0.5"
        >
          <path d="M 4 16 L 2 4 L 12 10 L 20 2 L 28 10 L 38 4 L 36 16 Z" />
        </svg>

        {/* Sharp Streetwear Double-V Wave */}
        <svg 
          viewBox="0 0 100 65" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} aspect-[10/6.5] text-white transition-transform group-hover:scale-105 duration-200`}
        >
          {/* Main Sharp Chevron W */}
          <path 
            d="M 5 5 L 32 62 L 50 25 L 68 62 L 95 5 L 80 5 L 62 46 L 50 22 L 38 46 L 20 5 Z" 
            fill="currentColor" 
          />
          {/* Inner Accent Notch */}
          <path 
            d="M 40 5 L 50 20 L 60 5 Z" 
            fill="#d4d4d8" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-black tracking-widest text-lg sm:text-xl uppercase text-white leading-none font-street group-hover:text-amber-300 transition-colors">
            WRON_WAVE
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.38em] uppercase text-zinc-400 font-bold mt-0.5 font-mono">
            CLOTHING
          </span>
        </div>
      )}
    </div>
  );
}
