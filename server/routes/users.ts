import { Router, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAdmin, requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/users (Admin)
router.get('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.users.find().map((u: any) => {
      const { passwordHash, ...sanitized } = u;
      // attach user's total orders count
      const userOrders = db.orders.find((o: any) => o.userId === u.id || o.customerInfo.email?.toLowerCase() === u.email.toLowerCase());
      return {
        ...sanitized,
        ordersCount: userOrders.length,
        totalSpent: userOrders.reduce((acc: number, o: any) => acc + (o.total || 0), 0)
      };
    });
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch users' });
  }
});

// PUT /api/users/:id (Self or Admin)
router.put('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const targetId = req.params.id;
    // Allow if admin OR self
    if (req.user!.role !== 'admin' && req.user!.id !== targetId) {
      return res.status(403).json({ error: 'Unauthorized to update this user' });
    }

    const { name, phone, address } = req.body;
    const updates: any = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (address !== undefined) updates.address = address;

    // Only admin can change role
    if (req.user!.role === 'admin' && req.body.role) {
      updates.role = req.body.role;
    }

    const updated = db.users.findByIdAndUpdate(targetId, updates);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash, ...sanitized } = updated;
    res.json({ user: sanitized });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update user' });
  }
});

export default router;
