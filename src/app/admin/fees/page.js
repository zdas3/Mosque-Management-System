
"use client";

import { useState } from "react";
import { PlusCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// Native select used instead of component


export default function MonthlyFeePage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        amount: "", // Optional override
    });

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = [2024, 2025, 2026, 2027, 2028];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");

        try {
            const res = await fetch("/api/admin/payments/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to generate fees");
            }

            setSuccess(`Successfully generated fees for ${formData.month} ${formData.year}. Modified ${data.modifiedCount} records.`);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Monthly Fees</h1>
                <p className="text-muted-foreground">Generate monthly fee demands for all citizens.</p>
            </div>

            <Card className="glass-card shadow-lg border-none">
                <CardHeader>
                    <CardTitle>Generate New Month</CardTitle>
                    <CardDescription>
                        This will add a "Unpaid" payment record for the selected month to all citizens who don't have it yet.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Month</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.month}
                                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                >
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Year</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                >
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Default Amount Override (Optional)</label>
                            <Input
                                type="number"
                                placeholder="Leave empty to use citizen's individual fee"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">If left blank, the system uses the <code>monthlyFee</code> set in each citizen's profile.</p>
                        </div>

                        {success && (
                            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-md flex items-center gap-2 border border-emerald-200">
                                <CheckCircle2 className="h-5 w-5" />
                                {success}
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-medium">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            Generate Demands
                        </Button>

                        <div className="pt-4 border-t">
                            <h3 className="text-sm font-medium mb-2">System Tools</h3>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={async () => {
                                    if (!confirm("This will generate 'Unpaid' records for ALL months from Jan 2024 to now for any missing records. Continue?")) return;
                                    setLoading(true);
                                    try {
                                        const res = await fetch("/api/admin/payments/backfill", { method: "POST" });
                                        const d = await res.json();
                                        alert(d.message + " Modified: " + d.totalModified);
                                    } catch (e) {
                                        alert("Error");
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                className="w-full"
                            >
                                Initialize History (2024-Present)
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="glass-card shadow-lg border-none">
                <CardHeader>
                    <CardTitle>Payment Status Report</CardTitle>
                    <CardDescription>View who has paid and who is pending for a specific month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PaymentStatusList />
                </CardContent>
            </Card>
        </div>
    );
}

function PaymentStatusList() {
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [fetched, setFetched] = useState(false);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const years = [2024, 2025, 2026, 2027, 2028];

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/payments/status?month=${month}&year=${year}`);
            if (res.ok) {
                setData(await res.json());
                setFetched(true);
            }
        } catch (e) {
            alert("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <select value={month} onChange={e => setMonth(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <Button onClick={fetchData} disabled={loading} variant="secondary">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "View Status"}
                </Button>
            </div>

            {fetched && (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b font-medium text-gray-500">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Mobile</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y bg-white">
                            {data.map(item => (
                                <tr key={item._id}>
                                    <td className="p-3 font-mono text-xs">{item.membershipId}</td>
                                    <td className="p-3 font-medium">{item.name}</td>
                                    <td className="p-3 text-muted-foreground">{item.mobile}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                            item.status === 'Unpaid' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && <tr><td colSpan={4} className="p-4 text-center">No citizens found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
