import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import FamilyMember from '@/models/FamilyMember';
import { verifyToken, hashPassword } from '@/lib/auth';

// Helper to check admin role
function getAdminFromRequest(request) {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') return null;
    return payload;
}

export async function POST(request) {
    await dbConnect();

    // 1. Auth Check
    const admin = getAdminFromRequest(request);
    if (!admin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();

        // 2. Check duplicate mobile
        const existing = await User.findOne({ mobile: data.mobile });
        if (existing) {
            return NextResponse.json({ message: 'Mobile number already registered' }, { status: 400 });
        }

        // 3. Auto-generate Membership ID
        const lastUser = await User.findOne({ membershipId: { $regex: /^ICC/ } })
            .sort({ membershipId: -1 })
            .collation({ locale: "en_US", numericOrdering: true });

        let newId = 'ICC001';
        if (lastUser && lastUser.membershipId) {
            const currentId = lastUser.membershipId;
            const numberPart = parseInt(currentId.replace('ICC', ''), 10);
            if (!isNaN(numberPart)) {
                const nextNumber = numberPart + 1;
                newId = `ICC${String(nextNumber).padStart(3, '0')}`;
            }
        }

        // 4. Hash Password
        if (!data.password) {
            return NextResponse.json({ message: 'Password is required' }, { status: 400 });
        }
        const hashedPassword = await hashPassword(data.password);

        // 5. Create User
        const user = await User.create({
            ...data,
            membershipId: newId,
            password: hashedPassword,
            role: 'citizen',
        });

        // The old code returned the new citizen, we'll return user mapped as citizen.
        return NextResponse.json({ message: 'Citizen created successfully', citizen: user }, { status: 201 });

    } catch (error) {
        console.error('Create citizen error:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    await dbConnect();

    // Auth Check - Admin only
    const admin = getAdminFromRequest(request);
    if (!admin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search'); // Search by name or ID or mobile
    const bloodGroup = searchParams.get('bloodGroup');
    const education = searchParams.get('education');

    let matchQuery = { role: 'citizen' };

    if (search) {
        matchQuery.$or = [
            { name: { $regex: search, $options: 'i' } },
            { membershipId: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } },
        ];
    }

    if (bloodGroup) {
        matchQuery.bloodGroup = bloodGroup;
    }
    if (education) {
        matchQuery.education = education;
    }

    try {
        // Find users matching query
        const users = await User.find(matchQuery).sort({ createdAt: -1 }).lean();

        // Fetch family members and attach to each user to preserve old schema shape
        const userIds = users.map(u => u._id);
        const allFamilyMembers = await FamilyMember.find({ userId: { $in: userIds } }).lean();

        const familyMap = {};
        allFamilyMembers.forEach(fm => {
            const uid = fm.userId.toString();
            if (!familyMap[uid]) familyMap[uid] = [];
            familyMap[uid].push(fm);
        });

        const citizensFormat = users.map(user => ({
            ...user,
            familyMembers: familyMap[user._id.toString()] || []
            // Old schema also had `paymentHistory` here, but for list view usually only familyMembers count is needed.
            // If payment history is needed, we could fetch it similarly.
        }));

        return NextResponse.json(citizensFormat);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
