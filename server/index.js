import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const DELIVERY_CONFIG_FILE = path.join(__dirname, 'data', 'delivery-config.json');

// Helper to read JSON
function readJSON(file) {
  try {
    if (!fs.existsSync(file)) {
      return [];
    }
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return [];
  }
}

// Helper to write JSON
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'WRON_WAVE CLOTHING', timestamp: new Date().toISOString() });
});

// GET all products with optional category query
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let products = readJSON(PRODUCTS_FILE);

  if (category && category !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: products.length,
    products
  });
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

// POST new product (Admin)
app.post('/api/products', (req, res) => {
  const { name, category, categoryLabel, price, originalPrice, tag, sizes, description, image } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
  }

  const products = readJSON(PRODUCTS_FILE);
  const newProduct = {
    id: `ww-${Date.now().toString(36)}`,
    name,
    category,
    categoryLabel: categoryLabel || category,
    price: Number(price),
    originalPrice: Number(originalPrice || price),
    tag: tag || 'New Arrival',
    sizes: Array.isArray(sizes) ? sizes : ['S', 'M', 'L', 'XL'],
    description: description || 'Premium WRON_WAVE Streetwear',
    inStock: true,
    featured: false,
    image: image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
  };

  products.unshift(newProduct);
  writeJSON(PRODUCTS_FILE, products);

  res.status(201).json({ success: true, product: newProduct });
});

// GET all orders (Admin)
app.get('/api/orders', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  res.json({
    success: true,
    total: orders.length,
    orders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
});

// POST create order
app.post('/api/orders', (req, res) => {
  const { customer, items, coupon, paymentMethod, orderType } = req.body;

  if (!customer || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'Customer details and items are required' });
  }

  const orders = readJSON(ORDERS_FILE);
  
  // Calculate subtotal
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity || 1)), 0);
  
  // 50% discount logic for first 10 customers or 'WAVE50' code
  let discount = 0;
  const isFirst10 = orders.length < 10;
  const couponApplied = (coupon && coupon.toUpperCase() === 'WAVE50') || isFirst10;

  if (couponApplied) {
    discount = Math.round(subtotal * 0.5);
  }

  const total = subtotal - discount;

  const newOrder = {
    id: `ORD-${1000 + orders.length + 1}`,
    customer,
    items,
    subtotal,
    discount,
    total,
    coupon: couponApplied ? (coupon || 'FIRST10_50OFF') : null,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    orderType: orderType || 'Web Checkout',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeJSON(ORDERS_FILE, orders);

  console.log(`[ADMIN WHATSAPP DISPATCH] New Order #${newOrder.id} logged! Triggering admin notification to: +91 9187000720`);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order: newOrder,
    adminNotificationTarget: '+91 9187000720',
    isFirst10Offer: isFirst10
  });
});

// GET deliverable locations config
app.get('/api/delivery-config', (req, res) => {
  const config = readJSON(DELIVERY_CONFIG_FILE);
  res.json({
    success: true,
    config: Array.isArray(config) && config.length === 0 ? null : config
  });
});

// POST update deliverable locations config (Admin)
app.post('/api/delivery-config', (req, res) => {
  const newConfig = req.body;
  if (!newConfig) {
    return res.status(400).json({ success: false, message: 'Invalid delivery configuration' });
  }
  writeJSON(DELIVERY_CONFIG_FILE, newConfig);
  res.json({ success: true, message: 'Delivery configuration saved successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[WRON_WAVE API] Server running on http://localhost:${PORT}`);
});

