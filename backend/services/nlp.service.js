import natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const CATEGORIES = [
  'electronics', 'mobile', 'phone', 'laptop', 'computer', 'tablet',
  'fashion', 'clothing', 'shoes', 'accessories', 'watch', 'watches',
  'home', 'furniture', 'kitchen', 'appliances', 'decor',
  'beauty', 'health', 'fitness', 'sports',
  'books', 'toys', 'games', 'gaming',
  'grocery', 'food', 'beverages',
  'automotive', 'car', 'bike',
  'general'
];

const CATEGORY_MAP = {
  'mobile': 'electronics',
  'phone': 'electronics',
  'phones': 'electronics',
  'laptop': 'electronics',
  'laptops': 'electronics',
  'computer': 'electronics',
  'computers': 'electronics',
  'tablet': 'electronics',
  'tablets': 'electronics',
  'tv': 'electronics',
  'television': 'electronics',
  'headphone': 'electronics',
  'headphones': 'electronics',
  'earbuds': 'electronics',
  'speaker': 'electronics',
  'speakers': 'electronics',
  'watch': 'electronics',
  'watches': 'electronics',
  'smartwatch': 'electronics',
  'clothing': 'fashion',
  'clothes': 'fashion',
  'shirt': 'fashion',
  'shirts': 'fashion',
  'pants': 'fashion',
  'dress': 'fashion',
  'shoes': 'fashion',
  'shoe': 'fashion',
  'sneakers': 'fashion',
  'furniture': 'home',
  'kitchen': 'home',
  'appliance': 'home',
  'appliances': 'home',
  'decor': 'home',
  'decoration': 'home',
  'fitness': 'sports',
  'gym': 'sports',
  'exercise': 'sports',
  'game': 'gaming',
  'games': 'gaming',
  'gaming': 'gaming',
  'playstation': 'gaming',
  'xbox': 'gaming',
  'nintendo': 'gaming',
  'car': 'automotive',
  'bike': 'automotive',
  'vehicle': 'automotive'
};

const INTENT_PATTERNS = {
  DEALS: {
    keywords: ['deal', 'deals', 'discount', 'discounts', 'offer', 'offers', 'product', 'products', 'sale', 'sales', 'promotion', 'promotions', 'latest', 'new', 'show', 'find', 'search', 'browse', 'available'],
    phrases: ['new deals', 'latest deals', 'show deals', 'show me deals', 'find deals', 'best deals', 'hot deals', 'top deals', 'available deals', 'what deals']
  },
  ORDERS: {
    keywords: ['order', 'orders', 'purchase', 'purchases', 'bought', 'buy', 'track', 'tracking', 'history'],
    phrases: ['my order', 'my orders', 'order history', 'order status', 'track order', 'track my order', 'where is my order', 'purchase history', 'what i ordered', 'what did i order']
  },
  PAYMENT: {
    keywords: ['payment', 'payments', 'pay', 'paid', 'pending', 'bill', 'invoice', 'amount', 'due', 'transaction'],
    phrases: ['payment status', 'payment history', 'pending payment', 'my payments', 'check payment', 'payment details', 'how much', 'amount due', 'have i paid']
  },
  GREETING: {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'howdy', 'morning', 'afternoon', 'evening', 'hola'],
    phrases: ['good morning', 'good afternoon', 'good evening', 'how are you', 'whats up', "what's up"]
  },
  HELP: {
    keywords: ['help', 'support', 'assist', 'assistance', 'options', 'menu', 'commands', 'what', 'how', 'can'],
    phrases: ['help me', 'i need help', 'need support', 'i need support', 'what can you do', 'how does this work', 'show options', 'show menu', 'available options']
  }
};

const normalizeText = (text) => {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ');
};

const tokenizeAndStem = (text) => {
  const normalized = normalizeText(text);
  const tokens = tokenizer.tokenize(normalized) || [];
  return {
    tokens,
    stems: tokens.map(token => stemmer.stem(token))
  };
};

export const extractPriceRange = (message) => {
  const normalized = normalizeText(message);
  let minPrice = null;
  let maxPrice = null;

  const betweenMatch = normalized.match(/(?:between|from)\s+(\d+)\s*(?:to|and|-)\s*(\d+)/i);
  if (betweenMatch) {
    minPrice = parseInt(betweenMatch[1]);
    maxPrice = parseInt(betweenMatch[2]);
    return { minPrice, maxPrice };
  }

  const rangeMatch = normalized.match(/(\d+)\s*(?:-|to)\s*(\d+)/);
  if (rangeMatch) {
    minPrice = parseInt(rangeMatch[1]);
    maxPrice = parseInt(rangeMatch[2]);
    return { minPrice, maxPrice };
  }

  const underMatch = normalized.match(/(?:under|below|less than|upto|up to|max|maximum|within)\s+(\d+)/i);
  if (underMatch) {
    maxPrice = parseInt(underMatch[1]);
    return { minPrice: 0, maxPrice };
  }

  const aboveMatch = normalized.match(/(?:above|over|more than|greater than|min|minimum|starting|from)\s+(\d+)/i);
  if (aboveMatch && !normalized.includes('to')) {
    minPrice = parseInt(aboveMatch[1]);
    return { minPrice, maxPrice: null };
  }

  const aroundMatch = normalized.match(/(?:around|approximately|about|near|approx)\s+(\d+)/i);
  if (aroundMatch) {
    const price = parseInt(aroundMatch[1]);
    minPrice = Math.floor(price * 0.8);
    maxPrice = Math.ceil(price * 1.2);
    return { minPrice, maxPrice };
  }

  return { minPrice: null, maxPrice: null };
};

