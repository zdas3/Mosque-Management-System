import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Leadership from '@/models/Leadership';
import { verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        const data = await request.json();
        const leader = await Leadership.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(leader);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating administration detail' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        await Leadership.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting' }, { status: 500 });
    }
}
