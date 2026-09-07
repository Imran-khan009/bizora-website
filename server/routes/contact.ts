import { Router, Request, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/contact (Public inquiry submission)
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const contact = db.contacts.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      subject: subject?.trim() || 'General Inquiry',
      message: message.trim()
    });

    res.status(201).json({ message: 'Thank you for reaching out to BIZORA. Our concierge team will respond promptly.', contact });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit contact message' });
  }
});

// GET /api/contact (Admin list inquiries)
router.get('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const contacts = db.contacts.find();
    res.json({ contacts });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch messages' });
  }
});

// PUT /api/contact/:id/read (Admin mark read)
router.put('/:id/read', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.contacts.findByIdAndUpdate(req.params.id, { read: true });
    if (!updated) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ contact: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update message' });
  }
});

export default router;
