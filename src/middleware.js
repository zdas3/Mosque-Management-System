
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// We use 'jose' here because 'jsonwebtoken' is not compatible with Edge Runtime (Middleware)
// Make sure to install 'jose' if not already (or use edge-compatible JWT lib)
// Alternatively, if nodejs runtime is forced, jsonwebtoken can be used, but middleware runs on edge by default.
// Let's stick to standard practice: use jose for middleware.

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secure-secret-key-change-this');

export async function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Paths that require authentication
    const protectedPaths = ['/admin', '/citizen'];
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    // Public paths (login)
    if (pathname === '/login') {
        if (token) {
            try {
                const { payload } = await jwtVerify(token, JWT_SECRET);
                if (payload.role === 'admin') {
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
                } else if (payload.role === 'citizen') {
                    return NextResponse.redirect(new URL('/citizen/dashboard', request.url));
                }
            } catch (error) {
                // Token invalid, allow access to login
            }
        }
        return NextResponse.next();
    }

    if (isProtected) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);

            // Admin route protection
            if (pathname.startsWith('/admin') && payload.role !== 'admin') {
                return NextResponse.redirect(new URL('/citizen/dashboard', request.url)); // Redirect to their dashboard
            }

            // Citizen route protection
            if (pathname.startsWith('/citizen') && payload.role !== 'citizen') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url)); // Redirect to their dashboard
            }

            // Allow access
            return NextResponse.next();

        } catch (error) {
            // Token invalid
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/citizen/:path*', '/login'],
};
