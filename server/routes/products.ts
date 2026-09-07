import { Router, Request, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/products
router.get('/', (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      featured,
      sale,
      status,
      stockStatus,
      sort,
      includeInactive,
      page = '1',
      limit = '12'
    } = req.query;

    const filter: any = {};
    if (category && typeof category === 'string') filter.category = category;
    if (search && typeof search === 'string') filter.search = search;
    if (minPrice) filter.minPrice = Number(minPrice);
    if (maxPrice) filter.maxPrice = Number(maxPrice);
    if (featured !== undefined) filter.featured = featured === 'true';
    if (sale !== undefined) filter.sale = sale === 'true';
    if (status && typeof status === 'string') {
      filter.status = status;
    } else if (includeInactive !== 'true') {
      // By default for public requests, only return active products
      filter.status = 'active';
    }
    if (stockStatus && typeof stockStatus === 'string') filter.stockStatus = stockStatus;
    if (sort && typeof sort === 'string') filter.sort = sort;

    const allMatched = db.products.find(filter);
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 12);
    const total = allMatched.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIdx = (pageNum - 1) * limitNum;
    const paginated = allMatched.slice(startIdx, startIdx + limitNum);

    res.json({
      products: paginated,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const product = db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Also include related products from same category
    const related = db.products.find({ category: product.category })
      .filter((p: any) => p.id !== product.id)
      .slice(0, 4);

    res.json({ product, related });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch product' });
  }
});

// POST /api/products (Admin)
router.post('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      images,
      category,
      stock,
      sku,
      featured,
      sale,
      status,
      specifications
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const newProduct = db.products.create({
      name: name.trim(),
      description: description || '',
      shortDescription: shortDescription || (description ? description.slice(0, 140) : ''),
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
      ],
      category: category.toLowerCase().trim(),
      stock: stock !== undefined ? Number(stock) : 10,
      sku: sku ? sku.trim() : undefined,
      featured: Boolean(featured),
      sale: Boolean(sale),
      status: status === 'inactive' ? 'inactive' : 'active',
      specifications: Array.isArray(specifications) ? specifications : []
    });

    res.status(201).json({ product: newProduct });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = db.products.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updates: any = {};
    const allowed = ['name', 'description', 'shortDescription', 'price', 'discountPrice', 'images', 'category', 'stock', 'sku', 'featured', 'sale', 'status', 'specifications'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === 'price' || key === 'stock') {
          updates[key] = Number(req.body[key]);
        } else if (key === 'discountPrice') {
          updates[key] = req.body[key] === '' || req.body[key] === null ? undefined : Number(req.body[key]);
        } else if (key === 'featured' || key === 'sale') {
          updates[key] = Boolean(req.body[key]);
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    const updated = db.products.findByIdAndUpdate(existing.id, updates);
    res.json({ product: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = db.products.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.products.findByIdAndDelete(existing.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete product' });
  }
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', (req: Request, res: Response) => {
  try {
    const product = db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { userName, rating, comment } = req.body;
    if (!userName || !rating || !comment) {
      return res.status(400).json({ error: 'Name, rating, and review comment are required' });
    }

    const review = {
      id: `rev_${Date.now()}`,
      userName: userName.trim(),
      rating: Math.max(1, Math.min(5, Number(rating))),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    const reviews = product.reviews || [];
    reviews.unshift(review);
    const newCount = reviews.length;
    const avgRating = Number((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / newCount).toFixed(1));

    const updated = db.products.findByIdAndUpdate(product.id, {
      reviews,
      reviewsCount: newCount,
      rating: avgRating
    });

    res.status(201).json({ product: updated, review });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add review' });
  }
});

export default router;
