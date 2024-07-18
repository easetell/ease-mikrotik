import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    placedBy: {
        type: String,
        required: true,
    },
    agentId: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    products: [ProductSchema],
    amount: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    vat: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
