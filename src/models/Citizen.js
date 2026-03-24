
import mongoose from 'mongoose';

const FamilyMemberSchema = new mongoose.Schema({
    photo: String, // URL or path
    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'] },
    age: { type: Number },
    relationship: { type: String },
    maritalStatus: { type: String },
    spouseName: String,
    bloodGroup: String,
    education: String,
    occupation: String,
});

const PaymentHistorySchema = new mongoose.Schema({
    month: { type: String, required: true }, // e.g., "January"
    year: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    amount: { type: Number },
    updatedBy: { type: String }, // Admin ID or Name
    updatedAt: { type: Date, default: Date.now },
});

const CitizenSchema = new mongoose.Schema({
    membershipId: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide a name for this citizen.'],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    mobile: {
        type: String,
        required: [true, 'Please provide a mobile number.'],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    monthlyFee: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        enum: ['admin', 'citizen'],
        default: 'citizen',
    },
    familyMembers: [FamilyMemberSchema],
    paymentHistory: [PaymentHistorySchema],
}, { timestamps: true });

export default mongoose.models.Citizen || mongoose.model('Citizen', CitizenSchema);
