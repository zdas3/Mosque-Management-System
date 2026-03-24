import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FamilyMember from '@/models/FamilyMember';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);

    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Both Admin and Citizen can add family members. 
    // In current frontend, payload.id is always used, meaning admins editing citizens' 
    // families might actually be adding to admin's own family if they use this route directly without passing citizenId.
    // Let's assume the frontend sends citizenId if admin is editing, else it's payload.id

    try {
        const data = await request.json();

        // If admin is modifying a citizen's family, they must specify the citizenId in the body
        const targetUserId = (payload.role === 'admin' && data.citizenId) ? data.citizenId : payload.id;

        // Validation
        if (!data.name) {
            return NextResponse.json({ message: 'Name is required' }, { status: 400 });
        }

        // Verify target user exists
        const userExists = await User.findById(targetUserId);
        if (!userExists) {
            return NextResponse.json({ message: 'Citizen not found' }, { status: 404 });
        }

        await FamilyMember.create({
            ...data,
            userId: targetUserId
        });

        const familyMembers = await FamilyMember.find({ userId: targetUserId }).lean();

        return NextResponse.json({ message: 'Family member added', familyMembers });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
