import Order from '../models/Order.js';
import Payment from '../models/Payment.js';

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    const orderIds = orders.map(o => o.orderId);
    const payments = await Payment.find({ orderId: { $in: orderIds } });
    const paymentMap = {};
    payments.forEach(p => {
      paymentMap[p.orderId] = p;
    });

    const enrichedOrders = orders.map(order => {
      const payment = paymentMap[order.orderId];
      return {
        ...order.toObject(),
        payment: payment ? {
          paymentId: payment.paymentId,
          amountPaid: payment.amountPaid,
          pendingAmount: payment.pendingAmount,
          status: payment.status
        } : null
      };
    });

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      count: enrichedOrders.length,
      data: enrichedOrders
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findOne({ orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const payment = await Payment.findOne({ orderId });

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: {
        ...order.toObject(),
        payment: payment ? {
          paymentId: payment.paymentId,
          amountPaid: payment.amountPaid,
          pendingAmount: payment.pendingAmount,
          status: payment.status
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productName, imageURL, totalAmount, status } = req.body;

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    if (totalAmount === undefined || totalAmount === null) {
      return res.status(400).json({
        success: false,
        message: 'Total amount is required'
      });
    }

    const order = new Order({
      userId,
      productName,
      imageURL: imageURL || '',
      totalAmount: parseFloat(totalAmount),
      status: status || 'pending'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderId, userId },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
