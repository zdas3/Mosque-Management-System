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
        const startYear = 2024;
        const currentYear = new Date().getFullYear();
        const currentMonthIndex = new Date().getMonth(); // 0-11

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Fetch all citizens
        const users = await User.find({ role: 'citizen' }).lean();

        // Fetch all existing fee payments
        const allPayments = await Payment.find({ type: 'Fee' }).lean();

        // Create a fast lookup Set: "userId-month-year"
        const existingMap = new Set(allPayments.map(p => `${p.userId.toString()}-${p.month}-${p.year}`));

        const newPayments = [];

        // Iterate through years and months
        for (let year = startYear; year <= currentYear; year++) {
            const endMonth = (year === currentYear) ? currentMonthIndex : 11;

            for (let i = 0; i <= endMonth; i++) {
                const month = months[i];

                for (const user of users) {
                    const key = `${user._id.toString()}-${month}-${year}`;
                    if (!existingMap.has(key)) {
                        newPayments.push({
                            userId: user._id,
                            type: 'Fee',
                            month: month,
                            year: year,
                            amount: user.monthlyFee || 0,
                            status: 'Unpaid',
                            updatedBy: 'System Backfill',
                        });
                    }
                }
            }
        }

        if (newPayments.length > 0) {
            await Payment.insertMany(newPayments);
        }

        return NextResponse.json({
            message: 'Backfill completed successfully',
            totalModified: newPayments.length
        });

    } catch (error) {
        console.error("Backfill error", error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
