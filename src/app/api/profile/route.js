import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import FamilyMember from '@/models/FamilyMember';
import Payment from '@/models/Payment';
import { verifyToken, hashPassword } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const user = await User.findById(payload.id).select('-password').lean();
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const familyMembers = await FamilyMember.find({ userId: payload.id }).lean();
        const paymentHistory = await Payment.find({ userId: payload.id }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            ...user,
            familyMembers,
            paymentHistory
        });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const data = await request.json();

        // Restrict what fields can be updated by Citizen
        const allowedUpdates = {};
        if (data.name) allowedUpdates.name = data.name;
        if (data.address) allowedUpdates.address = data.address;
        if (data.profileImage) allowedUpdates.profileImage = data.profileImage;
        if (data.mobile) {
            const existing = await User.findOne({ mobile: data.mobile, _id: { $ne: payload.id } });
            if (existing) {
                return NextResponse.json({ message: 'Mobile number already taken' }, { status: 400 });
            }
            allowedUpdates.mobile = data.mobile;
        }
        if (data.password) {
            allowedUpdates.password = await hashPassword(data.password);
        }

        const user = await User.findByIdAndUpdate(payload.id, allowedUpdates, { new: true }).select('-password').lean();

        const familyMembers = await FamilyMember.find({ userId: payload.id }).lean();
        const paymentHistory = await Payment.find({ userId: payload.id }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            ...user,
            familyMembers,
            paymentHistory
        });

    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
