import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema({
    receiptNo: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    pdfUrl: { type: String }, // path to saved pdf if we generate/store it
}, { timestamps: true });

export default mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);
