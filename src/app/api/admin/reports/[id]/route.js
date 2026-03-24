import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import { verifyToken } from '@/lib/auth';

export async function DELETE(request, { params }) {
    await dbConnect();
    const payload = verifyToken(request.cookies.get('token')?.value);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        await Report.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Report deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting report' }, { status: 500 });
    }
}
