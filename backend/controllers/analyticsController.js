const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');


const getAdminStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

    res.json({ 
        totalOrders, 
        totalProducts, 
        totalUsers, 
        totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message});
  }
};

module.exports = { getAdminStats };