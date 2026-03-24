import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id: userId } = await params;
    const { paymentId, status, month, year } = await request.json();

    try {
        if (paymentId) {
            // Update specific payment
            await Payment.findByIdAndUpdate(paymentId, {
                status,
                updatedBy: payload.name || 'Admin',
                paymentDate: status === 'Paid' ? new Date() : null
            });

        } else if (month && year) {
            // Update payment by month/year
            const result = await Payment.findOneAndUpdate(
                { userId, month, year: parseInt(year), type: 'Fee' },
                {
                    status,
                    updatedBy: payload.name || 'Admin',
                    paymentDate: status === 'Paid' ? new Date() : null
                }
            );

            if (!result) {
                return NextResponse.json({ message: 'Payment record not found for this month' }, { status: 404 });
            }
        } else {
            return NextResponse.json({ message: 'Validation Error' }, { status: 400 });
        }

        // Return the updated citizen profile for frontend consistency
        const user = await User.findById(userId).lean();
        const paymentHistory = await Payment.find({ userId }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            ...user,
            paymentHistory
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
