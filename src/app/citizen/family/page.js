
"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function FamilyPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        relationship: "",
        otherRelationship: "",
        age: "",
        bloodGroup: "",
        education: ""
    });

    const relationOptions = [
        "Father", "Mother", "Brother", "Sister",
        "Son", "Daughter", "Son in law", "Daughter in law",
        "Other"
    ];

    const fetchFamily = async () => {
        try {
            const res = await fetch("/api/profile");
            if (res.ok) {
                const data = await res.json();
                setMembers(data.familyMembers || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFamily();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();

        const payload = { ...formData };
        if (payload.relationship === "Other") {
            payload.relationship = payload.otherRelationship;
        }
        delete payload.otherRelationship;

        try {
            const res = await fetch("/api/family", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setFormData({
                    name: "", gender: "", relationship: "", otherRelationship: "",
                    age: "", bloodGroup: "", education: ""
                });
                setShowAddForm(false);
                fetchFamily();
            }
        } catch (e) {
            alert("Failed to add member");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/family/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchFamily();
            } else {
                alert("Failed to delete");
            }
        } catch (e) {
            alert("Failed to delete");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">Family Members</h1>
                    <p className="text-muted-foreground">Manage your family details.</p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-emerald-600 gap-2">
                    {showAddForm ? "Cancel" : <><Plus size={16} /> Add Member</>}
                </Button>
            </div>

            {showAddForm && (
                <Card className="glass-card shadow-md animate-in slide-in-from-top-4 fade-in">
                    <CardHeader>
                        <CardTitle>Add New Member</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />

                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>

                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.relationship}
                                    onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select Relation</option>
                                    {relationOptions.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>

                                {formData.relationship === "Other" && (
                                    <Input
                                        placeholder="Specify Relation"
                                        value={formData.otherRelationship}
                                        onChange={e => setFormData({ ...formData, otherRelationship: e.target.value })}
                                        required
                                    />
                                )}

                                <Input
                                    placeholder="Age"
                                    type="number"
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                />
                                <Input
                                    placeholder="Blood Group"
                                    value={formData.bloodGroup}
                                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                                />
                                <Input
                                    placeholder="Education / Occupation"
                                    value={formData.education}
                                    onChange={e => setFormData({ ...formData, education: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit">Save Member</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                {members.map((member) => (
                    <Card key={member._id} className="glass-card hover:shadow-lg transition-all group">
                        <CardContent className="p-6 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                                    {member.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                                    <p className="text-sm text-muted-foreground">{member.relationship} • {member.gender} • {member.age} yrs</p>
                                    {member.bloodGroup && (
                                        <span className="inline-block mt-2 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">
                                            {member.bloodGroup}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(member._id)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
