import { detectIntent, generateResponse } from '../services/nlp.service.js';
import Deal from '../models/Deal.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const formatDealCard = (deal) => ({
  id: deal.dealId,
  type: 'deal',
  title: deal.title,
  description: deal.description,
  price: deal.price,
  originalPrice: deal.originalPrice,
  discount: deal.discount,
  category: deal.category,
  source: deal.source,
  rating: deal.rating,
  imageURL: deal.imageURL,
  link: deal.link
});

const formatOrderCard = (order, payment = null) => ({
  id: order.orderId,
  type: 'order',
  orderId: order.orderId,
  productName: order.productName,
  imageURL: order.imageURL,
  totalAmount: order.totalAmount,
  status: order.status,
  statusLabel: formatStatus(order.status),
  paymentStatus: payment ? payment.status : 'pending',
  paymentStatusLabel: payment ? formatPaymentStatus(payment.status) : 'Pending',
  amountPaid: payment ? payment.amountPaid : 0,
  pendingAmount: payment ? payment.pendingAmount : order.totalAmount,
  createdAt: order.createdAt
});

const formatPaymentCard = (payment, order = null) => ({
  id: payment.paymentId,
  type: 'payment',
  paymentId: payment.paymentId,
  orderId: payment.orderId,
  productName: order ? order.productName : 'Unknown Product',
  imageURL: order ? order.imageURL : '',
  orderStatus: order ? order.status : 'unknown',
  orderStatusLabel: order ? formatStatus(order.status) : 'Unknown',
  totalAmount: order ? order.totalAmount : (payment.amountPaid + payment.pendingAmount),
  amountPaid: payment.amountPaid,
  pendingAmount: payment.pendingAmount,
  status: payment.status,
  statusLabel: formatPaymentStatus(payment.status),
  createdAt: payment.createdAt
});

const formatStatus = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'review_submitted': 'Review Submitted'
  };
  return statusMap[status] || status;
};

const formatPaymentStatus = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'partial': 'Partially Paid',
    'completed': 'Paid'
  };
  return statusMap[status] || status;
};

export const processMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user?.userId;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    let userName = null;
    if (userId) {
      const user = await User.findOne({ userId });
      if (user) {
        userName = user.name.split(' ')[0];
      }
    }

    const { intent, confidence, filters } = detectIntent(message);

    let responseData = null;
    let cards = [];

    switch (intent) {
      case 'DEALS': {
        const query = { isActive: true };
        
        if (filters.category) {
          query.category = filters.category;
        }
        
        if (filters.priceRange) {
          query.price = {};
          if (filters.priceRange.minPrice !== null) {
            query.price.$gte = filters.priceRange.minPrice;
          }
          if (filters.priceRange.maxPrice !== null) {
            query.price.$lte = filters.priceRange.maxPrice;
          }
          if (Object.keys(query.price).length === 0) {
            delete query.price;
          }
        }

        const deals = await Deal.find(query)
          .sort({ createdAt: -1 })
          .limit(10);

        cards = deals.map(formatDealCard);
        responseData = cards;
        break;
      }

      case 'ORDERS': {
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: 'Please login to view your orders',
            data: {
              intent,
              type: 'auth_required',
              action: 'login'
            }
          });
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        
        const orderIds = orders.map(o => o.orderId);
        const payments = await Payment.find({ orderId: { $in: orderIds } });
        const paymentMap = {};
        payments.forEach(p => {
          paymentMap[p.orderId] = p;
        });

        cards = orders.map(order => formatOrderCard(order, paymentMap[order.orderId]));
        responseData = cards;
        break;
      }

      case 'PAYMENT': {
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: 'Please login to view payment status',
            data: {
              intent,
              type: 'auth_required',
              action: 'login'
            }
          });
        }

        const userOrders = await Order.find({ userId });
        const orderIds = userOrders.map(o => o.orderId);
        const orderMap = {};
        userOrders.forEach(o => {
          orderMap[o.orderId] = o;
        });

        const payments = await Payment.find({ orderId: { $in: orderIds } })
          .sort({ createdAt: -1 });

        cards = payments.map(payment => formatPaymentCard(payment, orderMap[payment.orderId]));
        
        if (cards.length === 0 && userOrders.length > 0) {
          cards = userOrders.map(order => formatOrderCard(order, null));
        }
        
        responseData = cards;
        break;
      }

      case 'GREETING':
      case 'HELP':
      case 'UNKNOWN':
      default:
        responseData = null;
        break;
    }

    const response = generateResponse(intent, responseData, userName);

    res.status(200).json({
      success: true,
      data: {
        intent,
        confidence,
        filters,
        type: response.type,
        cardType: response.cardType || null,
        message: response.message,
        cards: response.cards || [],
        quickActions: response.quickActions || []
      }
    });
  } catch (error) {
    next(error);
  }
};

export const detectIntentOnly = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const result = detectIntent(message);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
