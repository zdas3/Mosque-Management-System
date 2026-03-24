import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);

    // Both citizen and admin might need this. Let's allow if valid token.
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const events = await Event.find({}).sort({ date: -1 });
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching events' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const data = await request.json();
        const ev = await Event.create(data);
        return NextResponse.json(ev, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating event' }, { status: 500 });
    }
}
