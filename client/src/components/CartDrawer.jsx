import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, MessageCircle, Truck, ShieldCheck, Check } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import TelegramIcon from './TelegramIcon';
import { BRAND_INFO } from '../data/mockProducts';
import { sendWhatsAppOrder, sendInstagramOrder, sendTelegramOrder } from '../utils/orderChannels';
import { saveCustomerOrder } from '../services/cloudDb';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  setAppliedCoupon
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isDiscounted = appliedCoupon === 'WAVE50';
  const discountAmount = isDiscounted ? Math.round(subtotal * 0.5) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = (couponInput || '').trim().toUpperCase();
    if (code === 'WAVE50') {
      setAppliedCoupon('WAVE50');
      setCouponError('');
    } else {
      setCouponError('Invalid code. Use WAVE50 for 50% launch discount');
    }
  };

  const getCartPayload = () => ({
    items: cartItems.map(item => ({
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      fabricType: item.fabricType
    })),
    subtotal,
    discount: discountAmount,
    total: finalTotal,
    coupon: appliedCoupon
  });

  const recordCartOrder = (channelName) => {
    const payload = getCartPayload();
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

  const handleWhatsApp = () => {
    if (!cartItems.length) return;
    recordCartOrder('WhatsApp (Bag Order)');
    sendWhatsAppOrder(getCartPayload());
  };

  const handleInstagram = () => {
    if (!cartItems.length) return;
    recordCartOrder('Instagram DM (Bag Order)');
    sendInstagramOrder(getCartPayload());
  };

  const handleTelegram = () => {
    if (!cartItems.length) return;
    recordCartOrder('Telegram (Bag Order)');
    sendTelegramOrder(getCartPayload());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">
                Your Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-zinc-500">
                <ShoppingBag className="w-16 h-16 stroke-[1.2] text-zinc-700" />
                <div>
                  <p className="text-base font-bold text-zinc-300">Your bag is empty</p>
                  <p className="text-xs text-zinc-500 mt-1">Grab fresh streetwear drops from our collection</p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white text-black font-bold uppercase text-xs rounded-xl hover:bg-zinc-200 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-3 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-850"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-22 sm:w-20 sm:h-24 object-cover rounded-xl bg-zinc-950 flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-black uppercase leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id, item.size)}
                          className="text-zinc-500 hover:text-red-400 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          Size: <strong className="text-white">{item.size}</strong>
                        </span>
                        {item.fabricType && (
                          <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                            {item.fabricType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Qty & Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-850">
                      <div className="flex items-center gap-2 border border-zinc-800 rounded-lg p-0.5 bg-zinc-950">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-white">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-zinc-800 bg-zinc-950 space-y-3">
              
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Promo Code (WAVE50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 uppercase tracking-wider font-mono focus:outline-none focus:border-amber-400"
                  />
                  {isDiscounted && (
                    <span className="absolute right-2.5 top-2 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> 50% OFF
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl uppercase transition font-mono"
                >
                  Apply
                </button>
              </form>
              {couponError && <p className="text-[10px] text-red-400">{couponError}</p>}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200">₹{subtotal}</span>
                </div>
                {isDiscounted && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>First 10 Orders (WAVE50)</span>
                    <span className="font-mono">-₹{discountAmount} (50% OFF)</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Hyderabad Door Delivery</span>
                  <span className="text-emerald-400 font-mono font-bold uppercase text-[10px]">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                  <span>Final Payable:</span>
                  <span className="font-mono text-amber-400">₹{finalTotal}</span>
                </div>
              </div>

              {/* Direct Multi-Channel Checkout Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block text-center">
                  — Select Order Channel —
                </span>

                {/* 1. WhatsApp Button */}
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 shadow-md shadow-emerald-950/60"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Entire Bag via WhatsApp</span>
                </button>

                {/* 2. Instagram & Telegram Row */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleInstagram}
                    className="py-2.5 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-98 shadow"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>Instagram DM</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTelegram}
                    className="py-2.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-98 shadow"
                  >
                    <TelegramIcon className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </button>
                </div>

                {/* Web Checkout Form Fallback */}
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                >
                  <span>Or Enter Address on Web Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delivery info */}
              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-zinc-400" /> Doorstep Hyderabad Delivery
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> Cash on Delivery Available
                </span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
