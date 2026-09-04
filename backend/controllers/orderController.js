const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');


// ==========================================
// CREATE ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {

    console.log('=================================');
    console.log('CREATE ORDER REQUEST');
    console.log('User:', req.user?._id);
    console.log('Body:', req.body);
    console.log('=================================');


    const {
      items,
      totalAmount,
      address,
      paymentId
    } = req.body;


    // ======================================
    // CHECK USER
    // ======================================

    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated'
      });
    }


    // ======================================
    // CHECK CART ITEMS
    // ======================================

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: 'Your cart is empty'
      });
    }


    // ======================================
    // CHECK TOTAL AMOUNT
    // ======================================

    if (
      totalAmount === undefined ||
      totalAmount === null ||
      Number(totalAmount) <= 0
    ) {
      return res.status(400).json({
        message: 'Invalid total amount'
      });
    }


    // ======================================
    // CHECK ADDRESS
    // ======================================

    if (!address) {
      return res.status(400).json({
        message: 'Shipping address is required'
      });
    }


    // ======================================
    // PREPARE ORDER ITEMS
    // ======================================

    const orderItems = items.map((item) => {

      const productId =
        item.productId || item._id;

      const qty =
        Number(item.qty) ||
        Number(item.quantity) ||
        1;

      const price =
        Number(item.price) || 0;


      if (!productId) {
        throw new Error(
          'Product ID is missing from cart item'
        );
      }


      return {

        productId: productId,

        name:
          item.name ||
          'Product',

        price: price,

        // IMPORTANT:
        // Your Order schema uses "qty"
        qty: qty

      };
    });


    console.log(
      'Prepared order items:',
      orderItems
    );


    // ======================================
    // CREATE ORDER
    // ======================================

    const order = new Order({

      userId: req.user._id,

      items: orderItems,

      totalAmount:
        Number(totalAmount),

      address: address,

      paymentId:
        paymentId ||
        `TEST_PAYMENT_${Date.now()}`
    });


    console.log('Saving order...');


    await order.save();


    console.log(
      'ORDER CREATED SUCCESSFULLY:',
      order._id
    );


    // ======================================
    // SEND EMAIL
    // ======================================

    try {

      const addressText =
        typeof address === 'object'
          ? `
Name: ${address.fullName || ''}
Street: ${address.street || ''}
City: ${address.city || ''}
Postal Code: ${address.postalCode || ''}
Country: ${address.country || ''}
Contact: ${address.contact || ''}
`
          : String(address);


      const message = `
Dear ${req.user.name || 'Customer'},

Thank you for shopping with ShopNest!

Your order has been successfully placed.

Order ID:
${order._id}

Total Amount:
₹${Number(totalAmount).toFixed(2)}

Shipping Address:
${addressText}

We will notify you once your order is shipped.

Best regards,
ShopNest Team
`;


      await sendEmail(
        req.user.email,
        'ShopNest Order Confirmation',
        message
      );


      console.log(
        'Order confirmation email sent'
      );

    } catch (emailError) {

      console.error(
        'Email sending failed:',
        emailError.message
      );

      // Email failure should NOT
      // cancel the order.
    }


    // ======================================
    // SUCCESS RESPONSE
    // ======================================

    return res.status(201).json({

      message:
        'Order created successfully',

      order: order

    });


  } catch (error) {

    console.error(
      '================================='
    );

    console.error(
      'ERROR CREATING ORDER:'
    );

    console.error(error);

    console.error(
      'ERROR MESSAGE:',
      error.message
    );

    console.error(
      '================================='
    );


    return res.status(500).json({

      message:
        'Error creating order',

      error:
        error.message

    });
  }
};


// ==========================================
// GET MY ORDERS
// ==========================================

const myOrders = async (req, res) => {

  try {

    const orders = await Order
      .find({
        userId: req.user._id
      })
      .populate(
        'items.productId',
        'name price imageUrl'
      )
      .sort({
        createdAt: -1
      });


    res.json(orders);

  } catch (error) {

    console.error(
      'Error fetching orders:',
      error
    );

    res.status(500).json({

      message:
        'Error fetching orders',

      error:
        error.message

    });
  }
};


// ==========================================
// GET ALL ORDERS - ADMIN
// ==========================================

const getOrders = async (req, res) => {

  try {

    const orders = await Order
      .find({})
      .populate(
        'userId',
        'name email'
      )
      .populate(
        'items.productId',
        'name price imageUrl'
      )
      .sort({
        createdAt: -1
      });


    res.json(orders);

  } catch (error) {

    console.error(
      'Error fetching all orders:',
      error
    );

    res.status(500).json({

      message:
        'Error fetching orders',

      error:
        error.message

    });
  }
};


// ==========================================
// UPDATE ORDER STATUS - ADMIN
// ==========================================

const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;


    if (!status) {

      return res.status(400).json({

        message:
          'Order status is required'

      });
    }


    const order =
      await Order.findById(
        req.params.id
      );


    if (!order) {

      return res.status(404).json({

        message:
          'Order not found'

      });
    }


    order.status = status;

    await order.save();


    res.json({

      message:
        'Order status updated',

      order

    });


  } catch (error) {

    console.error(
      'Error updating order status:',
      error
    );

    res.status(500).json({

      message:
        'Error updating order status',

      error:
        error.message

    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createOrder,
  myOrders,
  getOrders,
  updateOrderStatus
};

