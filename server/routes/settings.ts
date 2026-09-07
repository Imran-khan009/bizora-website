import { Router, Request, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/settings (Public)
router.get('/', (req: Request, res: Response) => {
  try {
    const settings = db.settings.get();
    res.json({ settings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch settings' });
  }
});

// PUT /api/settings (Admin)
router.put('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.settings.update(req.body);
    res.json({ settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update settings' });
  }
});

export default router;
