import mongoose from 'mongoose';

const FamilyMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female'] },
    bloodGroup: { type: String },
    education: { type: String },
    photo: { type: String },
    maritalStatus: { type: String },
    spouseName: { type: String },
    occupation: { type: String },
}, { timestamps: true });

export default mongoose.models.FamilyMember || mongoose.model('FamilyMember', FamilyMemberSchema);
