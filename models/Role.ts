// models/Role.js
import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: [String],
});

export default mongoose.models.Role || mongoose.model('Role', RoleSchema);
