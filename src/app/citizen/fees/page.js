"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, QrCode, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { generateReceipt } from "@/lib/generateReceipt";

export default function CitizenFeesPage() {
    const [history, setHistory] = useState([]);
    const [citizen, setCitizen] = useState(null);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [profileRes, settingsRes] = await Promise.all([
                    fetch("/api/profile"),
                    fetch("/api/settings")
                ]);

                if (profileRes.ok) {
                    const data = await profileRes.json();
                    setHistory(data.paymentHistory || []);
                    setCitizen(data);
                }

                if (settingsRes.ok) {
                    const sData = await settingsRes.json();
                    setSettings(sData);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">Monthly Fees</h1>
                    <p className="text-muted-foreground">Detailed payment history and status.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="glass-card shadow-md">
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-8 text-center">Loading...</div>
                            ) : (
                                <div className="divide-y border-t border-gray-100">
                                    {history.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">No payment history found.</div>
                                    ) : (
                                        [...history].reverse().map((payment) => (
                                            <div key={payment._id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    {payment.status === 'Paid' ? (
                                                        <div className="bg-emerald-100 p-2 rounded-full">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="bg-red-100 p-2 rounded-full">
                                                            <XCircle className="h-5 w-5 text-red-600" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{payment.month} {payment.year}</p>
                                                        <p className="text-xs text-muted-foreground">Updated: {new Date(payment.updatedAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-2">
                                                    <div>
                                                        <p className="font-bold text-gray-900">₹{payment.amount}</p>
                                                        <p className={cn(
                                                            "text-xs font-medium",
                                                            payment.status === 'Paid' ? "text-emerald-600" : "text-red-500"
                                                        )}>
                                                            {payment.status}
                                                        </p>
                                                    </div>
                                                    {payment.status === 'Paid' && (
                                                        <button
                                                            onClick={() => generateReceipt(payment, citizen)}
                                                            className="flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors border border-emerald-200"
                                                        >
                                                            <Download size={12} className="mr-1" /> Receipt
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar for Payment Info / QR */}
                <div className="space-y-6">
                    <Card className="bg-[#008f5d] text-white shadow-lg overflow-hidden border-none relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <QrCode size={120} />
                        </div>
                        <CardContent className="p-6 relative z-10">
                            <h3 className="font-outfit font-bold text-xl mb-2">How to Pay</h3>
                            <p className="text-emerald-50 text-sm mb-6">
                                Scan the QR code below using your preferred UPI app to make your monthly fee payment.
                            </p>

                            {settings.monthlyFeeQr ? (
                                <div className="bg-white p-4 rounded-2xl shadow-inner mb-4">
                                    <img
                                        src={settings.monthlyFeeQr}
                                        alt="Monthly Fee Payment QR"
                                        className="w-full aspect-square object-contain rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="bg-emerald-900/30 p-8 rounded-2xl text-center mb-4 border border-emerald-400/20">
                                    <QrCode className="mx-auto h-8 w-8 text-emerald-300 opacity-50 mb-2" />
                                    <p className="text-sm font-medium text-emerald-100">QR Code not yet configured by admin.</p>
                                </div>
                            )}

                            <div className="space-y-2 mt-6 border-t border-emerald-400/30 pt-4 text-sm text-emerald-50">
                                <p className="flex justify-between">
                                    <span className="opacity-80">UPI ID:</span>
                                    <span className="font-semibold">izzathulicc@bank</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="opacity-80">Bank:</span>
                                    <span className="font-semibold">Islamic Bank</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
