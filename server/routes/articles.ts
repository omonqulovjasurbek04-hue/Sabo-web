import { Router, Request, Response } from 'express';
import { db } from '../db/database';

const router = Router();

// GET /api/articles — List articles with optional category filter
router.get('/', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let articles = [...db.articles];

  if (category && category !== 'all') {
    articles = articles.filter(a => a.category === category);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    articles = articles.filter(a =>
      a.title.uz.toLowerCase().includes(q) ||
      a.title.ru.toLowerCase().includes(q) ||
      a.title.en.toLowerCase().includes(q) ||
      a.excerpt.uz.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: articles.length,
    data: articles
  });
});

// GET /api/articles/:slugOrId — Get single article or recipe details
router.get('/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const article = db.articles.find(a => a.slug === slugOrId || a.id === slugOrId);

  if (!article) {
    return res.status(404).json({
      success: false,
      error: 'Maqola topilmadi (Article not found)'
    });
  }

  // Related articles
  const related = db.articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  res.json({
    success: true,
    data: {
      ...article,
      relatedArticles: related
    }
  });
});

export default router;
