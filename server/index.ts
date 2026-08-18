import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import paymentsRouter from './routes/payments';
import articlesRouter from './routes/articles';
import contactRouter from './routes/contact';
import { seedDatabase, db } from './db/database';
import { PRODUCTS, ARTICLES, CERTIFICATES, BRANCHES } from '../src/constants/data';

dotenv.config();

// Seed initial database
seedDatabase({
  products: PRODUCTS,
  articles: ARTICLES,
  certificates: CERTIFICATES,
  branches: BRANCHES
});

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS headers for frontend integration
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request Logger with Execution Time
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📡 [${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health & System Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    brand: 'SABO Digital Experience',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    stats: {
      productsCount: db.products.length,
      ordersCount: db.orders.length,
      articlesCount: db.articles.length,
      certificatesCount: db.certificates.length,
      branchesCount: db.branches.length,
      contactSubmissionsCount: db.contactSubmissions.length
    }
  });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/contact', contactRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint topilmadi (Route not found)'
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Server xatoligi:', err);
  res.status(500).json({
    success: false,
    error: 'Ichki server xatoligi (Internal Server Error)',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🥛 SABO TypeScript API Server faol: http://localhost:${PORT}`);
  console.log(`🚀 API Health check: http://localhost:${PORT}/api/health`);
});

export default app;
