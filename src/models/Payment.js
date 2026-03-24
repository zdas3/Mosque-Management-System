import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ['Fee', 'Contribution'],
        required: true,
    },
    month: { type: String },
    year: { type: Number },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid',
    },
    paymentDate: { type: Date },
    updatedBy: { type: String },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
