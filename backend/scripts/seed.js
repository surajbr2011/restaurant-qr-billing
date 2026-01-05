const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
require('dotenv').config();

const sampleMenuItems = [
  {
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potatoes",
    price: 120,
    category: "Main Course",
    isAvailable: true
  },
  {
    name: "Paneer Butter Masala",
    description: "Cottage cheese in rich tomato gravy",
    price: 180,
    category: "Main Course",
    isAvailable: true
  },
  {
    name: "Chai",
    description: "Traditional Indian spiced tea",
    price: 20,
    category: "Beverage",
    isAvailable: true
  },
  {
    name: "Cold Coffee",
    description: "Iced coffee with cream",
    price: 80,
    category: "Beverage",
    isAvailable: true
  },
  {
    name: "Gulab Jamun",
    description: "Sweet milk dumplings in rose syrup",
    price: 60,
    category: "Dessert",
    isAvailable: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_db');
    console.log('Connected to MongoDB');
    
    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    
    // Insert sample data
    await MenuItem.insertMany(sampleMenuItems);
    console.log('Sample menu items added successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();