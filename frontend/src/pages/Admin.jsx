import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Plus, CheckCircle, XCircle } from 'lucide-react';

const CATEGORIES = [
  'electronics',
  'fashion',
  'home',
  'sports',
  'gaming',
  'beauty',
  'books',
  'grocery',
  'automotive',
  'general'
];

const SOURCES = ['Amazon', 'Flipkart', 'Myntra', 'Store', 'Other'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('deals');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [dealForm, setDealForm] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    category: 'general',
    source: 'Store',
    rating: '',
    link: '',
    imageURL: '',
  });

  const [orderForm, setOrderForm] = useState({
    productName: '',
    imageURL: '',
    totalAmount: '',
    status: 'pending',
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    orderId: '',
    amountPaid: '',
    pendingAmount: '',
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (activeTab === 'payments') {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      const response = await api.getUserOrders();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handlePriceChange = (field, value) => {
    const newForm = { ...dealForm, [field]: value };
    
    if (field === 'price' || field === 'originalPrice') {
      const price = parseFloat(field === 'price' ? value : newForm.price) || 0;
      const originalPrice = parseFloat(field === 'originalPrice' ? value : newForm.originalPrice) || 0;
      
      if (originalPrice > 0 && price > 0 && originalPrice > price) {
        newForm.discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      }
    }
    
    setDealForm(newForm);
  };

  const handleDealSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.createDeal({
        title: dealForm.title,
        description: dealForm.description || '',
        price: parseFloat(dealForm.price),
        originalPrice: dealForm.originalPrice ? parseFloat(dealForm.originalPrice) : null,
        discount: dealForm.discount ? parseInt(dealForm.discount) : 0,
        category: dealForm.category,
        source: dealForm.source,
        rating: dealForm.rating ? parseFloat(dealForm.rating) : 0,
        link: dealForm.link || '',
        imageURL: dealForm.imageURL,
      });

      if (response.success) {
        showMessage('success', 'Deal created successfully!');
        setDealForm({
          title: '',
          description: '',
          price: '',
          originalPrice: '',
          discount: '',
          category: 'general',
          source: 'Store',
          rating: '',
          link: '',
          imageURL: '',
        });
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.createOrder({
        productName: orderForm.productName,
        imageURL: orderForm.imageURL || '',
        totalAmount: parseFloat(orderForm.totalAmount),
        status: orderForm.status,
      });

      if (response.success) {
        showMessage('success', 'Order created successfully!');
        setOrderForm({ productName: '', imageURL: '', totalAmount: '', status: 'pending' });
        loadOrders();
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.createPayment({
        orderId: paymentForm.orderId,
        amountPaid: parseFloat(paymentForm.amountPaid),
        pendingAmount: parseFloat(paymentForm.pendingAmount),
      });

      if (response.success) {
        showMessage('success', 'Payment created successfully!');
        setPaymentForm({ orderId: '', amountPaid: '', pendingAmount: '' });
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Header */}
      <header className="border-b border-[#061622] bg-[#17181c]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#e7e9ea]">Admin Panel</h1>
          <div className="flex gap-4">
            <Link
              to="/chat"
              className="px-4 py-2 rounded-lg bg-[#000000] text-[#e7e9ea] hover:bg-[#061622] transition-colors border border-[#061622]"
            >
              Chat
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-[#1c9cf0] text-white hover:bg-[#1a8cd8] transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[#061622]">
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'deals'
                ? 'text-[#1c9cf0] border-b-2 border-[#1c9cf0]'
                : 'text-[#72767a] hover:text-[#e7e9ea]'
            }`}
          >
            Create Deal
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-[#1c9cf0] border-b-2 border-[#1c9cf0]'
                : 'text-[#72767a] hover:text-[#e7e9ea]'
            }`}
          >
            Create Order
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'payments'
                ? 'text-[#1c9cf0] border-b-2 border-[#1c9cf0]'
                : 'text-[#72767a] hover:text-[#e7e9ea]'
            }`}
          >
            Create Payment
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-900/30 border border-green-700/50 text-green-300'
                : 'bg-red-900/30 border border-red-700/50 text-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Deal Form */}
        {activeTab === 'deals' && (
          <div className="bg-[#17181c] rounded-xl border border-[#061622] p-8">
            <h2 className="text-2xl font-bold text-[#e7e9ea] mb-6">Create New Deal</h2>
            <form onSubmit={handleDealSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={dealForm.title}
                  onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                  required
                  placeholder="Deal title"
                  className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={dealForm.description}
                  onChange={(e) => setDealForm({ ...dealForm, description: e.target.value })}
                  placeholder="Deal description"
                  rows="2"
                  className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors resize-none"
                />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={dealForm.price}
                    onChange={(e) => handlePriceChange('price', e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="499"
                    className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    value={dealForm.originalPrice}
                    onChange={(e) => handlePriceChange('originalPrice', e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="999"
                    className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    value={dealForm.discount}
                    onChange={(e) => setDealForm({ ...dealForm, discount: e.target.value })}
                    min="0"
                    max="100"
                    placeholder="50"
                    className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                  />
                </div>
              </div>

              {/* Category and Source Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={dealForm.category}
                    onChange={(e) => setDealForm({ ...dealForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                    Source
                  </label>
                  <select
                    id="source"
                    value={dealForm.source}
                    onChange={(e) => setDealForm({ ...dealForm, source: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                  >
                    {SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  id="rating"
                  value={dealForm.rating}
                  onChange={(e) => setDealForm({ ...dealForm, rating: e.target.value })}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="4.5"
                  className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="imageURL" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  id="imageURL"
                  value={dealForm.imageURL}
                  onChange={(e) => setDealForm({ ...dealForm, imageURL: e.target.value })}
                  required
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                />
              </div>

              {/* Link */}
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                  Product Link
                </label>
                <input
                  type="url"
                  id="link"
                  value={dealForm.link}
                  onChange={(e) => setDealForm({ ...dealForm, link: e.target.value })}
                  placeholder="https://amazon.in/product"
                  className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#1c9cf0] text-white font-semibold hover:bg-[#1a8cd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                {loading ? 'Creating...' : 'Create Deal'}
              </button>
            </form>
          </div>
        )}

        {/* Order Form */}
        {activeTab === 'orders' && (
          <div className="bg-[#17181c] rounded-xl border border-[#061622] p-8">
            <h2 className="text-2xl font-bold text-[#e7e9ea] mb-6">Create New Order</h2>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="productName"
                  value={orderForm.productName}
                  onChange={(e) => setOrderForm({ ...orderForm, productName: e.target.value })}
                  required
                  placeholder="Product name"
                  className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="totalAmount" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                  Total Amount (₹) *
                </label>
                <input
                  type="number"
                  id="totalAmount"
                  value={orderForm.totalAmount}
                  onChange={(e) => setOrderForm({ ...orderForm, totalAmount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  placeholder="499"
                  className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="orderImageURL" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  id="orderImageURL"
                  value={orderForm.imageURL}
                  onChange={(e) => setOrderForm({ ...orderForm, imageURL: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="orderStatus" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                  Status
                </label>
                <select
                  id="orderStatus"
                  value={orderForm.status}
                  onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="review_submitted">Review Submitted</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#1c9cf0] text-white font-semibold hover:bg-[#1a8cd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                {loading ? 'Creating...' : 'Create Order'}
              </button>
            </form>
          </div>
        )}

        {/* Payment Form */}
        {activeTab === 'payments' && (
          <div className="bg-[#17181c] rounded-xl border border-[#061622] p-8">
            <h2 className="text-2xl font-bold text-[#e7e9ea] mb-6">Create New Payment</h2>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                  Order ID *
                </label>
                <select
                  id="orderId"
                  value={paymentForm.orderId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, orderId: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                >
                  <option value="">Select an order</option>
                  {orders.map((order) => (
                    <option key={order.orderId} value={order.orderId}>
                      {order.orderId} - {order.productName} (₹{order.totalAmount})
                    </option>
                  ))}
                </select>
                {orders.length === 0 && (
                  <p className="mt-2 text-sm text-[#72767a]">
                    No orders available. Create an order first.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amountPaid" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                    Amount Paid (₹) *
                  </label>
                  <input
                    type="number"
                    id="amountPaid"
                    value={paymentForm.amountPaid}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="pendingAmount" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                    Pending Amount (₹) *
                  </label>
                  <input
                    type="number"
                    id="pendingAmount"
                    value={paymentForm.pendingAmount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, pendingAmount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#1c9cf0] text-white font-semibold hover:bg-[#1a8cd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                {loading ? 'Creating...' : 'Create Payment'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
