const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  },

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async login(phone) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async verify() {
    return this.request('/api/auth/verify');
  },

  async sendMessage(message) {
    return this.request('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async getAllDeals() {
    const response = await fetch(`${API_BASE_URL}/api/deals`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch deals');
    }
    return data;
  },

  async getDealById(dealId) {
    const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch deal');
    }
    return data;
  },

  async createDeal(dealData) {
    return this.request('/api/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    });
  },

  async getUserOrders() {
    return this.request('/api/orders');
  },

  async getOrderById(orderId) {
    return this.request(`/api/orders/${orderId}`);
  },

  async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getUserPayments() {
    return this.request('/api/payments');
  },

  async getPaymentById(paymentId) {
    return this.request(`/api/payments/${paymentId}`);
  },

  async createPayment(paymentData) {
    return this.request('/api/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

export { API_BASE_URL };

