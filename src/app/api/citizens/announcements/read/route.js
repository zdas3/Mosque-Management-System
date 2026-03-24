import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AnnouncementReadStatus from '@/models/AnnouncementReadStatus';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
    await dbConnect();
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { announcementId } = await request.json();

        if (!announcementId) {
            return NextResponse.json({ message: 'Announcement ID is required' }, { status: 400 });
        }

        // Use updateOne with upsert to prevent unique constraint errors if requested twice
        await AnnouncementReadStatus.updateOne(
            { userId: payload.id, announcementId },
            { $setOnInsert: { userId: payload.id, announcementId, readAt: new Date() } },
            { upsert: true }
        );

        return NextResponse.json({ message: 'Marked as read' });
    } catch (error) {
        console.error("Mark read error:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
