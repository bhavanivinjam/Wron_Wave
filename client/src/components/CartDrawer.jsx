import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, MessageCircle, Truck } from 'lucide-react';
import { BRAND_INFO } from '../data/mockProducts';

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
      setCouponError('Invalid coupon. Use WAVE50 for 50% off');
    }
  };

  // WhatsApp formatted order string
  const handleWhatsAppCartOrder = () => {
    if (!cartItems.length) return;

    let text = `*New Order - WRON_WAVE CLOTHING*\n`;
    text += `------------------------------------\n`;
    cartItems.forEach((item, index) => {
      text += `${index + 1}. *${item.name}*\n   Size: ${item.size} | Qty: ${item.quantity} | Price: ₹${item.price * item.quantity}\n`;
    });
    text += `------------------------------------\n`;
    text += `Subtotal: ₹${subtotal}\n`;
    if (isDiscounted) {
      text += `Discount (50% WAVE50): -₹${discountAmount}\n`;
    }
    text += `*Final Amount: ₹${finalTotal}*\n`;
    text += `Delivery: Hyderabad Door Delivery (COD/UPI)\n\n`;
    text += `Please confirm my order and share delivery details!`;

    const url = `https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
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
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider">
                Your Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-850 text-zinc-400 hover:text-white transition"
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
                  <p className="text-xs text-zinc-500 mt-1">Grab fresh streetwear from our collection</p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white text-black font-bold uppercase text-xs rounded-lg hover:bg-zinc-200 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 p-3.5 bg-zinc-900/70 border border-zinc-850 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-lg bg-zinc-800 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id, item.size)}
                          className="text-zinc-500 hover:text-red-400 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Size: <span className="text-white font-semibold">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden bg-zinc-800">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.size, item.quantity - 1)}
                          className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1)}
                          className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-white">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Calculations and Checkout */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-zinc-850 bg-zinc-950 space-y-4">
              
              {/* Promo code box */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code (e.g. WAVE50)"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase rounded-lg text-white transition"
                  >
                    Apply
                  </button>
                </div>

                {/* Quick WAVE50 auto apply shortcut if not applied */}
                {!isDiscounted && (
                  <button
                    type="button"
                    onClick={() => setAppliedCoupon('WAVE50')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    <Tag className="w-3 h-3" /> Click here to apply 50% OFF promo code (WAVE50)
                  </button>
                )}

                {couponError && <p className="text-xs text-red-400">{couponError}</p>}
                {isDiscounted && (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ 50% discount coupon applied!
                  </p>
                )}
              </form>

              {/* Price Details */}
              <div className="space-y-2 text-xs border-t border-zinc-850 pt-3">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal}</span>
                </div>
                
                {isDiscounted && (
                  <div className="flex justify-between text-emerald-400">
                    <span>50% Launch Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-zinc-400" />
                    Delivery (Hyderabad)
                  </span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-black text-white border-t border-zinc-800 pt-2">
                  <span>Estimated Total</span>
                  <span className="text-amber-300">₹{finalTotal}</span>
                </div>
              </div>

              {/* Dual Order Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* Instant WhatsApp Order */}
                <button
                  onClick={handleWhatsAppCartOrder}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition active:scale-98 shadow-lg shadow-emerald-950/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp (Instant)</span>
                </button>

                {/* Standard Web Checkout */}
                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <span>Checkout (COD / UPI)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

