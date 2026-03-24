'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, LayoutDashboard, CreditCard, Building2, Bell, Settings, Calculator } from "lucide-react";

export function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Monthly Fee", href: "/admin/fees", icon: CreditCard },
        { name: "Citizens", href: "/admin/citizens", icon: Users },
        { name: "Administration", href: "/admin/administration", icon: Building2 },
        { name: "Accounts", href: "/admin/accounts", icon: Calculator },
        { name: "Announcements", href: "/admin/announcements", icon: Bell },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 shadow-sm z-40 hidden md:block pt-24 overflow-y-auto hidden-scrollbar transition-transform duration-300">
            <div className="p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit mb-6">Menu Overview</p>
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon size={20} className={cn("transition-colors", isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-600")} strokeWidth={isActive ? 2.5 : 2} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            
            {/* Quick Stats or Info could go here to make it feel premium */}
            <div className="absolute bottom-6 left-5 right-5 p-4 rounded-xl bg-gradient-to-br from-[#008f5d] to-[#00eb9b] text-white shadow-lg overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
                <p className="text-xs font-bold tracking-wider mb-1 opacity-90">ICC Admin</p>
                <p className="text-[10px] font-medium opacity-80 leading-relaxed">Mosque Management System</p>
            </div>
        </aside>
    );
}
