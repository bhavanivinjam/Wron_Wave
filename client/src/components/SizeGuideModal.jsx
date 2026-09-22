import React, { useState } from 'react';
import { X, Ruler, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose, category = 'printed-tees' }) {
  const [unit, setUnit] = useState('in'); // 'in' or 'cm'
  const [activeTab, setActiveTab] = useState(
    category.includes('jean') ? 'bottoms' : 'tops'
  );

  if (!isOpen) return null;

  const topsData = [
    { size: 'S', chest: unit === 'in' ? '42"' : '107 cm', length: unit === 'in' ? '28.5"' : '72 cm', shoulder: unit === 'in' ? '20.5"' : '52 cm' },
    { size: 'M', chest: unit === 'in' ? '44"' : '112 cm', length: unit === 'in' ? '29.5"' : '75 cm', shoulder: unit === 'in' ? '21.5"' : '55 cm' },
    { size: 'L', chest: unit === 'in' ? '46"' : '117 cm', length: unit === 'in' ? '30.5"' : '77 cm', shoulder: unit === 'in' ? '22.5"' : '57 cm' },
    { size: 'XL', chest: unit === 'in' ? '48"' : '122 cm', length: unit === 'in' ? '31.5"' : '80 cm', shoulder: unit === 'in' ? '23.5"' : '60 cm' },
    { size: 'XXL', chest: unit === 'in' ? '50"' : '127 cm', length: unit === 'in' ? '32.5"' : '82 cm', shoulder: unit === 'in' ? '24.5"' : '62 cm' },
  ];

  const bottomsData = [
    { size: '30', waist: unit === 'in' ? '31"' : '79 cm', hip: unit === 'in' ? '42"' : '107 cm', length: unit === 'in' ? '41.5"' : '105 cm', legOpening: unit === 'in' ? '18"' : '46 cm' },
    { size: '32', waist: unit === 'in' ? '33"' : '84 cm', hip: unit === 'in' ? '44"' : '112 cm', length: unit === 'in' ? '42.0"' : '107 cm', legOpening: unit === 'in' ? '19"' : '48 cm' },
    { size: '34', waist: unit === 'in' ? '35"' : '89 cm', hip: unit === 'in' ? '46"' : '117 cm', length: unit === 'in' ? '42.5"' : '108 cm', legOpening: unit === 'in' ? '19.5"' : '50 cm' },
    { size: '36', waist: unit === 'in' ? '37"' : '94 cm', hip: unit === 'in' ? '48"' : '122 cm', length: unit === 'in' ? '43.0"' : '109 cm', legOpening: unit === 'in' ? '20"' : '51 cm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black uppercase tracking-tight text-white">
              Streetwear Size & Fit Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection & Unit Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('tops')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition ${
                activeTab === 'tops' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tees, Shirts & Hoodies
            </button>
            <button
              onClick={() => setActiveTab('bottoms')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition ${
                activeTab === 'bottoms' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              90s Baggy Jeans & Pants
            </button>
          </div>

          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800 text-xs font-bold">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded transition ${unit === 'in' ? 'bg-amber-400 text-black' : 'text-zinc-400'}`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded transition ${unit === 'cm' ? 'bg-amber-400 text-black' : 'text-zinc-400'}`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="mt-5 overflow-x-auto">
          {activeTab === 'tops' ? (
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[11px] font-mono border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest Circumference</th>
                  <th className="py-2.5 px-3">Length</th>
                  <th className="py-2.5 px-3">Shoulder Drop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 font-mono">
                {topsData.map((row) => (
                  <tr key={row.size} className="hover:bg-zinc-900/40">
                    <td className="py-3 px-3 font-bold text-white bg-zinc-900/30">{row.size}</td>
                    <td className="py-3 px-3">{row.chest}</td>
                    <td className="py-3 px-3">{row.length}</td>
                    <td className="py-3 px-3">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[11px] font-mono border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Waist Size</th>
                  <th className="py-2.5 px-3">Relaxed Waist</th>
                  <th className="py-2.5 px-3">Hip</th>
                  <th className="py-2.5 px-3">Outseam Length</th>
                  <th className="py-2.5 px-3">Leg Opening</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 font-mono">
                {bottomsData.map((row) => (
                  <tr key={row.size} className="hover:bg-zinc-900/40">
                    <td className="py-3 px-3 font-bold text-white bg-zinc-900/30">{row.size}</td>
                    <td className="py-3 px-3">{row.waist}</td>
                    <td className="py-3 px-3">{row.hip}</td>
                    <td className="py-3 px-3">{row.length}</td>
                    <td className="py-3 px-3">{row.legOpening}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Fit Advice Notice */}
        <div className="mt-6 p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl flex items-start gap-3 text-xs text-zinc-400">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-white font-bold">WRON_WAVE Fit Advice:</span> All our tees and hoodies feature a generous oversized boxy drape. Stick to your true size for the intended relaxed streetwear silhouette. If you prefer a regular/snug fit, size down by one.
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-zinc-200 transition"
          >
            Got It, Back to Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
