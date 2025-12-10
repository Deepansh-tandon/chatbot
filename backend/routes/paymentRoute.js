import express from 'express';
import { getUserPayments, getPaymentById, createPayment } from '../controllers/payments.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getUserPayments);
router.get('/:paymentId', getPaymentById);
router.post('/', createPayment);

export default router;


