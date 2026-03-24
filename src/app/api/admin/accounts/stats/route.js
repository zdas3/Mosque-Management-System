import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Income from '@/models/Income';
import Expense from '@/models/Expense';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);

    // Allowed for both Admin and Citizen dashboards
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId'); // Optional filter by event

        let matchQuery = {};
        if (eventId && eventId !== 'all') {
            matchQuery.eventId = eventId;
        }

        const [incomeTotal, expenseTotal] = await Promise.all([
            Income.aggregate([
                { $match: matchQuery },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Expense.aggregate([
                { $match: matchQuery },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        const totalIncome = incomeTotal[0]?.total || 0;
        const totalExpense = expenseTotal[0]?.total || 0;
        const surplus = totalIncome - totalExpense;

        return NextResponse.json({
            totalIncome,
            totalExpense,
            surplus
        });
    } catch (error) {
        console.error("Stats Error:", error);
        return NextResponse.json({ message: 'Error calculating stats' }, { status: 500 });
    }
}
