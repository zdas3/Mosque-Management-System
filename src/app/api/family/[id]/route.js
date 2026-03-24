import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FamilyMember from '@/models/FamilyMember';
import { verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
    await dbConnect();
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);

    const { id: memberId } = await params;
    const updates = await request.json();

    try {
        // Ensure the family member belongs to the current user, or if they're an admin
        const query = { _id: memberId };
        if (payload.role !== 'admin') {
            query.userId = payload.id;
        }

        const member = await FamilyMember.findOneAndUpdate(query, updates, { new: true });

        if (!member) return NextResponse.json({ message: 'Member not found or forbidden' }, { status: 404 });

        const familyMembers = await FamilyMember.find({ userId: member.userId }).lean();

        return NextResponse.json({ message: 'Updated successfully', familyMembers });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);

    const { id: memberId } = await params;

    try {
        const query = { _id: memberId };
        if (payload.role !== 'admin') {
            query.userId = payload.id;
        }

        const member = await FamilyMember.findOneAndDelete(query);

        if (!member) return NextResponse.json({ message: 'Member not found or forbidden' }, { status: 404 });

        const familyMembers = await FamilyMember.find({ userId: member.userId }).lean();

        return NextResponse.json({ message: 'Member deleted', familyMembers });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
