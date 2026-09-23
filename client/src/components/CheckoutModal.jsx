import React, { useState } from 'react';
import { X, CheckCircle, MessageCircle, Truck, ShieldCheck, Banknote, CreditCard, QrCode, Copy, Check } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import TelegramIcon from './TelegramIcon';
import { BRAND_INFO } from '../data/mockProducts';
import { sendWhatsAppOrder, sendInstagramOrder, sendTelegramOrder } from '../utils/orderChannels';
import { saveOrderToDatabase } from '../services/cloudDb';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onOrderSuccess
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Hyderabad',
    pincode: '',
    paymentMethod: 'UPI / QR Payment'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isDiscounted = appliedCoupon === 'WAVE50';
  const discountAmount = isDiscounted ? Math.round(subtotal * 0.5) : 0;
  const finalTotal = subtotal - discountAmount;
  const upiId = `${BRAND_INFO.whatsappNumber.replace(/^91/, '')}@okaxis`;

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      customer: formData,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        fabricType: item.fabricType
      })),
      subtotal,
      discount: discountAmount,
      total: finalTotal,
      coupon: appliedCoupon,
      paymentMethod: formData.paymentMethod,
      orderType: 'Web Checkout',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    try {
      // Save to Cloud DB / Google Sheets / LocalStorage
      await saveOrderToDatabase(orderPayload);
      setCompletedOrder(orderPayload);
      onOrderSuccess(orderPayload);
    } catch (err) {
      console.warn('Order save error:', err);
      setCompletedOrder(orderPayload);
      onOrderSuccess(orderPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getChannelPayload = () => {
    return completedOrder || {
      items: cartItems,
      subtotal,
      discount: discountAmount,
      total: finalTotal,
      coupon: appliedCoupon,
      customer: formData
    };
  };

  // UPI Intent URL for dynamic QR generator
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=WRON_WAVE_CLOTHING&am=${finalTotal}&cu=INR&tn=Order_${completedOrder?.id || 'WRON_WAVE'}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full text-white shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
              {completedOrder ? 'Order Confirmed' : 'Hyderabad Fast Checkout'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {completedOrder ? (
          /* Success Screen with UPI QR & Multi-Channel Confirmation */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-950 border border-emerald-800 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-400">Order Placed & Saved to Cloud</span>
              <h4 className="text-2xl font-black uppercase tracking-tight text-white font-mono">
                {completedOrder.id}
              </h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto pt-1">
                Thank you, <strong className="text-white">{formData.name}</strong>! Your drop is confirmed for Hyderabad doorstep delivery.
              </p>
            </div>

            {/* UPI Payment Box if chosen */}
            {formData.paymentMethod.includes('UPI') && (
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400 font-mono">
                  <QrCode className="w-4 h-4" />
                  <span>Scan to Pay via PhonePe / GPay / Paytm</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
                  {/* QR Image */}
                  <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-md flex items-center justify-center">
                    <img 
                      src={upiQrUrl} 
                      alt="UPI Payment QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-left space-y-1.5 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-mono">UPI ID</span>
                      <span className="font-mono font-bold text-white text-xs">{upiId}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-mono">Payable Amount</span>
                      <span className="font-mono font-black text-amber-400 text-sm">₹{completedOrder.total}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono flex items-center gap-1.5 transition"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUpi ? 'UPI ID Copied!' : 'Copy UPI ID'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Channels Confirmation Box */}
            <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-left space-y-2.5">
              <p className="text-xs font-bold text-amber-400 uppercase font-mono">
                Share Screenshot / Notify on Your Preferred App:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => sendWhatsAppOrder(getChannelPayload())}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md shadow-emerald-950/60"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify on WhatsApp (+91 {BRAND_INFO.whatsappNumber})</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => sendInstagramOrder(getChannelPayload())}
                    className="py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>Instagram DM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => sendTelegramOrder(getChannelPayload())}
                    className="py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                  >
                    <TelegramIcon className="w-4 h-4" />
                    <span>Telegram Channel</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl border border-zinc-800 transition"
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-4">
            
            {/* Delivery Alert */}
            <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl flex items-center gap-2.5 text-xs text-zinc-300">
              <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Door delivery across Hyderabad areas. Cash on delivery & UPI accepted.</span>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-bold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-bold mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-bold mb-1">
                  Delivery Address & Hyderabad Area *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat/House No, Colony, Area (e.g. Jubilee Hills / Madhapur / Banjara Hills)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Payment Method Radio */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-bold mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'UPI / QR Payment' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      formData.paymentMethod === 'UPI / QR Payment'
                        ? 'border-white bg-zinc-900 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs block">UPI / QR Payment</span>
                      <span className="text-[10px] text-zinc-500 font-normal">GPay, PhonePe, Paytm</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      formData.paymentMethod === 'Cash on Delivery'
                        ? 'border-white bg-zinc-900 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs block">Cash on Delivery</span>
                      <span className="text-[10px] text-zinc-500 font-normal">Pay at Doorstep</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-400 block font-mono">Total Payable:</span>
                {isDiscounted && (
                  <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                    Includes 50% launch discount (WAVE50)
                  </span>
                )}
              </div>
              <span className="text-lg font-black text-amber-400 font-mono">₹{finalTotal}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl transition active:scale-98 disabled:opacity-50 shadow-lg"
            >
              {isSubmitting ? 'Confirming & Saving...' : `Confirm Order (₹${finalTotal})`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
