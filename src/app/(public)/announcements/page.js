import dbConnect from '@/lib/db';
import Announcement from '@/models/Announcement';

export const revalidate = 60; // Revalidate every minute

export const metadata = {
    title: 'Announcements | Izzathul Islam ICC',
    description: 'Latest news and announcements from Izzathul Islam Islamic Cultural Center',
};

export default async function PublicAnnouncementsPage() {
    await dbConnect();
    const now = new Date();

    // Fetch non-expired announcements
    const announcements = await Announcement.find({
        $or: [
            { expiresAt: { $gt: now } },
            { expiresAt: null }
        ]
    }).sort({ createdAt: -1 }).lean();

    return (
        <div className="py-24 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-outfit">Announcements</h1>
                    <p className="text-lg text-gray-600">Stay updated with the latest news, events, and community updates.</p>
                </div>

                {announcements.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p>No active announcements at this time.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {announcements.map((item) => (
                            <div key={item._id.toString()} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row hover:shadow-md transition-shadow">
                                {item.image && (
                                    <div className="md:w-1/3 flex-shrink-0">
                                        <img src={item.image} alt={item.title} className="w-full h-64 md:h-full object-cover" />
                                    </div>
                                )}
                                <div className={`p-8 flex flex-col justify-center ${item.image ? 'md:w-2/3' : 'w-full'}`}>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">{item.title}</h2>
                                    <p className="text-gray-600 mb-6 whitespace-pre-line leading-relaxed">{item.description}</p>
                                    <div className="text-sm border-t border-gray-100 pt-4 flex justify-between items-center text-gray-400">
                                        <span>Posted: {new Date(item.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
