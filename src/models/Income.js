import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    category: { type: String },
    description: { type: String },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    }
}, { timestamps: true });

export default mongoose.models.Income || mongoose.model('Income', IncomeSchema);
