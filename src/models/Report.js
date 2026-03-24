import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true }, // /public/uploads/reports/...
    month: { type: String },
    year: { type: Number },
    type: {
        type: String,
        enum: ['Income', 'Expense', 'General'],
    },
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
