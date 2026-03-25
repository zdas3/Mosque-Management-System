"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Loader2, Edit2, Trash2, Shield, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AdministrationPage() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "Leadership",
        role: "",
        contact: "",
        order: 0,
        image: ""
    });

    const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fetchLeaders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/administration");
            if (res.ok) setLeaders(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaders();
    }, []);

    const resetForm = () => {
        setFormData({ name: "", category: "Leadership", role: "", contact: "", order: 0, image: "" });
        setImageFile(null);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (leader) => {
        setFormData({
            name: leader.name,
            category: leader.category || "Leadership",
            role: leader.role,
            contact: leader.contact || "",
            order: leader.order || 0,
            image: leader.image || ""
        });
        setEditingId(leader._id);
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this member?")) return;
        try {
            await fetch(`/api/admin/administration/${id}`, { method: "DELETE" });
            fetchLeaders();
        } catch (e) {
            alert("Failed to delete.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let imageUrl = formData.image;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('file', imageFile);
                uploadData.append('folder', 'profiles'); // save in profiles folder

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    imageUrl = data.url;
                } else {
                    throw new Error("Failed to upload image.");
                }
            }

            const payload = { ...formData, image: imageUrl };
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/admin/administration/${editingId}` : "/api/admin/administration";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                resetForm();
                fetchLeaders();
            } else {
                alert("Failed to save.");
            }
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit flex items-center gap-2">
                        <Shield className="text-[#065f46] h-8 w-8" />
                        Administration Details
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage mosque leadership and committee members</p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} className="bg-[#065f46] hover:bg-[#007049] gap-2">
                        <PlusCircle size={16} /> Add Member
                    </Button>
                )}
            </div>

            {showForm && (
                <Card className="glass-card shadow-sm border border-[#065f46]/20">
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit Member" : "Add New Member"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Category</label>
                                        <select 
                                            required 
                                            value={formData.category} 
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="Leadership">Leadership</option>
                                            <option value="Committee Member">Committee Member</option>
                                            <option value="Education Staff">Education Staff (Teachers)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Full Name</label>
                                        <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Abdul Rahman" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Designation / Role</label>
                                        <Input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. President, Imam" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Mobile Number (Optional)</label>
                                        <Input value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} placeholder="e.g. +91 9876543210" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Display Order</label>
                                        <Input type="number" required value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} placeholder="e.g. 1 (Higher shows first usually, but check query)" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-medium mb-1 block">Photo (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#065f46] transition-colors relative bg-gray-50/50">
                                        {(imageFile || formData.image) ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                                                    alt="Preview"
                                                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md mx-auto"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => { setImageFile(null); setFormData({ ...formData, image: "" }); }}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="py-4">
                                                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                                                <label className="cursor-pointer text-sm font-medium text-[#065f46] hover:text-[#007049]">
                                                    <span>Upload a photo</span>
                                                    <input type="file" className="sr-only" accept="image/*" onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setImageFile(e.target.files[0]);
                                                        }
                                                    }} />
                                                </label>
                                                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB. Square image recommended.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={submitting} className="bg-[#065f46] hover:bg-[#007049]">
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Member"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#065f46] mb-4" />
                    Loading administration...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leaders.map(leader => (
                        <Card key={leader._id} className="overflow-hidden hover:shadow-md transition-shadow group relative border-gray-200">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border">
                                <button onClick={() => handleEdit(leader)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDelete(leader._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <CardContent className="p-6 text-center">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center">
                                    {leader.image ? (
                                        <div className="relative w-full h-full">
                                            <Image src={leader.image} alt={leader.name} fill className="object-cover" sizes="(max-width: 768px) 96px, 96px" />
                                        </div>
                                    ) : (
                                        <Shield className="h-10 w-10 text-gray-300" />
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 font-outfit">{leader.name}</h3>
                                <div className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold mt-1 mb-2">
                                    {leader.role}
                                </div>
                                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                                    {leader.category || 'Leadership'}
                                </div>
                                {leader.contact && (
                                    <p className="text-sm text-gray-500 break-words">{leader.contact}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    {leaders.length === 0 && !showForm && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 border border-dashed rounded-xl">
                            No administration members added yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
