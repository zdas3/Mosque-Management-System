"use client";

import { useState, useEffect } from "react";
import { Megaphone, CheckCircle2, Circle } from "lucide-react";

export default function CitizenAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch("/api/citizens/announcements");
            if (res.ok) {
                const data = await res.json();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error("Fetch announcements error", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const markAsRead = async (id) => {
        try {
            const res = await fetch("/api/citizens/announcements/read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ announcementId: id })
            });

            if (res.ok) {
                setAnnouncements(prev => prev.map(a => a._id === id ? { ...a, isRead: true } : a));
            }
        } catch (error) {
            console.error("Mark read error", error);
        }
    };

    if (isLoading) {
        return <div className="text-center py-12 text-gray-500">Loading announcements...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 font-outfit mb-8">Announcements</h1>

            {announcements.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                    <Megaphone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No new announcements</h3>
                    <p className="mt-1 text-gray-500">Check back later for updates from the administration.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((item) => (
                        <div
                            key={item._id}
                            className={`bg-white rounded-2xl border ${item.isRead ? 'border-gray-100 opacity-75' : 'border-amber-200 shadow-md ring-1 ring-amber-50'} overflow-hidden transition-all`}
                        >
                            <div className="flex flex-col md:flex-row">
                                {item.image && (
                                    <div className="md:w-1/3">
                                        <img src={item.image} alt={item.title} className="w-full h-48 md:h-full object-cover" />
                                    </div>
                                )}
                                <div className={`p-6 flex-1 flex flex-col ${item.image ? '' : 'w-full'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-xl text-gray-900 font-outfit">{item.title}</h3>
                                        {!item.isRead && (
                                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mb-6 flex-grow whitespace-pre-line">{item.description}</p>

                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                                        <span className="text-xs text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>

                                        {!item.isRead ? (
                                            <button
                                                onClick={() => markAsRead(item._id)}
                                                className="flex items-center gap-2 text-sm font-medium text-[#008f5d] hover:text-[#007049] transition-colors bg-emerald-50 px-4 py-2 rounded-full"
                                            >
                                                <Circle size={16} /> Acknowledge
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-1 text-sm text-gray-400">
                                                <CheckCircle2 size={16} /> Read
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
