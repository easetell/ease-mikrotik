// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);