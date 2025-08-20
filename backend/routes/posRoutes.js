const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Sale = require('../models/salesModels');

router.post('/calculate', async (req, res) => {
    try {
        const { items, payment, } = req.body;

        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
        const change = payment - totalPrice;

        if (change < 0) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Create a new order
        const newOrder = new Order({
            items,
            totalPrice,
            payment,
            change,
        });
        await newOrder.save();

        // Save individual sales
        for (const item of items) {
            const newSale = new Sale({
                product: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
            });
            await newSale.save();
        }

        res.status(201).json({
            message: 'Order processed successfully!',
            order: newOrder,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
