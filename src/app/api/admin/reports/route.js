import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const reports = await Report.find({}).sort({ year: -1, month: -1, createdAt: -1 });
        return NextResponse.json(reports);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching reports' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const data = await request.json();
        const report = await Report.create(data);
        return NextResponse.json(report, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating report' }, { status: 500 });
    }
}
