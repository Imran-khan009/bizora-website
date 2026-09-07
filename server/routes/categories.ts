import { Router, Request, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/categories
router.get('/', (req: Request, res: Response) => {
  try {
    const categories = db.categories.find();
    // Count products per category
    const allProducts = db.products.find();
    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      productCount: allProducts.filter(p => p.category.toLowerCase() === cat.slug.toLowerCase() || p.category.toLowerCase() === cat.name.toLowerCase()).length
    }));
    res.json({ categories: categoriesWithCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch categories' });
  }
});

// POST /api/categories (Admin)
router.post('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, image, description, featured, status } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = db.categories.create({
      name: name.trim(),
      slug,
      image: image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
      description: description || '',
      featured: Boolean(featured),
      status: status === 'inactive' ? 'inactive' : 'active'
    });

    res.status(201).json({ category });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create category' });
  }
});

// PUT /api/categories/:id (Admin)
router.put('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, image, description, featured, status } = req.body;
    const existing = db.categories.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updates: any = {};
    if (name !== undefined) {
      updates.name = name.trim();
      updates.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (image !== undefined) updates.image = image;
    if (description !== undefined) updates.description = description;
    if (featured !== undefined) updates.featured = Boolean(featured);
    if (status !== undefined) updates.status = status === 'inactive' ? 'inactive' : 'active';

    const updated = db.categories.findByIdAndUpdate(existing.id, updates);
    res.json({ category: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update category' });
  }
});

// DELETE /api/categories/:id (Admin)
router.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = db.categories.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }

    db.categories.findByIdAndDelete(existing.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete category' });
  }
});

export default router;
