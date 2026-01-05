const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET /api/menu - Get all available menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ isAvailable: true }).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// POST /api/menu - Create new menu item (for admin)
router.post('/', async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(400).json({ error: 'Failed to create menu item' });
  }
});

module.exports = router;