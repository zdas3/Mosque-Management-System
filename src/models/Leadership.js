import mongoose from 'mongoose';

const LeadershipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    category: { type: String, enum: ['Leadership', 'Committee Member', 'Education Staff'], default: 'Leadership' },
    image: { type: String },
    contact: { type: String },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Leadership || mongoose.model('Leadership', LeadershipSchema);
