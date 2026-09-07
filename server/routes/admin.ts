import { Router, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/admin/stats
router.get('/stats', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const allOrders = db.orders.find();
    const allUsers = db.users.find();
    const allProducts = db.products.find();

    const totalSales = allOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const totalOrders = allOrders.length;
    const totalProducts = allProducts.length;
    const totalCustomers = allUsers.filter((u: any) => u.role === 'customer').length;
    const pendingOrders = allOrders.filter((o: any) => o.status === 'Pending').length;
    const completedOrders = allOrders.filter((o: any) => o.status === 'Delivered').length;
    const recentOrders = allOrders.slice(0, 8);

    res.json({
      stats: {
        totalSales,
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        completedOrders,
        recentOrders
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch admin stats' });
  }
});

export default router;
