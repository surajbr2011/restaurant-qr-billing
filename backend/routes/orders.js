const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// GET /api/orders/pending - Get all pending orders
router.get('/pending', async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: 'pending' })
      .sort({ createdAt: 1 })
      .populate('items.itemId');
    res.json(pendingOrders);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ error: 'Failed to fetch pending orders' });
  }
});

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  console.log('POST /api/orders received body:', JSON.stringify(req.body));
  try {
    const { tableId, items } = req.body;

    if (!tableId || !items || !Array.isArray(items)) {
      console.error('Invalid request body structure');
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Validate items and get current prices
    const orderItems = [];
    for (const item of items) {
      if (!item.itemId) {
        console.error('Item missing itemId:', item);
        continue;
      }
      const menuItem = await MenuItem.findById(item.itemId);
      if (!menuItem) {
        console.error(`Menu item not found: ${item.itemId}`);
        return res.status(400).json({ error: `Item ${item.itemId} not found` });
      }
      if (!menuItem.isAvailable) {
        console.error(`Menu item not available: ${menuItem.name}`);
        return res.status(400).json({ error: `Item ${item.itemId} is not available` });
      }

      orderItems.push({
        itemId: item.itemId,
        name: menuItem.name,
        quantity: item.quantity,
        priceAtOrder: menuItem.price
      });
    }

    console.log('Constructed orderItems:', orderItems);

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.priceAtOrder * item.quantity), 0);

    const order = new Order({
      tableId,
      items: orderItems,
      totalAmount
    });

    console.log('Saving order...');
    await order.save();
    console.log('Order saved:', order._id);

    // Notify admin panel about new order
    try {
      const io = req.app.get('io');
      if (io) {
        io.to('admin_room').emit('new_order', order);
        console.log('Emitted new_order event');
      } else {
        console.warn('Socket.IO instance not found on app');
      }
    } catch (socketError) {
      console.error('Socket emission error:', socketError);
      // Don't fail the request just because socket failed
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order FULL DETAILS:', error);
    res.status(400).json({ error: 'Failed to create order: ' + error.message });
  }
});

// PATCH /api/orders/:id/generate-bill - Generate bill for order
router.patch('/:id/generate-bill', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = 'billed';
    order.billedAt = new Date();
    await order.save();

    // Notify customer that bill is ready
    const io = req.app.get('io');
    io.to(`table_${order.tableId}`).emit('bill_ready', order);

    res.json(order);
  } catch (error) {
    console.error('Error generating bill:', error);
    res.status(400).json({ error: 'Failed to generate bill' });
  }
});

// GET /api/orders/:id/status - Get order status
router.get('/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ status: order.status, totalAmount: order.totalAmount });
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ error: 'Failed to fetch order status' });
  }
});

module.exports = router;