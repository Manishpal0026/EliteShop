const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'shopnest-super-secret-key-2026-08-29';
}

const ensureDefaultData = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@shopnest.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.create({
        name: 'Admin User',
        email: 'admin@shopnest.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Default admin created: admin@shopnest.com / password123');
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany([
        {
          name: 'Wireless Noise-Cancelling Headphones',
          description: 'Immersive sound experience with advanced active noise cancellation.',
          price: 299.99,
          category: 'Electronics',
          stock: 15,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          isFeatured: true,
          ratings: 4.8,
          numReviews: 24
        },
        {
          name: 'Minimalist Modern Chair',
          description: 'A stylish and comfortable addition to any contemporary living room.',
          price: 150.0,
          category: 'Furniture',
          stock: 30,
          imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          isFeatured: true,
          ratings: 4.2,
          numReviews: 12
        },
        {
          name: 'Professional DSLR Camera',
          description: 'Capture stunning moments with high-resolution clarity and speed.',
          price: 1199.99,
          category: 'Electronics',
          stock: 8,
          imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          isFeatured: true,
          ratings: 4.9,
          numReviews: 50
        },
        {
          name: 'Classic White Sneakers',
          description: 'Versatile and comfortable, a staple for any casual outfit.',
          price: 85.0,
          category: 'Clothing',
          stock: 50,
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          isFeatured: true,
          ratings: 4.5,
          numReviews: 89
        }
      ]);
      console.log('Default sample products created.');
    }
  } catch (error) {
    console.error('Default data seeding failed:', error.message);
  }
};

const app = express();

connectDB()
  .then(() => ensureDefaultData())
  .catch((error) => {
    console.error('MongoDB startup failed:', error.message);
  });

// Set CORS for frontend URL / allow single-node deploy
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
  res.send('ShopNest API is running...');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;