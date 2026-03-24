
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

import { use } from "react";

export default function EditCitizenPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        password: "", // Only if changing
        address: "",
        monthlyFee: "",
    });

    useEffect(() => {
        async function fetchCitizen() {
            try {
                const res = await fetch(`/api/citizens/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name,
                        mobile: data.mobile,
                        address: data.address || "",
                        monthlyFee: data.monthlyFee || "",
                        password: "", // Don't show hash
                    });
                } else {
                    alert("Citizen not found");
                    router.push("/admin/citizens");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCitizen();
    }, [id, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Remove empty password if not set
        const payload = { ...formData };
        if (!payload.password) delete payload.password;

        try {
            const res = await fetch(`/api/citizens/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update");

            router.push(`/admin/citizens/${id}`);
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this citizen? This action cannot be undone and will delete all family members and payment history.")) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/citizens/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                router.push("/admin/citizens");
            } else {
                alert("Failed to delete");
            }
        } catch (e) {
            alert("Error deleting");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href={`/admin/citizens/${id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">Edit Citizen</h1>
                    <p className="text-muted-foreground">Update details or reset password.</p>
                </div>
            </div>

            <Card className="glass-card shadow-lg border-none">
                <CardHeader>
                    <CardTitle>Edit Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gender</label>
                            <select
                                name="gender"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.gender || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mobile Number</label>
                            <Input
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Reset Password</label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Enter new password to reset"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-muted-foreground">Leave blank to keep current password.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Monthly Fee Amount (₹)</label>
                            <Input
                                name="monthlyFee"
                                type="number"
                                value={formData.monthlyFee}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="pt-6 flex justify-between items-center">
                            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting || saving}>
                                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                Delete Citizen
                            </Button>

                            <Button type="submit" disabled={saving || deleting} className="bg-emerald-600 hover:bg-emerald-700 min-w-[120px]">
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
