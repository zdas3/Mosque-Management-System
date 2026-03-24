import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Expense from '@/models/Expense';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const expense = await Expense.find({}).populate('eventId', 'title').sort({ date: -1 });
        return NextResponse.json(expense);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching expenses' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const data = await request.json();
        const expense = await Expense.create(data);
        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating expense' }, { status: 500 });
    }
}
