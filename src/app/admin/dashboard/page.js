
"use client";

import { useEffect, useState } from "react";
import { Users, User, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalFamilies: 0, totalMembers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Families",
            value: stats.totalFamilies,
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
        },
        {
            title: "Total Members",
            value: stats.totalMembers,
            icon: User,
            color: "text-amber-600",
            bg: "bg-amber-100",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent font-outfit">Dashboard</h1>
                <p className="text-muted-foreground mt-2">Overview of the Izzathul Islam ICC community.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="glass-card border-none shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={cn("p-2 rounded-full", stat.bg)}>
                                    <Icon className={cn("h-4 w-4", stat.color)} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 font-outfit">
                                    {loading ? "..." : stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                    <span className="text-emerald-600 font-medium">Live</span> realtime data
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Placeholder for Filters/Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card border-none shadow px-0">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-gray-100 rounded-lg m-4">
                            Chart Placeholder (Requires recharts)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 glass-card border-none shadow">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest registrations and payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Dummy activity */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                                    <div className="ml-2 space-y-1">
                                        <p className="text-sm font-medium leading-none">New Family Registered</p>
                                        <p className="text-xs text-muted-foreground">Just now</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
