import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

export const getUserPayments = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId });
    const orderIds = orders.map(order => order.orderId);

    const payments = await Payment.find({ orderId: { $in: orderIds } })
      .sort({ createdAt: -1 });

    const paymentsWithOrders = await Promise.all(
      payments.map(async (payment) => {
        const order = await Order.findOne({ orderId: payment.orderId });
        return {
          ...payment.toObject(),
          order: order ? {
            orderId: order.orderId,
            productName: order.productName,
            status: order.status
          } : null
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Payments retrieved successfully',
      data: paymentsWithOrders
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.userId;

    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const order = await Order.findOne({ orderId: payment.orderId });
    if (!order || order.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment retrieved successfully',
      data: {
        ...payment.toObject(),
        order: {
          orderId: order.orderId,
          productName: order.productName,
          status: order.status
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const { orderId, amountPaid, pendingAmount } = req.body;

    if (!orderId || amountPaid === undefined || pendingAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'OrderId, amountPaid, and pendingAmount are required'
      });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const payment = new Payment({
      orderId,
      amountPaid,
      pendingAmount,
      status: pendingAmount === 0 ? 'completed' : (amountPaid > 0 ? 'partial' : 'pending')
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};


