import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    agentId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    creditlimit: {
        type: Number,
        required: true,
    },
    activedebt: {
        type: Number,
        required: true,
        default: 0, //default value
    },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);