
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(request) {
    await dbConnect();

    try {
        const { identifier, password, role } = await request.json();

        if (!identifier || !password || !role) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        let user;

        if (role === 'admin') {
            // Admin usually logs in with a specific admin ID or maybe mobile. 
            // In seed, we used membershipId: 'ADMIN'.
            // Let's allow login by mobile for admin too as it's unique.
            user = await User.findOne({ mobile: identifier, role: 'admin' });
            if (!user) user = await User.findOne({ membershipId: identifier, role: 'admin' });
        } else {
            // For User: "membership ID or mobile number"
            user = await User.findOne({
                $or: [{ membershipId: identifier }, { mobile: identifier }],
                role: 'citizen',
            });
        }

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate Token
        const payload = {
            id: user._id,
            role: user.role,
            membershipId: user.membershipId, // Undefined for pure admin if schema differs, but here it's same schema
            name: user.name,
        };

        const token = signToken(payload);

        const response = NextResponse.json(
            { message: 'Login successful', user: { name: user.name, role: user.role } },
            { status: 200 }
        );

        // Set Cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
