"use client";

import { useState, useEffect } from "react";
import { Calculator, TrendingUp, TrendingDown, CalendarDays, FileText, Plus, Trash2, Download, ArrowLeft, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Income", "Expense", "Events", "Reports"];
const EVENT_TABS = ["Summary", "Income", "Expense"];

export default function AdminAccounts() {
    const [activeTab, setActiveTab] = useState("Overview");
    const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, surplus: 0 });
    const [income, setIncome] = useState([]);
    const [expense, setExpense] = useState([]);
    const [events, setEvents] = useState([]);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Generic form states
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Event Management View State
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventActiveTab, setEventActiveTab] = useState("Summary");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [stRes, inRes, exRes, evRes, repRes] = await Promise.all([
                fetch("/api/admin/accounts/stats"),
                fetch("/api/admin/accounts/income"),
                fetch("/api/admin/accounts/expense"),
                fetch("/api/admin/events"),
                fetch("/api/admin/reports")
            ]);

            if (stRes.ok) setStats(await stRes.json());
            if (inRes.ok) setIncome(await inRes.json());
            if (exRes.ok) setExpense(await exRes.json());
            if (evRes.ok) setEvents(await evRes.json());
            if (repRes.ok) setReports(await repRes.json());
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFormOpen = () => {
        setFormData({});
        setFile(null);
        setShowForm(true);
    };

    const handleDelete = async (type, id) => {
        if (!confirm(`Delete this ${type}?`)) return;
        const endpoints = {
            Income: `/api/admin/accounts/income/${id}`,
            Expense: `/api/admin/accounts/expense/${id}`,
            Events: `/api/admin/events/${id}`,
            Reports: `/api/admin/reports/${id}`
        };
        try {
            await fetch(endpoints[type], { method: "DELETE" });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleEventDelete = async (type, id) => {
        if (!confirm(`Delete this ${type}?`)) return;
        const endpoints = {
            Income: `/api/admin/accounts/income/${id}`,
            Expense: `/api/admin/accounts/expense/${id}`,
        };
        try {
            await fetch(endpoints[type], { method: "DELETE" });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let payload = { ...formData };
            let endpoint = "";

            if (!selectedEvent) {
                if (activeTab === "Income") endpoint = "/api/admin/accounts/income";
                if (activeTab === "Expense") endpoint = "/api/admin/accounts/expense";
                if (activeTab === "Events") endpoint = "/api/admin/events";
    
                if (activeTab === "Reports") {
                    endpoint = "/api/admin/reports";
                    if (file) {
                        const uploadData = new FormData();
                        uploadData.append('file', file);
                        uploadData.append('folder', 'reports');
    
                        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
                        if (uploadRes.ok) {
                            const data = await uploadRes.json();
                            payload.fileUrl = data.url;
                        } else {
                            throw new Error('File upload failed');
                        }
                    }
                }
            } else {
                // Event specific submission
                payload.eventId = selectedEvent._id;
                if (eventActiveTab === "Income") endpoint = "/api/admin/accounts/income";
                if (eventActiveTab === "Expense") endpoint = "/api/admin/accounts/expense";
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowForm(false);
                fetchData();
            } else {
                alert("Failed to save");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-sm border-emerald-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">₹{stats.totalIncome.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border-red-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Expense</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">₹{stats.totalExpense.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card className={cn("shadow-sm border-none text-white", stats.surplus >= 0 ? "bg-[#008f5d]" : "bg-red-600")}>
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
    );

    const renderList = (items, type) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th className="px-6 py-4">Title</th>
                        {(type === 'Income' || type === 'Expense') && <th className="px-6 py-4">Amount</th>}
                        <th className="px-6 py-4">Date</th>
                        {type === 'Reports' && <th className="px-6 py-4">Type</th>}
                        {type === 'Reports' && <th className="px-6 py-4">File</th>}
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {items.map(item => (
                        <tr key={item._id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {item.title}
                                {(type === 'Income' || type === 'Expense') && item.eventId && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-800">
                                        Event Linked
                                    </span>
                                )}
                            </td>
                            {(type === 'Income' || type === 'Expense') && (
                                <td className={cn("px-6 py-4 font-bold", type === 'Income' ? 'text-emerald-600' : 'text-red-600')}>
                                    ₹{item.amount}
                                </td>
                            )}
                            <td className="px-6 py-4 text-gray-500">
                                {new Date(item.date || item.createdAt).toLocaleDateString()}
                            </td>
                            {type === 'Reports' && <td className="px-6 py-4">{item.type}</td>}
                            {type === 'Reports' && (
                                <td className="px-6 py-4">
                                    <a href={item.fileUrl} target="_blank" className="text-[#008f5d] hover:underline flex items-center gap-1">
                                        <Download size={14} /> View
                                    </a>
                                </td>
                            )}
                            <td className="px-6 py-4 text-right">
                                {type === 'Events' && (
                                    <button onClick={() => { setSelectedEvent(item); setEventActiveTab("Summary"); setShowForm(false); }} className="text-indigo-600 hover:text-indigo-800 ml-3 font-semibold text-xs border border-indigo-200 px-3 py-1.5 rounded-lg mr-2 transition-colors">
                                        Manage Accounts
                                    </button>
                                )}
                                <button onClick={() => handleDelete(type, item._id)} className="text-red-500 hover:text-red-700 p-2">
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No records found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderForm = () => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
            <h3 className="text-xl font-bold mb-4 font-outfit">Add New {!selectedEvent ? (activeTab !== "Events" ? activeTab : "Event") : eventActiveTab}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input required type="text" onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:ring-2 focus:ring-[#008f5d]" placeholder="e.g. Donation, Maintenance" />
                    </div>

                    {((!selectedEvent && (activeTab === "Income" || activeTab === "Expense")) || (selectedEvent && (eventActiveTab === "Income" || eventActiveTab === "Expense"))) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input required type="number" onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:ring-2 focus:ring-[#008f5d]" placeholder="0.00" />
                        </div>
                    )}

                    {((!selectedEvent && (activeTab === "Income" || activeTab === "Expense" || activeTab === "Events")) || (selectedEvent && (eventActiveTab === "Income" || eventActiveTab === "Expense"))) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input required type="date" onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:ring-2 focus:ring-[#008f5d]" />
                        </div>
                    )}

                    {!selectedEvent && activeTab === "Reports" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                                <select required onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:ring-2 focus:ring-[#008f5d]">
                                    <option value="">Select Type</option>
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document (PDF/Image)</label>
                                <input required type="file" onChange={e => setFile(e.target.files[0])} className="w-full border-gray-300 rounded-lg p-2 border outline-none focus:ring-2 focus:ring-[#008f5d]" />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-2 justify-end mt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                    <button disabled={isSubmitting} type="submit" className="px-6 py-2 bg-[#008f5d] text-white rounded-lg font-bold hover:bg-[#007049] transition-colors disabled:opacity-50 flex items-center gap-2">
                        {isSubmitting ? "Saving..." : "Save Entry"}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderEventView = () => {
        const eventIncome = income.filter(i => i.eventId === selectedEvent._id);
        const eventExpense = expense.filter(e => e.eventId === selectedEvent._id);
        const totalEvIncome = eventIncome.reduce((acc, curr) => acc + curr.amount, 0);
        const totalEvExpense = eventExpense.reduce((acc, curr) => acc + curr.amount, 0);
        const evSurplus = totalEvIncome - totalEvExpense;

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold font-outfit text-gray-900">{selectedEvent.title}</h2>
                            <p className="text-sm text-gray-500">Event Date: {new Date(selectedEvent.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100 mb-6">
                        {EVENT_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setEventActiveTab(tab); setShowForm(false); }}
                                className={cn(
                                    "px-6 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors",
                                    eventActiveTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {eventActiveTab === "Summary" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <Card className="bg-indigo-50 shadow-none border-indigo-100">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-indigo-800">Event Income</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-indigo-900">₹{totalEvIncome.toLocaleString()}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-rose-50 shadow-none border-rose-100">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-rose-800">Event Expense</CardTitle>
                                    <TrendingDown className="h-4 w-4 text-rose-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-rose-900">₹{totalEvExpense.toLocaleString()}</div>
                                </CardContent>
                            </Card>
                            <Card className={cn("shadow-none border", evSurplus >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100")}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className={cn("text-sm font-medium", evSurplus >= 0 ? "text-emerald-800" : "text-red-800")}>Event Net Result</CardTitle>
                                    <Calculator className={cn("h-4 w-4", evSurplus >= 0 ? "text-emerald-600" : "text-red-600")} />
                                </CardHeader>
                                <CardContent>
                                    <div className={cn("text-3xl font-bold", evSurplus >= 0 ? "text-emerald-900" : "text-red-900")}>₹{evSurplus.toLocaleString()}</div>
                                    <p className={cn("text-xs mt-1", evSurplus >= 0 ? "text-emerald-700" : "text-red-700")}>{evSurplus >= 0 ? 'Surplus' : 'Deficit'}</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {eventActiveTab !== "Summary" && (
                        <div className="pt-2">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">{eventActiveTab} Entries</h3>
                                <button onClick={handleFormOpen} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                                    <Plus size={16} /> Add {eventActiveTab}
                                </button>
                            </div>

                            {showForm && renderForm()}

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4">Description</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {(eventActiveTab === "Income" ? eventIncome : eventExpense).map(item => (
                                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                                                <td className={cn("px-6 py-4 font-bold", eventActiveTab === 'Income' ? 'text-emerald-600' : 'text-red-600')}>
                                                    ₹{item.amount}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(item.date || item.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => handleEventDelete(eventActiveTab, item._id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(eventActiveTab === "Income" ? eventIncome : eventExpense).length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">No entries recorded for this event yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {!selectedEvent ? (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-outfit flex items-center gap-2">
                                <Calculator className="text-[#008f5d] h-8 w-8" />
                                Accounts & Finance
                            </h1>
                            <p className="text-gray-500 mt-1">Manage income, expenses, events, and generate reports.</p>
                        </div>
                        {activeTab !== "Overview" && (
                            <button onClick={handleFormOpen} className="flex items-center gap-2 bg-[#008f5d] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#007049] transition-colors shadow-sm">
                                <Plus size={16} /> Add {activeTab === "Events" ? "Event" : activeTab.slice(0, -1)}
                            </button>
                        )}
                    </div>

                    {/* Custom Tabs */}
                    <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setShowForm(false); }}
                                className={cn(
                                    "px-6 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all duration-200",
                                    activeTab === tab ? "border-[#008f5d] text-[#008f5d]" : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200 hover:bg-gray-50 rounded-t-lg"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="py-20 text-center text-gray-500">Loading accounts data...</div>
                    ) : (
                        <div className="pt-4">
                            {showForm && activeTab !== "Overview" && renderForm()}

                            {activeTab === "Overview" && renderOverview()}
                            {activeTab === "Income" && renderList(income, "Income")}
                            {activeTab === "Expense" && renderList(expense, "Expense")}
                            {activeTab === "Events" && renderList(events, "Events")}
                            {activeTab === "Reports" && renderList(reports, "Reports")}
                        </div>
                    )}
                </>
            ) : (
                renderEventView()
            )}
        </div>
    );
}
