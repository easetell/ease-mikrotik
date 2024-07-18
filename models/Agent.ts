import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
    agentId: {
        type: String,
        required: true,
        unique: true,
    },
    agentName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    region: {
        type: String,
        required: true,
    },
    target: {
        type: Number,
        required: true,
    },
    achieved: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    from: {
        type: Date,
        required: true,
    },
    to: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema);