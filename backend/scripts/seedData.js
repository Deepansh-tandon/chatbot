import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Deal from '../models/Deal.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import connectDB from '../config/database.js';

dotenv.config();

const sampleDeals = [
  {
    title: "TWS Wireless Earbuds Bluetooth 5.3",
    description: "High Bass & Noise Cancellation. Flipkart Assured Deal.",
    price: 499,
    originalPrice: 1999,
    discount: 75,
    category: "electronics",
    source: "Flipkart",
    rating: 4.8,
    link: "https://flipkart.com",
    imageURL: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500"
  },
  {
    title: "Smart LED Bulb 12W RGB",
    description: "Flash Sale! Control with app. Multiple colors.",
    price: 399,
    originalPrice: 799,
    discount: 50,
    category: "electronics",
    source: "Amazon",
    rating: 4.5,
    link: "https://amazon.in",
    imageURL: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
  },
  {
    title: "Premium Wireless Headphones",
    description: "High-quality noise-cancelling headphones with 30-hour battery life. Perfect for music lovers.",
    price: 199,
    originalPrice: 499,
    discount: 60,
    category: "electronics",
    source: "Amazon",
    rating: 4.7,
    link: "https://amazon.in",
    imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
  },
  {
    title: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch. Heart rate monitor, GPS, and 7-day battery life.",
    price: 249,
    originalPrice: 599,
    discount: 58,
    category: "electronics",
    source: "Flipkart",
    rating: 4.6,
    link: "https://flipkart.com",
    imageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
  },
  {
    title: "Portable Bluetooth Speaker",
    description: "Powerful sound in a compact design. Waterproof and shockproof. Perfect for outdoor adventures.",
    price: 79,
    originalPrice: 199,
    discount: 60,
    category: "electronics",
    source: "Amazon",
    rating: 4.4,
    link: "https://amazon.in",
    imageURL: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"
  },
  {
    title: "4K Ultra HD TV - 55 inch",
    description: "Crystal clear picture quality with HDR support. Smart TV features with voice control.",
    price: 599,
    originalPrice: 999,
    discount: 40,
    category: "electronics",
    source: "Flipkart",
    rating: 4.5,
    link: "https://flipkart.com",
    imageURL: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500"
  },
  {
    title: "Men's Casual Cotton Shirt",
    description: "Comfortable cotton shirt for everyday wear. Available in multiple colors.",
    price: 499,
    originalPrice: 1299,
    discount: 62,
    category: "fashion",
    source: "Myntra",
    rating: 4.3,
    link: "https://myntra.com",
    imageURL: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"
  },
  {
    title: "Women's Running Shoes",
    description: "Lightweight and comfortable running shoes with excellent grip.",
    price: 899,
    originalPrice: 2499,
    discount: 64,
    category: "fashion",
    source: "Amazon",
    rating: 4.6,
    link: "https://amazon.in",
    imageURL: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
  },
  {
    title: "Gaming Mechanical Keyboard RGB",
    description: "RGB backlit mechanical keyboard with customizable keys. Cherry MX switches.",
    price: 129,
    originalPrice: 299,
    discount: 57,
    category: "gaming",
    source: "Amazon",
    rating: 4.8,
    link: "https://amazon.in",
    imageURL: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500"
  },
  {
    title: "Ergonomic Office Chair",
    description: "Comfortable ergonomic chair with lumbar support. Adjustable height and armrests.",
    price: 299,
    originalPrice: 699,
    discount: 57,
    category: "home",
    source: "Flipkart",
    rating: 4.4,
    link: "https://flipkart.com",
    imageURL: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500"
  },
  {
    title: "Yoga Mat Premium 6mm",
    description: "Non-slip yoga mat with carrying strap. Perfect for home workouts.",
    price: 399,
    originalPrice: 899,
    discount: 56,
    category: "sports",
    source: "Amazon",
    rating: 4.5,
    link: "https://amazon.in",
    imageURL: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
  },
  {
    title: "Digital Alarm Wall Clock",
    description: "LED display with temperature and humidity. Remote control included.",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    category: "home",
    source: "Amazon",
    rating: 4.3,
    link: "https://amazon.in",
    imageURL: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500"
  }
];

const seedDeals = async () => {
  try {
    await connectDB();
    
    await Deal.deleteMany({});
    console.log('Cleared existing deals');

    const createdDeals = await Deal.insertMany(sampleDeals);
    console.log(`Seeded ${createdDeals.length} deals successfully!`);
    
    createdDeals.forEach(deal => {
      console.log(`- ${deal.title}: ₹${deal.price} (${deal.category}) [${deal.source}]`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding deals:', error);
    process.exit(1);
  }
};

const seedAll = async () => {
  try {
    await connectDB();
    
    await Deal.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    console.log('Cleared existing data');

    const createdDeals = await Deal.insertMany(sampleDeals);
    console.log(`Seeded ${createdDeals.length} deals`);

    const sampleUser = await User.create({
      name: "Gaurav Kumar",
      phone: "9876543210",
      email: "gaurav@example.com",
      address: "123 Main St, Mumbai, Maharashtra 400001"
    });
    console.log(`Created sample user: ${sampleUser.name} (${sampleUser.phone})`);

    const sampleOrders = [
      {
        userId: sampleUser.userId,
        productName: "Digital Alarm Wall Clock with Remote Control",
        imageURL: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500",
        totalAmount: 899,
        status: "review_submitted"
      },
      {
        userId: sampleUser.userId,
        productName: "Smart Fitness Watch",
        imageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        totalAmount: 249,
        status: "shipped"
      },
      {
        userId: sampleUser.userId,
        productName: "TWS Wireless Earbuds",
        imageURL: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
        totalAmount: 499,
        status: "delivered"
      },
      {
        userId: sampleUser.userId,
        productName: "Portable Bluetooth Speaker",
        imageURL: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
        totalAmount: 79,
        status: "processing"
      }
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`Created ${createdOrders.length} sample orders`);

    const samplePayments = [
      {
        orderId: createdOrders[0].orderId,
        amountPaid: 899,
        pendingAmount: 0,
        status: "completed"
      },
      {
        orderId: createdOrders[1].orderId,
        amountPaid: 249,
        pendingAmount: 0,
        status: "completed"
      },
      {
        orderId: createdOrders[2].orderId,
        amountPaid: 499,
        pendingAmount: 0,
        status: "completed"
      },
      {
        orderId: createdOrders[3].orderId,
        amountPaid: 0,
        pendingAmount: 79,
        status: "pending"
      }
    ];

    const createdPayments = await Payment.insertMany(samplePayments);
    console.log(`Created ${createdPayments.length} sample payments`);

    console.log('\nDatabase seeded successfully!');
    console.log('\nSample login credentials:');
    console.log(`   Phone: ${sampleUser.phone}`);
    console.log(`   Name: ${sampleUser.name}`);
    console.log(`   User ID: ${sampleUser.userId}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

const command = process.argv[2];

if (command === 'deals') {
  seedDeals();
} else if (command === 'all') {
  seedAll();
} else {
  console.log('Usage: node scripts/seedData.js [deals|all]');
  console.log('  deals - Seed only deals');
  console.log('  all   - Seed deals, users, orders, and payments');
  process.exit(0);
}
