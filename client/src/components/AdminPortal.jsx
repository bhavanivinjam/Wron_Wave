import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, PlusCircle, RefreshCw, User, Phone, MapPin, CheckCircle, Clock, Download, FileSpreadsheet, MessageCircle } from 'lucide-react';
import { getAllOrdersFromDatabase, exportOrdersToCSV } from '../services/cloudDb';
import { BRAND_INFO } from '../data/mockProducts';

export default function AdminPortal({ onBackToStore, onProductAdded }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'new-product'

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'printed-tees',
    categoryLabel: 'Unique Collection of Printed T-Shirts',
    price: '',
    originalPrice: '',
    tag: 'New Drop',
    sizes: 'S, M, L, XL',
    description: '',
    image: '',
    fabricType: '100% Combed Cotton',
    gsm: '240 GSM'
  });

  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // 1. Check local / cloud DB
      const localOrders = getAllOrdersFromDatabase();

      // 2. Try fetching from server API if active
      let serverOrders = [];
      try {
        const res = await fetch('http://localhost:5000/api/orders');
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          serverOrders = data.orders;
        }
      } catch {
        // silent
      }

      // Merge unique orders by id
      const combined = [...localOrders];
      serverOrders.forEach(so => {
        if (!combined.some(co => co.id === so.id)) {
          combined.push(so);
        }
      });

      // Default sample if empty
      if (!combined.length) {
        combined.push({
          id: 'ORD-1001',
          customer: {
            name: 'Rahul Varma',
            phone: '+91 98480 22334',
            address: 'Plot 55, Road No 36, Jubilee Hills',
            city: 'Hyderabad',
            pincode: '500033'
          },
          items: [
            { id: 'ww-pt-01', name: "WRON_WAVE GT3 'Track Bred' Heavy Tee", size: 'L', quantity: 1, price: 899 }
          ],
          subtotal: 1799,
          discount: 900,
          total: 899,
          paymentMethod: 'UPI / QR on Delivery',
          status: 'Confirmed',
          createdAt: new Date().toISOString()
        });
      }

      setOrders(combined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmittingProduct(true);
    try {
      const payload = {
        ...newProduct,
        id: `ww-custom-${Date.now().toString(36)}`,
        sizes: newProduct.sizes.split(',').map(s => s.trim()),
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice || newProduct.price * 2),
        inStock: true,
        images: [newProduct.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80']
      };

      try {
        await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch {
        // save locally
      }

      if (onProductAdded) {
        onProductAdded(payload);
      }

      setSuccessMsg(`Drop "${newProduct.name}" created successfully!`);
      setNewProduct({
        name: '',
        category: 'printed-tees',
        categoryLabel: 'Unique Collection of Printed T-Shirts',
        price: '',
        originalPrice: '',
        tag: 'New Drop',
        sizes: 'S, M, L, XL',
        description: '',
        image: '',
        fabricType: '100% Combed Cotton',
        gsm: '240 GSM'
      });
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setSubmittingProduct(false);
    }
  };

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold font-mono">
              WRON_WAVE STORE CONTROL & DATABASE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
            Store Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export to Google Sheets Button */}
          <button
            onClick={exportOrdersToCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition"
            title="Export all orders to Google Sheets / Excel CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export to Google Sheets</span>
          </button>

          <button
            onClick={fetchOrders}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onBackToStore}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider transition active:scale-95 shadow"
          >
            Back to Storefront
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-6">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono">Total Orders Stored</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">{orders.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono">Gross Order Volume</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-mono">₹{totalRevenue}</p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono">Database Status</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono font-bold text-emerald-300 uppercase">Cloud & Sheets Active</span>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono">Delivery Zone</p>
          <p className="text-sm font-bold text-zinc-200 mt-2 font-mono">Hyderabad Door Delivery</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-6 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('new-product')}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'new-product'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Add New Apparel Drop
        </button>
      </div>

      {/* Tab 1: Orders List */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800 text-zinc-500">
              <Package className="w-12 h-12 mx-auto stroke-1 text-zinc-600 mb-2" />
              <p className="text-base font-bold text-zinc-300">No orders placed yet</p>
              <p className="text-xs mt-1">Orders placed on your website or via WhatsApp will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg hover:border-zinc-700 transition"
                >
                  {/* Top Bar of Order */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-amber-400 text-base">
                        {order.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {order.status || 'Confirmed'}
                      </span>
                      {order.coupon && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                          Code: {order.coupon}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-zinc-400 flex items-center gap-3 font-mono">
                      <span>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
                      
                      {/* 1-Click WhatsApp Customer Button */}
                      {order.customer?.phone && (
                        <a
                          href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.customer.name}! This is WRON_WAVE CLOTHING confirming your order ${order.id}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold font-sans flex items-center gap-1.5 transition"
                          title="Message customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat with Customer</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Customer Info & Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                    
                    {/* Customer Info */}
                    <div className="md:col-span-4 space-y-2 bg-zinc-950/70 p-4 rounded-xl border border-zinc-850">
                      <p className="text-[10px] uppercase font-mono font-bold text-zinc-400">
                        Customer & Delivery Details
                      </p>
                      <p className="font-bold text-white text-sm">
                        {order.customer?.name || 'Walk-in Customer'}
                      </p>
                      <p className="text-zinc-300 font-mono flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        {order.customer?.phone || 'No Phone'}
                      </p>
                      <p className="text-zinc-400 flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                        <span>{order.customer?.address || 'Hyderabad Delivery'}</span>
                      </p>
                      <div className="pt-2 border-t border-zinc-850 text-zinc-400">
                        Payment: <strong className="text-white">{order.paymentMethod || 'COD'}</strong>
                      </div>
                    </div>

                    {/* Items Ordered */}
                    <div className="md:col-span-8 space-y-2">
                      <p className="text-[10px] uppercase font-mono font-bold text-zinc-400">
                        Drops Ordered:
                      </p>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-850"
                          >
                            <div>
                              <span className="font-bold text-white block text-xs">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-zinc-400 font-mono">
                                Size: <strong className="text-amber-400">{item.size}</strong> • Qty: {item.quantity}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-white">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Financials Strip */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-850 font-mono">
                        <span className="text-zinc-400">Total Payable:</span>
                        <div className="text-right">
                          {order.discount > 0 && (
                            <span className="text-[11px] text-emerald-400 block">
                              50% Discount Applied (-₹{order.discount})
                            </span>
                          )}
                          <span className="text-base font-black text-amber-400">
                            ₹{order.total}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Add New Product Form */}
      {activeTab === 'new-product' && (
        <div className="max-w-2xl bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-lg font-black uppercase tracking-tight text-white mb-4">
            Upload New Streetwear Drop
          </h2>

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 uppercase font-mono font-bold mb-1">
                Drop Name *
              </label>
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g. Acid Skull Heavy Graphic Tee"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 uppercase font-mono font-bold mb-1">
                  Collection *
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    const labels = {
                      'printed-tees': 'Unique Collection of Printed T-Shirts',
                      'overseas-tees': 'Overseas T-Shirts',
                      'vintage-formal': 'Vintage Classic Formal Shirts',
                      'baggy-jeans': 'Baggy Jeans with 90s Style',
                      'youth-outfits': 'Trendy Gen-Z Styles Youth Outfits'
                    };
                    setNewProduct({
                      ...newProduct,
                      category: cat,
                      categoryLabel: labels[cat] || cat
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="printed-tees">Printed T-Shirts</option>
                  <option value="overseas-tees">Overseas T-Shirts</option>
                  <option value="vintage-formal">Vintage Formal Shirts</option>
                  <option value="baggy-jeans">Baggy Jeans (90s)</option>
                  <option value="youth-outfits">Gen-Z Youth Outfits</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase font-mono font-bold mb-1">
                  Tag / Badge
                </label>
                <input
                  type="text"
                  value={newProduct.tag}
                  onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                  placeholder="e.g. New Drop, Bestseller"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 uppercase font-mono font-bold mb-1">
                  Price (INR) *
                </label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="899"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase font-mono font-bold mb-1">
                  Original Price (before 50% discount)
                </label>
                <input
                  type="number"
                  value={newProduct.originalPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                  placeholder="1799"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 uppercase font-mono font-bold mb-1">
                  Fabric Type
                </label>
                <input
                  type="text"
                  value={newProduct.fabricType}
                  onChange={(e) => setNewProduct({ ...newProduct, fabricType: e.target.value })}
                  placeholder="100% Super Combed Cotton"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase font-mono font-bold mb-1">
                  GSM Weight
                </label>
                <input
                  type="text"
                  value={newProduct.gsm}
                  onChange={(e) => setNewProduct({ ...newProduct, gsm: e.target.value })}
                  placeholder="240 GSM"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase font-mono font-bold mb-1">
                Image URL or Path *
              </label>
              <input
                type="text"
                required
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                placeholder="/products/your_image.jpg or https://..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase font-mono font-bold mb-1">
                Available Sizes (comma separated)
              </label>
              <input
                type="text"
                value={newProduct.sizes}
                onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                placeholder="S, M, L, XL"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase font-mono font-bold mb-1">
                Description & Styling Specs
              </label>
              <textarea
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Heavyweight cotton, oversized drop shoulder, high-density screenprint..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingProduct}
              className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-wider text-xs rounded-xl transition active:scale-98 disabled:opacity-50 shadow-lg"
            >
              {submittingProduct ? 'Adding Drop...' : 'Publish Drop to Catalog'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