export const extractCategory = (message) => {
  const normalized = normalizeText(message);
  const tokens = tokenizer.tokenize(normalized) || [];

  for (const token of tokens) {
    const lowerToken = token.toLowerCase();
    
    if (CATEGORY_MAP[lowerToken]) {
      return CATEGORY_MAP[lowerToken];
    }
    
    if (CATEGORIES.includes(lowerToken)) {
      return lowerToken;
    }
  }

  for (const [term, category] of Object.entries(CATEGORY_MAP)) {
    if (normalized.includes(term)) {
      return category;
    }
  }

  return null;
};

export const detectIntent = (message) => {
  if (!message || typeof message !== 'string') {
    return { intent: 'UNKNOWN', confidence: 0, filters: {} };
  }

  const { tokens, stems } = tokenizeAndStem(message);
  const normalized = normalizeText(message);

  const scores = {};

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;

    for (const phrase of patterns.phrases) {
      if (normalized.includes(phrase.toLowerCase())) {
        score += 3;
      }
    }

    for (const keyword of patterns.keywords) {
      if (tokens.includes(keyword)) {
        score += 2;
      }
      const keywordStem = stemmer.stem(keyword);
      if (stems.includes(keywordStem)) {
        score += 1;
      }
    }

    scores[intent] = score;
  }

  let maxScore = 0;
  let detectedIntent = 'UNKNOWN';

  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent;
    }
  }

  const totalPossibleScore = tokens.length * 2 + 3;
  const confidence = maxScore > 0 ? Math.min(maxScore / totalPossibleScore, 0.95) : 0;

  const priceRange = extractPriceRange(message);
  const category = extractCategory(message);

  const filters = {};
  if (priceRange.minPrice !== null || priceRange.maxPrice !== null) {
    filters.priceRange = priceRange;
  }
  if (category) {
    filters.category = category;
  }

  if ((filters.priceRange || filters.category) && detectedIntent !== 'DEALS') {
    const dealScore = scores['DEALS'] || 0;
    if (dealScore > 0 || filters.category || filters.priceRange) {
      detectedIntent = 'DEALS';
    }
  }

  return {
    intent: detectedIntent,
    confidence: confidence > 0 ? confidence : 0.1,
    filters
  };
};

export const generateResponse = (intent, data = null, userName = null) => {
  const greeting = userName ? `Hey ${userName}! ` : '';
  const emoji = {
    wave: '👋',
    fire: '🔥',
    package: '📦',
    card: '💳',
    check: '✅',
    star: '⭐',
    sparkle: '✨',
    point: '👇',
    think: '🤔',
    smile: '😊'
  };

  const responses = {
    GREETING: {
      message: `${greeting}${emoji.wave} I'm your shopping assistant! Ready to help you find amazing deals. What would you like to do?`,
      type: 'text',
      quickActions: ['New Deals', 'My Orders', 'Payment Status', 'Help']
    },
    DEALS: {
      message: data && data.length > 0 
        ? `${greeting}${emoji.fire} Here are some amazing deals for you!`
        : `${greeting}${emoji.think} No deals found matching your criteria. Try different filters!`,
      type: 'cards',
      cardType: 'deal',
      cards: data || [],
      quickActions: ['New Deals', 'My Orders', 'Payment Status', 'Help']
    },
    ORDERS: {
      message: data && data.length > 0
        ? `${greeting}${emoji.package} Here are your orders:`
        : `${greeting}${emoji.package} You don't have any orders yet. Check out our deals!`,
      type: 'cards',
      cardType: 'order',
      cards: data || [],
      quickActions: ['New Deals', 'My Orders', 'Payment Status', 'Help']
    },
    PAYMENT: {
      message: data && data.length > 0
        ? `${greeting}${emoji.card} Here's your payment information:`
        : `${greeting}${emoji.card} No payment records found.`,
      type: 'cards',
      cardType: 'payment',
      cards: data || [],
      quickActions: ['New Deals', 'My Orders', 'Payment Status', 'Help']
    },
    HELP: {
      message: `${greeting}${emoji.smile} I'm here to help! Here's what I can do:\n\n` +
        `${emoji.fire} **New Deals** - Browse latest offers\n` +
        `${emoji.package} **My Orders** - Track your orders\n` +
        `${emoji.card} **Payment Status** - Check payments\n\n` +
        `You can also ask things like:\n` +
        `• "Show electronics deals under 500"\n` +
        `• "Find deals between 100-300"\n` +
        `• "What's my order status?"`,
      type: 'text',
      quickActions: ['New Deals', 'My Orders', 'Payment Status']
    },
    UNKNOWN: {
      message: `${greeting}${emoji.think} I'm not sure I understood that. Try asking about:\n` +
        `• Deals (e.g., "Show me electronics deals")\n` +
        `• Orders (e.g., "Check my orders")\n` +
        `• Payments (e.g., "Payment status")`,
      type: 'text',
      quickActions: ['New Deals', 'My Orders', 'Payment Status', 'Help']
    }
  };

  return responses[intent] || responses.UNKNOWN;
};

export default {
  detectIntent,
  extractPriceRange,
  extractCategory,
  generateResponse
};



