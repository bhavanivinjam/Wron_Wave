import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CollectionTabs from './components/CollectionTabs';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import { INITIAL_PRODUCTS, BRAND_INFO } from './data/mockProducts';
import { ShoppingBag, Sparkles, Filter } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('wron_wave_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState('WAVE50'); // default to 50% launch discount!
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('wron_wave_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Try fetching products from live backend API
  useEffect(() => {
    const fetchApiProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        if (data.success && data.products?.length > 0) {
          setProducts(data.products);
        }
      } catch {
        // Fallback to INITIAL_PRODUCTS silently
      }
    };
    fetchApiProducts();
  }, []);

  // Cart operations
  const handleAddToCart = (product, size) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.size === size ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.size === size)));
  };

  // Quick single-item WhatsApp Order
  const handleQuickWhatsApp = (product, size) => {
    const discounted = Math.round(product.price * 0.5);
    const message = `*Order Enquiry - WRON_WAVE CLOTHING*\n` +
      `Product: *${product.name}*\n` +
      `Category: ${product.categoryLabel}\n` +
      `Size: *${size}*\n` +
      `Offer Price (50% OFF): *₹${discounted}* (Regular ₹${product.price})\n\n` +
      `I would like to order this with Hyderabad door delivery!`;

    const url = `https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.categoryLabel.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-white selection:text-black">
      {/* Navigation */}
      <Navbar
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Main View: Storefront vs Admin Portal */}
      {isAdmin ? (
        <main className="flex-1">
          <AdminPortal
            onBackToStore={() => setIsAdmin(false)}
            onProductAdded={(newP) => setProducts((prev) => [newP, ...prev])}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onExploreClick={() => {
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onApplyCoupon={(code) => {
              setAppliedCoupon(code);
              setIsCartOpen(true);
            }}
          />

          {/* Catalog Section */}
          <section id="catalog-section" className="py-8">
            {/* Category Filter Pills */}
            <CollectionTabs
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            {/* Products Grid Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-zinc-900 mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <span>Streetwear Catalog</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Showing {filteredProducts.length} unique drops
                  </p>
                </div>

                {searchTerm && (
                  <div className="text-xs text-zinc-400">
                    Search results for: <span className="text-white font-semibold">"{searchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-amber-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-zinc-600" />
                  <p className="text-base font-bold text-zinc-300">No products found</p>
                  <p className="text-xs text-zinc-500">
                    Try searching for another piece or switch collections above.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchTerm('');
                    }}
                    className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg uppercase"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickWhatsApp={handleQuickWhatsApp}
                    />
                  ))}
                </div>
              )}

            </div>
          </section>
        </main>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        appliedCoupon={appliedCoupon}
        onOrderSuccess={() => {
          setCart([]);
        }}
      />

      {/* Footer */}
      <Footer onSelectCategory={(cat) => {
        setActiveCategory(cat);
        const el = document.getElementById('catalog-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />
    </div>
  );
}
