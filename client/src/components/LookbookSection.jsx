import React from 'react';
import { Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { BRAND_INFO, LOOKBOOK_POSTS } from '../data/mockProducts';

export default function LookbookSection({ onSelectProduct }) {
  return (
    <section className="py-16 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMUNITY LOOKBOOK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Styled By The Wave
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Real streetwear drip captured across Hyderabad. Tag <span className="text-white font-mono">@wron_wave</span> on Instagram to be featured on our official drop feed.
            </p>
          </div>

          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-pink-500/30 text-white text-xs font-bold hover:border-pink-500 transition shadow-lg self-start sm:self-auto"
          >
            <InstagramIcon className="w-4 h-4 text-pink-400" />
            <span>Follow @wron_wave</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-pink-400" />
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {LOOKBOOK_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 aspect-[4/5] flex flex-col justify-end"
            >
              {/* Photo */}
              <img
                src={post.image}
                alt={post.product}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Tag pill */}
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-zinc-700 text-[10px] font-mono text-zinc-300">
                {post.tag}
              </span>

              {/* Content bottom */}
              <div className="relative p-3 sm:p-4 text-white space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-amber-300 font-bold">{post.user}</span>
                  <span className="flex items-center gap-1 text-zinc-400 text-[10px]">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {post.likes}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 font-medium truncate">
                  {post.product}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Community Callout Banner */}
        <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📸</span>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Wearing WRON_WAVE?
              </p>
              <p className="text-[11px] text-zinc-400">
                Post your OOTD, tag <span className="text-amber-400 font-mono font-semibold">@wron_wave</span>, and get a special 15% discount code sent to your DMs for your next drop!
              </p>
            </div>
          </div>
          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-bold font-mono transition flex-shrink-0"
          >
            DM us on Instagram
          </a>
        </div>

      </div>
    </section>
  );
}
