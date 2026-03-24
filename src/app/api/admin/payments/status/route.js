
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
        return NextResponse.json({ message: 'Month and Year required' }, { status: 400 });
    }

    try {
        // Fetch all users (citizens)
        const users = await User.find({ role: 'citizen' })
            .select('name mobile membershipId monthlyFee')
            .lean();

        // Fetch payments for the specific month/year
        const payments = await Payment.find({
            month: month,
            year: parseInt(year),
            type: 'Fee'
        }).lean();

        // Map payments to user ID
        const paymentMap = {};
        payments.forEach(p => {
            paymentMap[p.userId.toString()] = p;
        });

        // Map to a simpler structure
        const result = users.map(user => {
            const payment = paymentMap[user._id.toString()];
            return {
                _id: user._id,
                membershipId: user.membershipId,
                name: user.name,
                mobile: user.mobile,
                monthlyFee: user.monthlyFee,
                status: payment ? payment.status : 'Not Generated',
                amount: payment ? payment.amount : null,
                paymentId: payment ? payment._id : null
            };
        });

        // Sort: Unpaid first, then by Name
        result.sort((a, b) => {
            if (a.status === 'Unpaid' && b.status !== 'Unpaid') return -1;
            if (a.status !== 'Unpaid' && b.status === 'Unpaid') return 1;
            return a.name.localeCompare(b.name);
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
