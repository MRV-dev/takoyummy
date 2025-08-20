const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
