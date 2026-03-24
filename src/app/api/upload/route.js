import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';
import fs from 'fs';

export async function POST(request) {
    const token = request.cookies.get('token')?.value;
    const payload = verifyToken(token);

    // Allow citizens to upload profile pictures, so we just check if payload exists.
    if (!payload) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.formData();
        const file = data.get('file');
        const folder = data.get('folder') || 'general'; // 'qr', 'announcements', 'reports', 'profile'

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        const allowedFolders = ['qr', 'announcements', 'reports', 'profile', 'general'];
        if (!allowedFolders.includes(folder)) {
            return NextResponse.json({ message: "Invalid upload directory" }, { status: 400 });
        }

        // Validate basic file types
        const isPdf = file.name.endsWith('.pdf');
        if (folder === 'reports' && !isPdf && !file.type.startsWith('image/')) {
            return NextResponse.json({ message: "Reports must be PDF or image" }, { status: 400 });
        } else if (folder !== 'reports' && !file.type.startsWith('image/')) {
            return NextResponse.json({ message: "Only images are allowed for this folder" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename and add timestamp
        const ext = file.name.split('.').pop();
        const baseName = file.name.replace(`.${ext}`, '').replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${Date.now()}-${baseName}.${ext}`;

        const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
        const filepath = join(uploadDir, filename);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        await writeFile(filepath, buffer);

        const url = `/uploads/${folder}/${filename}`;

        return NextResponse.json({ url });

    } catch (error) {
        console.error("Upload error", error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
