import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Expense from '@/models/Expense';
import { verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        const data = await request.json();
        const expense = await Expense.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(expense);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating expense' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        await Expense.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Expense deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting expense' }, { status: 500 });
    }
}
