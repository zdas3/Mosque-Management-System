import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Income from '@/models/Income';
import { verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        const data = await request.json();
        const income = await Income.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(income);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating income' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        await Income.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Income deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting income' }, { status: 500 });
    }
}
