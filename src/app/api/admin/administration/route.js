import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Leadership from '@/models/Leadership';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = category ? { category } : {};

    try {
        const leaders = await Leadership.find(query).sort({ order: 1, createdAt: 1 });
        return NextResponse.json(leaders);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching administration details' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const data = await request.json();
        const leader = await Leadership.create(data);
        return NextResponse.json(leader, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating administration detail' }, { status: 500 });
    }
}
