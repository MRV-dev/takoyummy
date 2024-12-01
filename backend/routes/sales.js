const express = require('express');
const Sale = require('../models/salesModels'); 
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        console.log("Received GET request for sales");
        const sales = await Sale.find().sort({ date: -1 });
        res.status(200).json(sales);  // Send data as JSON
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const saleData = req.body;

        // Create a new sale entry in the database
        const sale = new Sale({
            products: saleData.products,
            totalAmount: saleData.totalAmount,
            paymentReceived: saleData.paymentReceived,
            changeGiven: saleData.changeGiven,
            createdAt: saleData.createdAt
        });

        // Save to the database
        const savedSale = await sale.save();
        res.status(201).json(savedSale);  // Send back the saved sale data

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
