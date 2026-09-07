import { Router, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/orders (Create order - customer or guest)
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, customerInfo, deliveryFee, discountAmount, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      return res.status(400).json({ error: 'Customer full name, phone, address, and city are required' });
    }

    // Calculate subtotal from products in DB for security
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = db.products.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`
        });
      }

      const unitPrice = product.discountPrice !== undefined ? product.discountPrice : product.price;
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] || '',
        price: unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    const fee = deliveryFee !== undefined ? Number(deliveryFee) : (subtotal >= 3500 ? 0 : 250);
    const discount = discountAmount ? Number(discountAmount) : 0;
    const total = Math.max(0, subtotal + fee - discount);

    const newOrder = db.orders.create({
      userId: req.user ? req.user.id : undefined,
      items: validatedItems,
      customerInfo: {
        fullName: customerInfo.fullName.trim(),
        email: customerInfo.email?.trim() || '',
        phone: customerInfo.phone.trim(),
        address: customerInfo.address.trim(),
        city: customerInfo.city.trim(),
        province: customerInfo.province || 'Punjab',
        postalCode: customerInfo.postalCode || '',
        notes: customerInfo.notes || ''
      },
      subtotal,
      deliveryFee: fee,
      discountAmount: discount,
      total,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Unpaid',
      status: 'Pending'
    });

    res.status(201).json({ order: newOrder });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// GET /api/orders
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search, email } = req.query;

    let orders = db.orders.find();

    // If authenticated customer (not admin), only return their orders
    if (req.user && req.user.role === 'customer') {
      orders = orders.filter(o => o.userId === req.user!.id || o.customerInfo.email?.toLowerCase() === req.user!.email.toLowerCase());
    } else if (!req.user) {
      // Guest can filter by their email or phone if provided
      if (email && typeof email === 'string') {
        orders = orders.filter(o => o.customerInfo.email?.toLowerCase() === email.toLowerCase());
      } else {
        return res.status(401).json({ error: 'Authentication required to view orders' });
      }
    }

    if (status && typeof status === 'string' && status !== 'all') {
      orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerInfo.fullName.toLowerCase().includes(q) ||
        o.customerInfo.phone.includes(q) ||
        o.customerInfo.city.toLowerCase().includes(q)
      );
    }

    res.json({ orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = db.orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Permission check: admin or owner
    if (req.user && req.user.role !== 'admin') {
      if (order.userId && order.userId !== req.user.id && order.customerInfo.email?.toLowerCase() !== req.user.email.toLowerCase()) {
        return res.status(403).json({ error: 'Unauthorized to view this order' });
      }
    }

    res.json({ order });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch order' });
  }
});

// PUT /api/orders/:id (Admin status update)
router.put('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = db.orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { status, paymentStatus } = req.body;
    const updates: any = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const updated = db.orders.findByIdAndUpdate(order.id, updates);
    res.json({ order: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update order' });
  }
});

export default router;
