import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    membershipId: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
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
    role: {
        type: String,
        enum: ['admin', 'citizen'],
        default: 'citizen',
    },
    bloodGroup: {
        type: String,
        index: true,
    },
    education: {
        type: String,
        index: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    address: {
        type: String,
    },
    monthlyFee: {
        type: Number,
        default: 0,
    },
    profileImage: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
