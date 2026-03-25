import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Initialize Cloudinary connection using env secrets
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    const token = request.cookies.get('token')?.value;
    const payload = verifyToken(token);

    // Allow citizens to upload profile pictures, so we check existence only
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

        // Validate basic file payload types
        const isPdf = file.name.endsWith('.pdf');
        if (folder === 'reports' && !isPdf && !file.type.startsWith('image/')) {
            return NextResponse.json({ message: "Reports must be PDF or image" }, { status: 400 });
        } else if (folder !== 'reports' && !file.type.startsWith('image/')) {
            return NextResponse.json({ message: "Only images are allowed for this folder" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload directly from memory stream to Cloudinary API securely
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: `icc/${folder}` },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // Use the universally accessible secure_url natively generated
        const url = uploadResult.secure_url;

        return NextResponse.json({ url });

    } catch (error) {
        console.error("Cloudinary upload error", error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
