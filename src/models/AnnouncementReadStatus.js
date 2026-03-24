import mongoose from 'mongoose';

const AnnouncementReadStatusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    announcementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Announcement',
        required: true,
    },
    readAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Ensure a user can only read an announcement once
AnnouncementReadStatusSchema.index({ userId: 1, announcementId: 1 }, { unique: true });

export default mongoose.models.AnnouncementReadStatus || mongoose.model('AnnouncementReadStatus', AnnouncementReadStatusSchema);
