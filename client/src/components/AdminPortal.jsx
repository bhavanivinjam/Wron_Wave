import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, PlusCircle, RefreshCw, User, Phone, MapPin, CheckCircle, Clock, Download, FileSpreadsheet, Database, Copy, Check } from 'lucide-react';
import { getCustomerOrders, exportOrdersToCSV } from '../services/cloudDb';
import { GOOGLE_SHEETS_CODE } from '../services/googleSheetsGuide';

export default function AdminPortal({ onBackToStore, onProductAdded }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'new-product', or 'database'
  const [copiedScript, setCopiedScript] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'printed-tees',
    categoryLabel: 'Unique Collection of Printed T-Shirts',
    price: '',
    originalPrice: '',
    tag: 'New Drop',
    sizes: 'S, M, L, XL',
    fabricType: '100% Super Combed Compact Cotton',
    gsm: '240 GSM Heavyweight',
    fit: 'Oversized Drop-Shoulder Boxy Silhouette',
    description: '',
    image: ''
  });

  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // First try live server API
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      if (data.success && data.orders?.length > 0) {
        setOrders(data.orders);
        setIsLoading(false);
        return;
      }
    } catch {
      // Ignore and fallback to cloudDb
    }

    // Fallback to unified cloudDb service (Supabase & local orders)
    try {
      const ordersList = await getCustomerOrders();
      setOrders(ordersList);
    } catch (e) {
      console.warn('Orders fetch note:', e);
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
        sizes: newProduct.sizes.split(',').map(s => s.trim()),
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice || newProduct.price * 2)
      };

      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('Product added successfully!');
        if (onProductAdded) onProductAdded(data.product);
        setNewProduct({
          name: '',
          category: 'printed-tees',
          categoryLabel: 'Unique Collection of Printed T-Shirts',
          price: '',
          originalPrice: '',
          tag: 'New Drop',
          sizes: 'S, M, L, XL',
          fabricType: '100% Super Combed Compact Cotton',
          gsm: '240 GSM Heavyweight',
          fit: 'Oversized Drop-Shoulder Boxy Silhouette',
          description: '',
          image: ''
        });
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      // Local fallback
      const localProduct = {
        id: `ww-local-${Date.now()}`,
        ...newProduct,
        sizes: newProduct.sizes.split(',').map(s => s.trim()),
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice || newProduct.price * 2)
      };
      if (onProductAdded) onProductAdded(localProduct);
      setSuccessMsg('Product added to local storefront!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_SHEETS_CODE);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } catch (e) {
      console.error(e);
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
            Customer Data & Orders
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* 1-Click Excel Export */}
          <button
            onClick={() => exportOrdersToCSV(orders)}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-xs font-bold font-mono flex items-center gap-2 transition shadow active:scale-95"
            title="Download complete customer database as Excel CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to Excel (.CSV)</span>
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
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider transition active:scale-95"
          >
            Storefront View
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-6">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono font-medium">Total Orders Logged</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">{orders.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono font-medium">Total Order Volume</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-mono">₹{totalRevenue}</p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono font-medium">Database Status</p>
          <p className="text-sm font-bold text-emerald-400 mt-2 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active (Zero Lag)
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono font-medium">Delivery Hub</p>
          <p className="text-sm font-bold text-zinc-200 mt-2 font-mono">Hyderabad Door Delivery</p>
        </div>
      </div>

      {/* Navigation Tabs */}
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
          onClick={() => setActiveTab('database')}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'database'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Google Sheets & Cloud Database
        </button>
        <button
          onClick={() => setActiveTab('new-product')}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'new-product'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Add New Drop
        </button>
      </div>

      {/* Content Tabs */}
      {activeTab === 'orders' ? (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-3xl">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-300">No customer orders recorded yet.</p>
              <p className="text-xs text-zinc-500 mt-1">Orders placed on WhatsApp, Instagram, or Web checkout will automatically populate here.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-lg"
              >
                {/* Header line */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-bold font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                      {order.id}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'Just now'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      {order.status || 'Confirmed'}
                    </span>
                    {order.orderChannel && (
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] font-mono rounded">
                        {order.orderChannel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-850 space-y-1">
                    <p className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Customer Contact</p>
                    <div className="flex items-center gap-2 text-zinc-200">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-bold text-white">{order.customer?.name || 'Customer'}</span>
                    </div>
                    {order.customer?.phone && (
                      <div className="flex items-center gap-2 text-zinc-300 font-mono">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <a href={`tel:${order.customer.phone}`} className="hover:underline">
                          {order.customer.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-850 space-y-1">
                    <p className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Hyderabad Delivery Address</p>
                    <div className="flex items-start gap-2 text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{order.customer?.address || 'Hyderabad'}, {order.customer?.city || 'Telangana'}</span>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="pt-2 border-t border-zinc-850 space-y-1.5">
                  <p className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Drops in this Order:</p>
                  <div className="divide-y divide-zinc-900">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 text-xs text-zinc-300">
                        <div>
                          <span className="font-semibold text-white">{item.name}</span>
                          <span className="text-zinc-500 ml-2 font-mono">Size: {item.size} × {item.quantity}</span>
                          {item.fabricType && <span className="text-[10px] text-zinc-500 block">{item.fabricType}</span>}
                        </div>
                        <span className="font-mono text-zinc-200 font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs font-bold text-white">
                    <span>Payable (Payment: {order.paymentMethod || 'COD'}):</span>
                    <span className="font-mono text-sm text-amber-400">₹{order.total}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'database' ? (
        /* Database & Google Sheets Sync Guide Tab */
        <div className="space-y-6">
          <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <FileSpreadsheet className="w-6 h-6" />
              <h2 className="text-lg font-black uppercase text-white tracking-wide">
                Live Google Sheets Auto-Sync (100% Free Forever)
              </h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
              Want every customer order to automatically appear in your personal Google Sheet on your Google Drive as a new row? Follow these 2 steps:
            </p>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                <span className="px-2 py-0.5 bg-amber-400/20 text-amber-400 font-mono font-bold rounded text-[10px]">
                  STEP 1: Create Your Sheet
                </span>
                <p className="text-zinc-300 font-semibold">Open a new Google Sheet</p>
                <p className="text-zinc-500 text-[11px]">
                  Go to <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">sheets.new</a> and set Row 1 headers to:
                </p>
                <code className="block bg-zinc-900 p-2 rounded text-[10px] text-zinc-300 font-mono">
                  Order ID | Date/Time | Customer Name | Phone | Address | Items | Total (₹) | Payment | Channel | Status
                </code>
              </div>

              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-400 font-mono font-bold rounded text-[10px]">
                  STEP 2: Paste Apps Script
                </span>
                <p className="text-zinc-300 font-semibold">Extensions ➔ Apps Script</p>
                <p className="text-zinc-500 text-[11px]">
                  Click Extensions ➔ Apps Script in your Google Sheet, paste the script below, and click <strong>Deploy ➔ New deployment ➔ Web App (Who has access: Anyone)</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Script Copied to Clipboard!' : 'Copy Google Apps Script'}</span>
                </button>
              </div>
            </div>

            {/* Supabase Card */}
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs mt-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Database className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider">Supabase (PostgreSQL Cloud)</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Your store is also pre-configured with Supabase support. Whenever you want to connect a dedicated PostgreSQL cloud database, simply add your free <code className="text-amber-400 font-mono">VITE_SUPABASE_URL</code> and <code className="text-amber-400 font-mono">VITE_SUPABASE_ANON_KEY</code> to your environment.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* New Product Form */
        <form onSubmit={handleCreateProduct} className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-4 max-w-2xl">
          <h2 className="text-lg font-black uppercase text-white tracking-wide">
            Add New Streetwear Drop
          </h2>

          {successMsg && (
            <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-bold">
              {successMsg}
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Product Drop Title *</label>
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g. Neo-Tokyo Heavyweight Acid Tee"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Drop Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="899"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1">Fabric Weight / GSM</label>
                <input
                  type="text"
                  value={newProduct.gsm}
                  onChange={(e) => setNewProduct({ ...newProduct, gsm: e.target.value })}
                  placeholder="240 GSM Heavyweight"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-mono mb-1">Fabric Type & Composition</label>
              <input
                type="text"
                value={newProduct.fabricType}
                onChange={(e) => setNewProduct({ ...newProduct, fabricType: e.target.value })}
                placeholder="100% Super Combed Compact Cotton"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono mb-1">Image URL / Path</label>
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                placeholder="/products/your_photo.jpg or https://..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono mb-1">Drop Description</label>
              <textarea
                rows={2}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Details about print, cut, and fit..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submittingProduct}
            className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-zinc-200 transition"
          >
            {submittingProduct ? 'Adding Drop...' : 'Publish New Drop'}
          </button>
        </form>
      )}
    </div>
  );
}
