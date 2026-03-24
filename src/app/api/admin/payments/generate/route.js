import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { month, year } = await request.json();

        if (!month || !year) {
            return NextResponse.json({ message: 'Month and Year are required' }, { status: 400 });
        }

        // Fetch all citizens
        const users = await User.find({ role: 'citizen' }).lean();

        // Fetch existing fees for this month/year
        const existingPayments = await Payment.find({
            month: month,
            year: parseInt(year),
            type: 'Fee'
        }).lean();

        // Create a set of userIds who already have a payment generated
        const existingUserIds = new Set(existingPayments.map(p => p.userId.toString()));

        // Filter users who do not have a payment for this month yet
        const usersToGenerate = users.filter(u => !existingUserIds.has(u._id.toString()));

        if (usersToGenerate.length === 0) {
            return NextResponse.json({
                message: 'No new payments to generate. All citizens already have entries.',
                modifiedCount: 0
            });
        }

        const newPayments = usersToGenerate.map(user => ({
            userId: user._id,
            type: 'Fee',
            month: month,
            year: parseInt(year),
            amount: user.monthlyFee || 0,
            status: 'Unpaid',
            updatedBy: payload.name || 'Admin',
        }));

        const result = await Payment.insertMany(newPayments);

        return NextResponse.json({
            message: 'Month generated successfully',
            modifiedCount: result.length
        });

    } catch (error) {
        console.error("Bulk payment generate error", error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
