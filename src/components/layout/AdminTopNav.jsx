'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, LayoutDashboard, CreditCard, Building2, Bell, Settings, Calculator, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminTopNav({ user }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Fees", href: "/admin/fees", icon: CreditCard },
        { name: "Citizens", href: "/admin/citizens", icon: Users },
        { name: "Administration", href: "/admin/administration", icon: Building2 },
        { name: "Accounts", href: "/admin/accounts", icon: Calculator },
        { name: "Announcements", href: "/admin/announcements", icon: Bell },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.refresh();
        router.push('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-[#008f5d] flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                            IC
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm leading-none text-gray-900">Admin Panel</span>
                            <span className="text-[10px] uppercase text-gray-500 font-medium tracking-widest mt-0.5">Izzathul Islam</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center space-x-1 mx-6 flex-1 overflow-x-auto hidden-scrollbar">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                                        isActive
                                            ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon size={16} className={cn("transition-colors", isActive ? "text-emerald-600" : "text-gray-400")} strokeWidth={isActive ? 2.5 : 2} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Actions */}
                    <div className="hidden xl:flex items-center gap-4 shrink-0 border-l border-gray-200 pl-4">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-bold text-gray-900 leading-tight">{user?.name || 'Administrator'}</span>
                            <span className="text-xs text-emerald-600 uppercase font-medium tracking-wider">{user?.role || 'Admin'}</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold uppercase shadow-inner">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-2 -mr-2 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="xl:hidden p-2 text-gray-500 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="xl:hidden border-t border-gray-100 bg-white"
                    >
                        <nav className="px-4 py-3 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                                            isActive
                                                ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <Icon size={18} className={cn("transition-colors", isActive ? "text-emerald-600" : "text-gray-400")} strokeWidth={isActive ? 2.5 : 2} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            
                            <div className="pt-4 mt-2 border-t border-gray-100">
                                <div className="flex items-center justify-between px-3 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold uppercase">
                                            {user?.name?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{user?.name || 'Administrator'}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
