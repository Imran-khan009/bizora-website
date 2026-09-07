import { Router, Request, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/content (Public)
router.get('/', (req: Request, res: Response) => {
  try {
    const content = db.settings.getContent();
    res.json({ content });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch content' });
  }
});

// PUT /api/content (Admin)
router.put('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.settings.updateContent(req.body);
    res.json({ content: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update content' });
  }
});

export default router;
