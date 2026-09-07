import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { AuthenticatedRequest, requireAdmin } from '../middleware/auth';

const router = Router();
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// GET /api/media
router.get('/', (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;
    const filter: any = {};
    if (typeof search === 'string') filter.search = search;
    if (typeof category === 'string') filter.category = category;

    const media = db.media.find(filter);
    res.json({ media });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch media' });
  }
});

// POST /api/media/upload (Admin)
router.post('/upload', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileData, fileName, name, category, url } = req.body;

    // If external/direct URL provided
    if (url && typeof url === 'string') {
      const mediaItem = db.media.create({
        name: name || fileName || 'Media Image',
        url: url.trim(),
        category: category || 'general',
        mimeType: 'image/jpeg',
        size: 0
      });
      return res.status(201).json({ media: mediaItem });
    }

    // Base64 file data upload
    if (!fileData || typeof fileData !== 'string') {
      return res.status(400).json({ error: 'File data or URL is required' });
    }

    // Parse data URL: data:image/png;base64,....
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Extension from mime type
    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('svg')) ext = 'svg';

    const safeName = (fileName || 'image')
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/\.[^/.]+$/, '');
    const uniqueFileName = `${safeName}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    const mediaItem = db.media.create({
      name: name || fileName || uniqueFileName,
      url: publicUrl,
      category: category || 'products',
      mimeType,
      size: buffer.length
    });

    res.status(201).json({ media: mediaItem });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to upload media file' });
  }
});

// DELETE /api/media/:id (Admin)
router.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = db.media.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    // If local file in uploads, try removing it
    if (existing.url && existing.url.startsWith('/uploads/')) {
      const fileName = existing.url.replace('/uploads/', '');
      const filePath = path.join(UPLOADS_DIR, fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // ignore disk unlink error
        }
      }
    }

    db.media.findByIdAndDelete(existing.id);
    res.json({ message: 'Media item deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete media' });
  }
});

export default router;
