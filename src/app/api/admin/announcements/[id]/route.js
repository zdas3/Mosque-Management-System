import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Announcement from '@/models/Announcement';
import { verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
    await dbConnect();
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    try {
        const data = await request.json();
        const announcement = await Announcement.findByIdAndUpdate(id, data, { new: true });
        if (!announcement) return NextResponse.json({ message: 'Not found' }, { status: 404 });
        return NextResponse.json(announcement);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    try {
        const announcement = await Announcement.findByIdAndDelete(id);
        if (!announcement) return NextResponse.json({ message: 'Not found' }, { status: 404 });

        // Note: Can also delete associated AnnouncementReadStatus records here 
        // using the id to keep the DB clean.
        const AnnouncementReadStatus = require('@/models/AnnouncementReadStatus').default;
        await AnnouncementReadStatus.deleteMany({ announcementId: id });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
