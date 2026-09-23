/**
 * WRON_WAVE Cloud Database & Google Sheets Integration Service
 * 
 * Supports:
 * 1. Supabase (PostgreSQL Cloud Database)
 * 2. Google Sheets Webhook Sync (auto-appends row on Google Drive)
 * 3. Local persistent storage with offline zero-friction fallback
 */

// Cloud environment settings (can be defined in .env or Vercel environment variables)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const GOOGLE_SHEET_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';

/**
 * Saves a customer order to:
 * 1. Local Storage (instant local persistence)
 * 2. Google Sheets (if webhook configured)
 * 3. Supabase Cloud Database (if configured)
 */
export async function saveCustomerOrder(order) {
  // 1. Local storage persistence
  try {
    const existing = JSON.parse(localStorage.getItem('wron_wave_orders') || '[]');
    const updated = [order, ...existing.filter(o => o.id !== order.id)];
    localStorage.setItem('wron_wave_orders', JSON.stringify(updated));
  } catch (err) {
    console.error('Local storage save error:', err);
  }

  // 2. Google Sheets Auto-Sync (Webhook)
  if (GOOGLE_SHEET_WEBHOOK_URL) {
    try {
      const sheetPayload = {
        orderId: order.id,
        timestamp: order.createdAt || new Date().toISOString(),
        customerName: order.customer?.name || 'Guest',
        phone: order.customer?.phone || '',
        address: `${order.customer?.address || ''}, ${order.customer?.city || 'Hyderabad'}`,
        itemsSummary: order.items?.map(i => `${i.name} (${i.size}) x${i.quantity}`).join('; '),
        totalAmount: order.total,
        paymentMethod: order.paymentMethod || 'Cash on Delivery',
        channel: order.orderChannel || 'WhatsApp / Web',
        status: order.status || 'Confirmed'
      };

      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetPayload)
      });
      console.log('Order synced to Google Sheets successfully');
    } catch (sheetErr) {
      console.warn('Google Sheets sync notice:', sheetErr);
    }
  }

  // 3. Supabase Cloud Database Sync
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const supabaseEndpoint = `${SUPABASE_URL}/rest/v1/orders`;
      const supabasePayload = {
        order_id: order.id,
        customer_name: order.customer?.name,
        customer_phone: order.customer?.phone,
        delivery_address: order.customer?.address,
        city: order.customer?.city || 'Hyderabad',
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        payment_method: order.paymentMethod,
        channel: order.orderChannel || 'Web Checkout',
        status: order.status || 'Confirmed',
        created_at: order.createdAt || new Date().toISOString()
      };

      await fetch(supabaseEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(supabasePayload)
      });
      console.log('Order saved to Supabase PostgreSQL successfully');
    } catch (supabaseErr) {
      console.warn('Supabase sync notice:', supabaseErr);
    }
  }

  return order;
}

/**
 * Retrieves all orders from Cloud with fallback to local storage
 */
export async function getCustomerOrders() {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData) && cloudData.length > 0) {
          return cloudData.map(row => ({
            id: row.order_id,
            customer: {
              name: row.customer_name,
              phone: row.customer_phone,
              address: row.delivery_address,
              city: row.city
            },
            items: row.items || [],
            subtotal: row.subtotal,
            discount: row.discount,
            total: row.total,
            paymentMethod: row.payment_method,
            orderChannel: row.channel,
            status: row.status,
            createdAt: row.created_at
          }));
        }
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local:', err);
    }
  }

  // Fallback to local storage
  try {
    return JSON.parse(localStorage.getItem('wron_wave_orders') || '[]');
  } catch {
    return [];
  }
}

/**
 * 1-Click Export of all Customer Orders to CSV (Excel format)
 */
export function exportOrdersToCSV(orders = []) {
  if (!orders.length) {
    alert('No customer orders to export yet.');
    return;
  }

  const headers = [
    'Order ID',
    'Date & Time',
    'Customer Name',
    'Phone Number',
    'Delivery Address',
    'City',
    'Items Ordered',
    'Total Amount (INR)',
    'Payment Method',
    'Order Channel',
    'Status'
  ];

  const rows = orders.map(order => [
    order.id || '',
    order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : '',
    `"${(order.customer?.name || '').replace(/"/g, '""')}"`,
    `"${order.customer?.phone || ''}"`,
    `"${(order.customer?.address || '').replace(/"/g, '""')}"`,
    `"${order.customer?.city || 'Hyderabad'}"`,
    `"${(order.items || []).map(i => `${i.name} [${i.size}] x${i.quantity}`).join(', ').replace(/"/g, '""')}"`,
    order.total || 0,
    `"${order.paymentMethod || 'Cash on Delivery'}"`,
    `"${order.orderChannel || 'WhatsApp / Web'}"`,
    `"${order.status || 'Confirmed'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `WRON_WAVE_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
