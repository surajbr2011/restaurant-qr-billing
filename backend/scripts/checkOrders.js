const mongoose = require('mongoose');
const Order = require('../models/Order');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        try {
            const pending = await Order.find({ status: 'pending' });
            console.log(`Pending Orders: ${pending.length}`);
            if (pending.length > 0) {
                console.log('Sample Order ID:', pending[0]._id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error(err));
