"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Megaphone, Upload, X } from "lucide-react";
import Image from "next/image";

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        expiresAt: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch("/api/admin/announcements");
            if (res.ok) {
                const data = await res.json();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let imageUrl = formData.image;

            // Upload image if a new file is selected
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('file', imageFile);
                uploadData.append('folder', 'announcements');

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    imageUrl = data.url;
                } else {
                    alert('Image upload failed.');
                    setIsSubmitting(false);
                    return;
                }
            }

            const url = editingId ? `/api/admin/announcements/${editingId}` : "/api/admin/announcements";
            const method = editingId ? "PUT" : "POST";

            const payload = { ...formData, image: imageUrl };
            if (!payload.expiresAt) delete payload.expiresAt;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({ title: "", description: "", image: "", expiresAt: "" });
                setImageFile(null);
                setEditingId(null);
                fetchAnnouncements();
            } else {
                alert("Failed to save announcement");
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        try {
            const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchAnnouncements();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (announcement) => {
        setFormData({
            title: announcement.title,
            description: announcement.description,
            image: announcement.image || "",
            expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().split('T')[0] : ""
        });
        setImageFile(null);
        setEditingId(announcement._id);
        setShowForm(true);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 font-outfit">Announcements</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) {
                            setFormData({ title: "", description: "", image: "", expiresAt: "" });
                            setImageFile(null);
                            setEditingId(null);
                        }
                    }}
                    className="flex items-center gap-2 bg-[#065f46] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#007049] transition-colors"
                >
                    {showForm ? "Cancel" : <><Plus size={16} /> New Announcement</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                    <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Announcement' : 'Create New Announcement'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border outline-none focus:ring-2 focus:ring-[#065f46]"
                                placeholder="E.g., Special Jumu'ah Guest Speaker"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border outline-none focus:ring-2 focus:ring-[#065f46]"
                                placeholder="Detailed description of the announcement..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (Optional)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#065f46] transition-colors relative">
                                    <div className="space-y-1 text-center">
                                        {(imageFile || formData.image) ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-full h-32 relative rounded-md overflow-hidden bg-gray-100">
                                                    <img
                                                        src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                                                        alt="Preview"
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImageFile(null);
                                                        setFormData(prev => ({ ...prev, image: "" }));
                                                    }}
                                                    className="text-xs text-red-600 flex items-center gap-1 hover:text-red-700"
                                                >
                                                    <X size={12} /> Remove Image
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#065f46] hover:text-[#007049] focus-within:outline-none">
                                                        <span>Upload a file</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expires At (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.expiresAt}
                                    onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                                    className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border outline-none focus:ring-2 focus:ring-[#065f46]"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#065f46] text-white py-3 rounded-xl font-bold hover:bg-[#007049] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save Announcement"}
                        </button>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : announcements.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                    <Megaphone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No announcements</h3>
                    <p className="mt-1 text-gray-500">Get started by creating a new announcement.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {announcements.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
                            {item.image && (
                                <div className="relative w-full h-48">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                                </div>
                            )}
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{item.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.description}</p>

                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                    {item.expiresAt && (
                                        <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                            Expires: {new Date(item.expiresAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action overlay */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 bg-white rounded-full shadow-lg text-blue-600 hover:text-blue-800"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="p-2 bg-white rounded-full shadow-lg text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
