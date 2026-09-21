import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, PlusCircle, RefreshCw, User, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';

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
    image: ''
  });

  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.warn('Backend unavailable, using sample orders:', err);
      // Fallback
      setOrders([
        {
          id: 'ORD-1001',
          customer: {
            name: 'Arjun Kumar',
            phone: '+91 9876543210',
            address: 'Banjara Hills, Road No. 12, Hyderabad',
            pincode: '500034'
          },
          items: [
            { id: 'ww-pt-01', name: 'Monochrome Acid Wave Graphic Tee', size: 'L', quantity: 1, price: 799 }
          ],
          subtotal: 799,
          discount: 399.5,
          total: 399.5,
          paymentMethod: 'Cash on Delivery',
          status: 'Processing',
          createdAt: new Date().toISOString()
        }
      ]);
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
          description: '',
          image: ''
        });
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Error creating product. Ensure server is running.');
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
              WRON_WAVE CONTROL PANEL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
            Store Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onBackToStore}
            className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider transition active:scale-95"
          >
            Back to Storefront
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Total Orders</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">{orders.length}</p>
        </div>
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Total Order Value</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">₹{totalRevenue}</p>
        </div>
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Delivery Hub</p>
          <p className="text-lg font-bold text-zinc-200 mt-1">Hyderabad Areas</p>
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
          Orders Received ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('new-product')}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'new-product'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Add New Product
        </button>
      </div>

      {/* Content */}
      {activeTab === 'orders' ? (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold">No orders received yet.</p>
              <p className="text-xs text-zinc-500">Orders placed on the website or via WhatsApp will show up here.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-4"
              >
                {/* Header line */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-bold font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded">
                      {order.id}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    {order.status || 'Confirmed'}
                  </span>
                </div>

                {/* Customer & Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-850">
                    <p className="text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">Customer Details</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      {order.customer?.name}
                    </p>
                    <p className="text-zinc-300 flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <a href={`tel:${order.customer?.phone}`} className="hover:underline">
                        {order.customer?.phone}
                      </a>
                    </p>
                    <p className="text-zinc-400 flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
                      <span>{order.customer?.address} {order.customer?.pincode ? `(${order.customer.pincode})` : ''}</span>
                    </p>
                  </div>

                  {/* Order items */}
                  <div className="space-y-1.5 bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-850">
                    <p className="text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">Ordered Items</p>
                    <div className="space-y-1">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-zinc-300">
                          <span>
                            {it.name} <span className="text-zinc-500 font-mono">(Size: {it.size}, Qty: {it.quantity})</span>
                          </span>
                          <span className="font-mono text-white">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold text-zinc-100">
                      <span>Total Paid:</span>
                      <span className="font-mono text-amber-300">₹{order.total} ({order.paymentMethod})</span>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      ) : (
        /* New Product Form */
        <div className="max-w-2xl bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Add Streetwear to Catalog</h3>
          {successMsg && (
            <div className="p-3 mb-4 bg-emerald-950/70 border border-emerald-800 text-emerald-400 text-xs rounded-lg font-semibold">
              ✓ {successMsg}
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g. Acid Wash Tokyo Boxy Tee"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Category *
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => {
                    const catMap = {
                      'printed-tees': 'Unique Collection of Printed T-Shirts',
                      'overseas-tees': 'Overseas T-Shirts',
                      'vintage-formal': 'Vintage Classic Formal Shirts',
                      'baggy-jeans': 'Baggy Jeans with 90s Style',
                      'youth-outfits': 'Trendy Gen-Z Styles Youth Outfits'
                    };
                    setNewProduct({
                      ...newProduct,
                      category: e.target.value,
                      categoryLabel: catMap[e.target.value] || e.target.value
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                >
                  <option value="printed-tees">Printed T-Shirts</option>
                  <option value="overseas-tees">Overseas T-Shirts</option>
                  <option value="vintage-formal">Vintage Classic Formal Shirts</option>
                  <option value="baggy-jeans">Baggy Jeans (90s Style)</option>
                  <option value="youth-outfits">Trendy Gen-Z Styles</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Tag Badge
                </label>
                <input
                  type="text"
                  value={newProduct.tag}
                  onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                  placeholder="e.g. Hot Drop / Bestseller"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="799"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={newProduct.originalPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                  placeholder="1599"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={newProduct.sizes}
                onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                placeholder="S, M, L, XL, XXL"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Image URL (Unsplash or direct image link)
              </label>
              <input
                type="url"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Description & Fabric
              </label>
              <textarea
                rows={2}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="240 GSM heavy cotton, oversized fit..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingProduct}
              className="w-full py-3 px-4 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-zinc-200 transition"
            >
              {submittingProduct ? 'Saving...' : 'Add Product to Store'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

