import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function GET() {
    await dbConnect();

    try {
        // Check if admin exists
        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            return NextResponse.json({ message: 'Admin already exists' });
        }

        const hashedPassword = await hashPassword('admin123'); // Default password

        const admin = await User.create({
            membershipId: 'ADMIN',
            name: 'Super Admin',
            mobile: '0000000000',
            password: hashedPassword,
            role: 'admin',
        });

        return NextResponse.json({ message: 'Admin created successfully', admin });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
