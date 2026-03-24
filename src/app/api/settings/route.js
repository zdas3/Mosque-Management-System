import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();

    // Optional: Protect with token, but generally QRs might be safe to expose
    const token = request.cookies.get('token')?.value;
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const settings = await Setting.find({}).lean();
        // Convert array of objects to key-value map
        const settingsMap = settings.reduce((acc, current) => {
            acc[current.key] = current.value;
            return acc;
        }, {});
        return NextResponse.json(settingsMap);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
