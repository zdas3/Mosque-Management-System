import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Announcement from '@/models/Announcement';
import AnnouncementReadStatus from '@/models/AnnouncementReadStatus';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Both citizen and admin can view announcements
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        // Find announcements that haven't expired
        const now = new Date();
        const activeAnnouncements = await Announcement.find({
            $or: [
                { expiresAt: { $gt: now } },
                { expiresAt: null }
            ]
        }).sort({ createdAt: -1 }).lean();

        // Get read statuses for the current user
        const readStatuses = await AnnouncementReadStatus.find({
            userId: payload.id,
            announcementId: { $in: activeAnnouncements.map(a => a._id) }
        }).lean();

        const readSet = new Set(readStatuses.map(rs => rs.announcementId.toString()));

        const results = activeAnnouncements.map(announcement => ({
            ...announcement,
            isRead: readSet.has(announcement._id.toString())
        }));

        return NextResponse.json(results);
    } catch (error) {
        console.error("Fetch announcements error:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
