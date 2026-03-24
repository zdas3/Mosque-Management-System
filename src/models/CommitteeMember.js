import mongoose from 'mongoose';

const CommitteeMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String },
    contact: { type: String },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.CommitteeMember || mongoose.model('CommitteeMember', CommitteeMemberSchema);
