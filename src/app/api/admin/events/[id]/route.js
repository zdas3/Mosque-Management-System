import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        const data = await request.json();
        const ev = await Event.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(ev);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating event' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        await Event.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Event deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting event' }, { status: 500 });
    }
}
