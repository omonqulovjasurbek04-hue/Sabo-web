import { Router, Request, Response } from 'express';
import { db, dbHelpers } from '../db/database';
import { Order, OrderStatus } from '../types';

const router = Router();

// POST /api/orders — Create new order
router.post('/', (req: Request, res: Response) => {
  const { customer, items, subtotal, deliveryFee, discount, total } = req.body;

  if (!customer || !customer.fullName || !customer.phone || !customer.address) {
    return res.status(400).json({
      success: false,
      error: "Ism, telefon raqami va manzil kiritilishi shart"
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Buyurtma berish uchun savatchada mahsulot bo'lishi kerak"
    });
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `PM-${dateStr}-${randomSuffix}`;

  const calcSubtotal = Number(subtotal) || 0;
  const calcDelivery = calcSubtotal >= 150000 ? 0 : (Number(deliveryFee) || 0);
  const calcDiscount = Number(discount) || 0;
  const calcTotal = Number(total) || Math.max(0, calcSubtotal + calcDelivery - calcDiscount);

  const newOrder: Order = {
    id: orderId,
    createdAt: now.toISOString(),
    items,
    subtotal: calcSubtotal,
    deliveryFee: calcDelivery,
    discount: calcDiscount,
    total: calcTotal,
    status: 'pending',
    customer: {
      fullName: customer.fullName.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || '',
      region: customer.region || 'Toshkent shahri',
      address: customer.address.trim(),
      deliveryDate: customer.deliveryDate || now.toISOString().split('T')[0],
      deliveryTimeSlot: customer.deliveryTimeSlot || '09:00 - 12:00 (Ertalab)',
      notes: customer.notes?.trim() || '',
      paymentMethod: customer.paymentMethod || 'click'
    }
  };

  dbHelpers.saveOrder(newOrder);

  res.status(201).json({
    success: true,
    message: "Buyurtma muvaffaqiyatli qabul qilindi",
    order: newOrder
  });
});

// GET /api/orders — List recent orders (optional filter by phone)
router.get('/', (req: Request, res: Response) => {
  const { phone } = req.query;

  let orders = [...db.orders];
  if (phone) {
    const cleanPhone = (phone as string).replace(/\D/g, '');
    orders = orders.filter(o => o.customer.phone.replace(/\D/g, '').includes(cleanPhone));
  }

  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// GET /api/orders/:id — Track specific order status
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = dbHelpers.findOrderById(id);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Buyurtma topilmadi'
    });
  }

  // Estimated delivery timeline status
  const statuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentIndex = statuses.indexOf(order.status);

  res.json({
    success: true,
    data: {
      ...order,
      timeline: statuses.map((st, idx) => ({
        status: st,
        isCompleted: idx <= currentIndex,
        isCurrent: idx === currentIndex
      }))
    }
  });
});

// PATCH /api/orders/:id/status — Update order status (Admin / Courier webhook)
router.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Noto'g'ri status. Ruxsat berilgan: ${validStatuses.join(', ')}`
    });
  }

  const updatedOrder = dbHelpers.updateOrderStatus(id, status);
  if (!updatedOrder) {
    return res.status(404).json({
      success: false,
      error: 'Buyurtma topilmadi'
    });
  }

  res.json({
    success: true,
    message: `Buyurtma holati "${status}" ga o'zgartirildi`,
    order: updatedOrder
  });
});

export default router;
