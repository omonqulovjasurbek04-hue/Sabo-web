import { Router, Request, Response } from 'express';
import { dbHelpers } from '../db/database';

const router = Router();

// ==========================================
// 1. CLICK UZBEKISTAN WEBHOOK PROTOCOL
// ==========================================

// POST /api/payments/click/prepare
// Click calls this to verify order exists and is ready for payment
router.post('/click/prepare', (req: Request, res: Response) => {
  const { click_trans_id, merchant_trans_id, amount, action, error } = req.body;

  console.log(`💳 [Click Prepare] trans_id: ${click_trans_id}, order_id: ${merchant_trans_id}, amount: ${amount}`);

  if (action !== 0 || error < 0) {
    return res.json({
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: null,
      error: -1,
      error_note: "So'rov parametri xato (Invalid request action)"
    });
  }

  const order = dbHelpers.findOrderById(merchant_trans_id);

  if (!order) {
    return res.json({
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: null,
      error: -5,
      error_note: "Buyurtma topilmadi (Order not found)"
    });
  }

  if (order.status === 'confirmed' || order.status === 'delivered') {
    return res.json({
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: null,
      error: -4,
      error_note: "Buyurtma allaqachon to'langan (Already paid)"
    });
  }

  res.json({
    click_trans_id,
    merchant_trans_id,
    merchant_prepare_id: Date.now(),
    error: 0,
    error_note: "Success"
  });
});

// POST /api/payments/click/complete
// Click calls this after customer authorizes the payment
router.post('/click/complete', (req: Request, res: Response) => {
  const { click_trans_id, merchant_trans_id, merchant_prepare_id, error } = req.body;

  console.log(`💳 [Click Complete] trans_id: ${click_trans_id}, order_id: ${merchant_trans_id}`);

  if (error < 0) {
    return res.json({
      click_trans_id,
      merchant_trans_id,
      merchant_confirm_id: null,
      error: -1,
      error_note: "Tranzaksiya xatoligi"
    });
  }

  const order = dbHelpers.findOrderById(merchant_trans_id);

  if (!order) {
    return res.json({
      click_trans_id,
      merchant_trans_id,
      merchant_confirm_id: null,
      error: -5,
      error_note: "Buyurtma topilmadi"
    });
  }

  // Update order status to confirmed
  dbHelpers.updateOrderStatus(order.id, 'confirmed');

  res.json({
    click_trans_id,
    merchant_trans_id,
    merchant_confirm_id: merchant_prepare_id || Date.now(),
    error: 0,
    error_note: "Success"
  });
});

// ==========================================
// 2. PAYME JSON-RPC 2.0 WEBHOOK PROTOCOL
// ==========================================

// POST /api/payments/payme
router.post('/payme', (req: Request, res: Response) => {
  const { method, params, id } = req.body;

  console.log(`💳 [Payme RPC] method: ${method}, id: ${id}`);

  switch (method) {
    case 'CheckPerformTransaction': {
      const orderId = params?.account?.order_id || params?.account?.id;
      const order = orderId ? dbHelpers.findOrderById(orderId) : null;

      if (!order) {
        return res.json({
          error: { code: -31050, message: { uz: "Buyurtma topilmadi", ru: "Заказ не найден", en: "Order not found" } },
          id
        });
      }

      return res.json({
        result: {
          allow: true,
          detail: {
            receipt_type: 0,
            items: order.items.map(item => ({
              title: item.product.name.uz,
              price: item.price * 100, // Payme in tiyin
              count: item.quantity,
              code: "10702001001000000",
              vat_percent: 12
            }))
          }
        },
        id
      });
    }

    case 'CreateTransaction': {
      const orderId = params?.account?.order_id || params?.account?.id;
      const order = orderId ? dbHelpers.findOrderById(orderId) : null;

      if (!order) {
        return res.json({
          error: { code: -31050, message: { uz: "Buyurtma topilmadi", ru: "Заказ не найден" } },
          id
        });
      }

      return res.json({
        result: {
          create_time: Date.now(),
          transaction: params?.id || `PM-TX-${Date.now()}`,
          state: 1
        },
        id
      });
    }

    case 'PerformTransaction': {
      const orderId = params?.account?.order_id || params?.account?.id;
      if (orderId) {
        dbHelpers.updateOrderStatus(orderId, 'confirmed');
      }

      return res.json({
        result: {
          transaction: params?.id || `PM-TX-${Date.now()}`,
          perform_time: Date.now(),
          state: 2
        },
        id
      });
    }

    case 'CheckTransaction': {
      return res.json({
        result: {
          create_time: Date.now() - 60000,
          perform_time: Date.now(),
          cancel_time: 0,
          transaction: params?.id || 'payme-trans-id',
          state: 2,
          reason: null
        },
        id
      });
    }

    case 'CancelTransaction': {
      return res.json({
        result: {
          transaction: params?.id || 'payme-trans-id',
          cancel_time: Date.now(),
          state: -2
        },
        id
      });
    }

    default: {
      return res.json({
        error: { code: -32601, message: "Method not found" },
        id
      });
    }
  }
});

export default router;
