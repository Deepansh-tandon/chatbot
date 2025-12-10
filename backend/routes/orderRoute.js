import express from 'express';
import { 
  getUserOrders, 
  getOrderById, 
  createOrder,
  updateOrderStatus 
} from '../controllers/orders.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getUserOrders);
router.get('/:orderId', getOrderById);
router.post('/', createOrder);
router.patch('/:orderId/status', updateOrderStatus);

export default router;
