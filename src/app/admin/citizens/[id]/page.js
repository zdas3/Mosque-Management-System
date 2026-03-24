
"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Edit, Save, Trash2, Check, X, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { generateReceipt } from "@/lib/generateReceipt";

import { use } from "react";

export default function CitizenDetailPage({ params }) {
    const { id } = use(params);
    const [citizen, setCitizen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // States for sub-forms could be complex. 
    // Let's implement Payment Update directly in the list.

    async function fetchCitizen() {
        try {
            const res = await fetch(`/api/citizens/${id}`);
            if (res.ok) {
                setCitizen(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCitizen();
    }, [id]);

    const updatePaymentStatus = async (paymentId, newStatus) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/citizens/${id}/payment`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, status: newStatus }),
            });
            if (res.ok) {
                fetchCitizen(); // Refresh
            }
        } catch (e) {
            alert("Failed to update");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!citizen) return <div className="p-8 text-center text-red-500">Citizen not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/citizens">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold font-outfit">{citizen.name}</h1>
                    <p className="text-muted-foreground font-mono text-sm">{citizen.membershipId}</p>
                </div>
                <Link href={`/admin/citizens/${id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" /> Edit Profile
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Mobile</span>
                            <span className="font-medium">{citizen.mobile}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Address</span>
                            <span className="font-medium">{citizen.address || "-"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Monthly Fee</span>
                            <span className="font-medium">₹{citizen.monthlyFee}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Role</span>
                            <span className="font-medium capitalize">{citizen.role}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Family Members */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Family Members</CardTitle>
                        {/* Edit family is done via Edit page usually, but could be here */}
                    </CardHeader>
                    <CardContent>
                        {citizen.familyMembers && citizen.familyMembers.length > 0 ? (
                            <ul className="space-y-3">
                                {citizen.familyMembers.map((member, idx) => (
                                    <li key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                                            {member.name[0]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.relationship} • {member.age} yrs</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No family members added.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b font-medium text-gray-500">
                                <tr>
                                    <th className="p-3">Month</th>
                                    <th className="p-3">Year</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {[...(citizen.paymentHistory || [])].reverse().map((payment) => (
                                    <tr key={payment._id} className="bg-white">
                                        <td className="p-3">{payment.month}</td>
                                        <td className="p-3">{payment.year}</td>
                                        <td className="p-3">₹{payment.amount}</td>
                                        <td className="p-3">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                                payment.status === 'Paid' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                            )}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {payment.status === 'Paid' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-emerald-700 border-emerald-200 hover:bg-emerald-50 px-2"
                                                        onClick={() => generateReceipt(payment, citizen)}
                                                    >
                                                        <Download className="h-3 w-3 mr-1" /> Receipt
                                                    </Button>
                                                )}

                                                {payment.status === 'Unpaid' ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-emerald-600 hover:text-white hover:bg-emerald-600"
                                                        onClick={() => updatePaymentStatus(payment._id, 'Paid')}
                                                        disabled={updating}
                                                    >
                                                        Mark Paid
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 text-red-500 hover:bg-red-50 px-2"
                                                        onClick={() => updatePaymentStatus(payment._id, 'Unpaid')}
                                                        disabled={updating}
                                                    >
                                                        Mark Unpaid
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!citizen.paymentHistory || citizen.paymentHistory.length === 0) && (
                                    <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No payment history.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
