
"use client";

import { useEffect, useState } from "react";
import { User, Users, CreditCard, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CitizenDashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/api/profile");
                if (res.ok) {
                    setProfile(await res.json());
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">Failed to load profile</div>;

    const unpaidMonths = profile.paymentHistory?.filter(p => p.status === 'Unpaid').length || 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent font-outfit">
                    Welcome, {profile.name}
                </h1>
                <p className="text-muted-foreground mt-2">Manage your family and view community updates.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Profile Summary */}
                <Card className="glass-card shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Profile</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono text-emerald-700">{profile.membershipId}</div>
                        <p className="text-xs text-muted-foreground mt-1">{profile.mobile}</p>
                        <div className="mt-4">
                            <Link href="/citizen/profile">
                                <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Family Summary */}
                <Card className="glass-card shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Family Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(profile.familyMembers?.length || 0) + 1}</div>
                        <p className="text-xs text-muted-foreground mt-1">Including yourself</p>
                        <div className="mt-4">
                            <Link href="/citizen/family">
                                <Button variant="outline" size="sm" className="w-full">Manage Family</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card className={cn("glass-card shadow-lg hover:shadow-xl transition-all border-l-4", unpaidMonths > 0 ? "border-l-red-500" : "border-l-emerald-500")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {unpaidMonths > 0 ? (
                                <span className="text-red-500">{unpaidMonths} Unpaid</span>
                            ) : (
                                <span className="text-emerald-500">All Clear</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Monthly Fee: ₹{profile.monthlyFee}</p>
                        <div className="mt-4">
                            <Link href="/citizen/fees">
                                <Button variant={unpaidMonths > 0 ? "destructive" : "outline"} size="sm" className="w-full">
                                    View History
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
