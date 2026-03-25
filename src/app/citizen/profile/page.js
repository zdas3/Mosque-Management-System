
"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        mobile: "", // Read only or editable? Requirement says "Update personal details"
        profileImage: ""
    });
    const [membershipId, setMembershipId] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/api/profile");
                if (res.ok) {
                    const data = await res.json();
                    setMembershipId(data.membershipId);
                    setFormData({
                        name: data.name || "",
                        address: data.address || "",
                        mobile: data.mobile || "",
                        profileImage: data.profileImage || ""
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert("Profile updated!");
            } else {
                const d = await res.json();
                alert(d.message || "Failed");
            }
        } catch (e) {
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">My Profile</h1>
                <p className="text-muted-foreground">Manage your personal information.</p>
            </div>

            <Card className="glass-card border-none shadow-lg">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="relative h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-3xl font-bold border-4 border-white shadow-sm">
                                {formData.profileImage ? (
                                    <Image src={formData.profileImage} alt="Profile" fill className="rounded-full object-cover" sizes="(max-width: 768px) 96px, 96px" />
                                ) : (
                                    formData.name?.[0]
                                )}
                                <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-md">
                                    <Camera size={14} />
                                </button>
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-bold">{formData.name}</h2>
                                <p className="text-sm font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1 border border-emerald-100">{membershipId}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Gender</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.gender || ""}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Head of Family Address</label>
                                <Input
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mobile Number</label>
                                <Input
                                    value={formData.mobile}
                                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">Used for login.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Profile Image URL</label>
                                <Input
                                    value={formData.profileImage}
                                    onChange={e => setFormData({ ...formData, profileImage: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={saving} className="min-w-[120px]">
                                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
