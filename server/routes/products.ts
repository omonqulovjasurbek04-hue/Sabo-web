import { Router, Request, Response } from 'express';
import { db, dbHelpers } from '../db/database';

const router = Router();

// GET /api/products — list all or filter by category, search, attributes, price, sorting
router.get('/', (req: Request, res: Response) => {
  const { category, search, lactoseFree, organic, minPrice, maxPrice, sortBy } = req.query;

  let filtered = [...db.products];

  // Category filter
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Search filter (UZ, RU, EN)
  if (search) {
    const q = (search as string).toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.uz.toLowerCase().includes(q) ||
      p.name.ru.toLowerCase().includes(q) ||
      p.name.en.toLowerCase().includes(q) ||
      p.shortDescription.uz.toLowerCase().includes(q) ||
      p.shortDescription.ru.toLowerCase().includes(q) ||
      p.shortDescription.en.toLowerCase().includes(q)
    );
  }

  // Attribute filters
  if (lactoseFree === 'true') {
    filtered = filtered.filter(p => p.isLactoseFree);
  }

  if (organic === 'true') {
    filtered = filtered.filter(p => p.isOrganic);
  }

  // Price range filters
  if (minPrice) {
    const min = Number(minPrice);
    filtered = filtered.filter(p => {
      const price = p.volumeOptions[0]?.price || 0;
      return price >= min;
    });
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    filtered = filtered.filter(p => {
      const price = p.volumeOptions[0]?.price || 0;
      return price <= max;
    });
  }

  // Sorting
  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => (a.volumeOptions[0]?.price || 0) - (b.volumeOptions[0]?.price || 0));
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => (b.volumeOptions[0]?.price || 0) - (a.volumeOptions[0]?.price || 0));
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'popular') {
    filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// GET /api/products/:idOrSlug — get single product details
router.get('/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const product = db.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Mahsulot topilmadi (Product not found)'
    });
  }

  const reviews = dbHelpers.getProductReviews(product.id);

  res.json({
    success: true,
    data: {
      ...product,
      submittedReviews: reviews
    }
  });
});

// POST /api/products/:idOrSlug/reviews — Submit review for a product
router.post('/:idOrSlug/reviews', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const { name, rating, comment } = req.body;

  const product = db.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Mahsulot topilmadi'
    });
  }

  if (!name || !rating || !comment) {
    return res.status(400).json({
      success: false,
      error: "Ism, reyting va izoh to'ldirilishi shart"
    });
  }

  const review = dbHelpers.addReview(product.id, name, Number(rating), comment);

  res.status(201).json({
    success: true,
    message: "Fikringiz uchun rahmat! Sharh qabul qilindi.",
    data: review
  });
});

export default router;
