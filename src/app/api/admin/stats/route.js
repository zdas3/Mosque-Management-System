
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import FamilyMember from '@/models/FamilyMember';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        // Total Families = Total Users (Role: citizen)
        const totalFamilies = await User.countDocuments({ role: 'citizen' });

        // Total Dependents = Total FamilyMembers
        const totalDependents = await FamilyMember.countDocuments();

        const totalMembers = totalFamilies + totalDependents;

        return NextResponse.json({
            totalFamilies,
            totalMembers,
        });
    } catch (error) {
        console.error("Stats Error", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
