import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Income from '@/models/Income';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();
    const token = request.cookies.get('token')?.value;
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const income = await Income.find({}).populate('eventId', 'title').sort({ date: -1 });
        return NextResponse.json(income);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching income' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const token = request.cookies.get('token')?.value;
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const data = await request.json();
        const income = await Income.create(data);
        return NextResponse.json(income, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating income' }, { status: 500 });
    }
}
