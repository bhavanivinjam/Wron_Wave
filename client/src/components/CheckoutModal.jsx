import React, { useState } from 'react';
import { X, CheckCircle2, Truck, CreditCard, Banknote, ShieldCheck, MessageCircle } from 'lucide-react';
import { BRAND_INFO } from '../data/mockProducts';

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
    landmark: '',
    pincode: '',
    paymentMethod: 'Cash on Delivery',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isDiscounted = appliedCoupon === 'WAVE50';
  const discountAmount = isDiscounted ? Math.round(subtotal * 0.5) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill out your Name, Phone Number, and Delivery Address');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: `${formData.address}${formData.landmark ? `, Landmark: ${formData.landmark}` : ''}`,
        pincode: formData.pincode
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity
      })),
      coupon: appliedCoupon,
      paymentMethod: formData.paymentMethod,
      orderType: 'Web Checkout'
    };

    try {
      // Call backend API
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      if (data.success) {
        setCompletedOrder(data.order);
        onOrderSuccess(data.order);
      } else {
        throw new Error(data.message || 'Error creating order');
      }
    } catch (err) {
      console.warn('Backend unavailable, generating local fallback order:', err);
      // Fallback local order
      const localOrder = {
        id: `ORD-${Date.now().toString().slice(-4)}`,
        ...orderPayload,
        subtotal,
        discount: discountAmount,
        total: finalTotal,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };
      setCompletedOrder(localOrder);
      onOrderSuccess(localOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full text-white shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-white" />
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider">
              {completedOrder ? 'Order Confirmed!' : 'Delivery & Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-850 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {completedOrder ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                ORDER SUCCESSFUL
              </span>
              <h3 className="text-2xl font-black text-white">Thank You, {completedOrder.customer.name}!</h3>
              <p className="text-xs text-zinc-400 font-mono">
                Order ID: <span className="text-amber-400 font-bold">{completedOrder.id}</span>
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Amount:</span>
                <span className="text-white font-bold font-mono">₹{completedOrder.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Payment:</span>
                <span className="text-white">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Delivery Address:</span>
                <span className="text-zinc-200 text-right max-w-[240px] truncate">{completedOrder.customer.address}</span>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent(`Hi WRON_WAVE! I just placed order ${completedOrder.id} for ₹${completedOrder.total}. Name: ${completedOrder.customer.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Track / Notify on WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg border border-zinc-800"
              >
                Back to Shop
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-4">
            
            {/* Delivery Alert */}
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-2.5 text-xs text-zinc-300">
              <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Door delivery available across Hyderabad areas. Cash on delivery & UPI accepted.</span>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Delivery Address & Area *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House/Flat No, Street, Colony, Hyderabad"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="Near metro station..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="5000XX"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
                  />
                </div>
              </div>

              {/* Payment Method Radio */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition ${
                      formData.paymentMethod === 'Cash on Delivery'
                        ? 'border-white bg-zinc-900 text-white font-semibold'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs">Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'UPI / QR on Delivery' })}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition ${
                      formData.paymentMethod === 'UPI / QR on Delivery'
                        ? 'border-white bg-zinc-900 text-white font-semibold'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span className="text-xs">UPI / QR Payment</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-400 block">Total Payable:</span>
                {isDiscounted && (
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    Includes 50% launch discount
                  </span>
                )}
              </div>
              <span className="text-lg font-black text-white font-mono">₹{finalTotal}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider text-xs sm:text-sm rounded-lg transition active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming Order...' : `Confirm Order (₹${finalTotal})`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

