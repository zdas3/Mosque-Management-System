import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
    await dbConnect();
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const data = await request.json(); // Expect { settings: [{key: '...', value: '...'}] }

        if (!Array.isArray(data.settings)) {
            return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
        }

        // Use bulkWrite for efficient upserts
        const ops = data.settings.map(s => ({
            updateOne: {
                filter: { key: s.key },
                update: { $set: { value: s.value } },
                upsert: true
            }
        }));

        await Setting.bulkWrite(ops);

        return NextResponse.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error("Settings Update Error:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
