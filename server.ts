import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { authenticate } from './server/middleware/auth';
import authRoutes from './server/routes/auth';
import productRoutes from './server/routes/products';
import categoryRoutes from './server/routes/categories';
import orderRoutes from './server/routes/orders';
import contactRoutes from './server/routes/contact';
import userRoutes from './server/routes/users';
import settingsRoutes from './server/routes/settings';
import adminRoutes from './server/routes/admin';
import mediaRoutes from './server/routes/media';
import contentRoutes from './server/routes/content';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(authenticate);

// Public assets and uploads directory
app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'BIZORA', timestamp: new Date().toISOString() });
});

// Deployment & Asset configuration
app.get('/api/config', (req, res) => {
  res.json({
    assetBaseUrl: process.env.ASSET_BASE_URL || '',
    appUrl: process.env.APP_URL || ''
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/content', contentRoutes);

// Error handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BIZORA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
