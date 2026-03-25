"use client";

import { useState, useEffect } from "react";
import { Calculator, TrendingUp, TrendingDown, FileText, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CitizenAccounts() {
    const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, surplus: 0 });
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stRes, repRes] = await Promise.all([
                    fetch("/api/admin/accounts/stats"),
                    fetch("/api/admin/reports")
                ]);

                if (stRes.ok) setStats(await stRes.json());
                if (repRes.ok) setReports(await repRes.json());
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading accounts data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">Accounts & Reports</h1>
                <p className="text-muted-foreground">Transparency overview of the mosque's finances.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">₹{stats.totalIncome.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="glass-card shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Expense</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">₹{stats.totalExpense.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className={cn("shadow-md border-none text-white", stats.surplus >= 0 ? "bg-[#065f46]" : "bg-red-600")}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-white/80">Net Balance</CardTitle>
                        <Calculator className="h-4 w-4 text-white/80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹{stats.surplus.toLocaleString()}</div>
                        <p className="text-xs text-white/70 mt-1">{stats.surplus >= 0 ? 'Surplus' : 'Deficit'}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card shadow-md border-emerald-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="text-emerald-600" size={20} /> Letest Reports
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                        {reports.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No reports available.</div>
                        ) : (
                            reports.map((report) => (
                                <div key={report._id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                            <FileText className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{report.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {report.type} • {report.month} {report.year}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={report.fileUrl}
                                        target="_blank"
                                        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-emerald-200"
                                    >
                                        <Download size={16} /> Download
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
