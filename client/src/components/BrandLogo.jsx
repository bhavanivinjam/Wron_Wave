import React from 'react';

export default function BrandLogo({ className = "h-8", showText = true }) {
  return (
    <div className="flex items-center gap-3 select-none cursor-pointer">
      {/* Stylized Double-V Geometric 'W' Chevron Wave matching the poster */}
      <div className="relative flex items-center justify-center">
        <svg 
          viewBox="0 0 100 70" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} aspect-[10/7] text-white transition-transform hover:scale-105 duration-200`}
        >
          {/* Outer Sharp Streetwear W */}
          <path 
            d="M 5 5 L 32 65 L 50 25 L 68 65 L 95 5 L 80 5 L 62 48 L 50 22 L 38 48 L 20 5 Z" 
            fill="currentColor" 
          />
          {/* Inner Accent Notch */}
          <path 
            d="M 40 5 L 50 20 L 60 5 Z" 
            fill="#a1a1aa" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-black tracking-widest text-lg sm:text-xl uppercase text-white leading-none font-street">
            WRON_WAVE
          </span>
          <span className="text-[10px] tracking-[0.35em] uppercase text-zinc-400 font-semibold mt-0.5">
            CLOTHING
          </span>
        </div>
      )}
    </div>
  );
}

