import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import FamilyMember from '@/models/FamilyMember';
import Payment from '@/models/Payment';
import { verifyToken, hashPassword } from '@/lib/auth';

function getAdminFromRequest(request) {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') return null;
    return payload;
}

export async function GET(request, { params }) {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);

    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    // Access Control
    if (payload.role !== 'admin' && payload.id !== id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const user = await User.findById(id).lean();
        if (!user) {
            return NextResponse.json({ message: 'Citizen not found' }, { status: 404 });
        }

        const familyMembers = await FamilyMember.find({ userId: id }).lean();
        const paymentHistory = await Payment.find({ userId: id }).sort({ createdAt: -1 }).lean();

        // Reconstruct old schema shape for compatibility
        const citizenFormat = {
            ...user,
            familyMembers,
            paymentHistory
        };

        return NextResponse.json(citizenFormat);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    const admin = getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const data = await request.json();

    try {
        // If updating password
        if (data.password) {
            data.password = await hashPassword(data.password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        if (!user) {
            return NextResponse.json({ message: 'Citizen not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Citizen updated successfully', user });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const admin = getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
        await User.findByIdAndDelete(id);
        await FamilyMember.deleteMany({ userId: id });
        await Payment.deleteMany({ userId: id });

        return NextResponse.json({ message: 'Citizen and associated data deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
