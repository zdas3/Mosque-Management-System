
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
// Dropdown menu removed
// Note: dropdown-menu component needs to be created or we use simple UI for now.
// I'll skip dropdown-menu import if I haven't created it. I haven't.
// I'll implement a simple action button or create the Dropdown component.
// Creating Dropdown component is better. I'll add it to the plan or just use inline buttons.
// Inline buttons are safer for now.

export default function CitizensPage() {
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchCitizens = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            const res = await fetch(`/api/citizens?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setCitizens(data);
            }
        } catch (error) {
            console.error("Failed to fetch citizens", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCitizens();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCitizens();
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Citizens</h1>
                    <p className="text-muted-foreground mt-2">Manage community members and families.</p>
                </div>
                <Link href="/admin/citizens/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                        <Plus size={16} />
                        Add Citizen
                    </Button>
                </Link>
            </div>

            <Card className="glass-card border-none shadow-md">
                <CardHeader>
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search by name, ID, or mobile..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-emerald-600" /></div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Mobile</th>
                                        <th className="p-4">Family Size</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {citizens.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No citizens found.</td></tr>
                                    ) : citizens.map((citizen) => (
                                        <tr key={citizen._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 font-mono font-medium text-emerald-700">{citizen.membershipId}</td>
                                            <td className="p-4 font-medium text-gray-900">{citizen.name}</td>
                                            <td className="p-4 text-gray-500">{citizen.mobile}</td>
                                            <td className="p-4 text-gray-500">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                                                    {(citizen.familyMembers?.length || 0) + 1} Members
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/citizens/${citizen._id}`}>
                                                        <Button variant="ghost" size="sm" className="h-8 text-emerald-600">View</Button>
                                                    </Link>
                                                    <Link href={`/admin/citizens/${citizen._id}/edit`}>
                                                        <Button variant="ghost" size="sm" className="h-8 text-amber-600">Edit</Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
