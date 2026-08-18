import { Router, Request, Response } from 'express';
import { db, dbHelpers } from '../db/database';

const router = Router();

// POST /api/contact — Submit contact inquiry / partnership form
router.post('/', (req: Request, res: Response) => {
  const { name, phone, email, company, location, type, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      error: "Ism va telefon raqami kiritilishi shart"
    });
  }

  const submission = dbHelpers.saveContactSubmission({
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim() || '',
    company: company?.trim() || '',
    location: location || "Toshkent",
    type: type || 'wholesale',
    message: message?.trim() || ''
  });

  res.status(201).json({
    success: true,
    message: "Xabaringiz muvaffaqiyatli qabul qilindi. Tez orada mutaxassisimiz siz bilan bog'lanadi.",
    data: submission
  });
});

// GET /api/contact/submissions — List all submissions (Admin / Manager)
router.get('/submissions', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: db.contactSubmissions.length,
    data: db.contactSubmissions
  });
});

// GET /api/contact/branches — List all branch locations
router.get('/branches', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: db.branches.length,
    data: db.branches
  });
});

export default router;
