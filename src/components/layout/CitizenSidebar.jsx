'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, CreditCard, User, Bell, Calculator } from "lucide-react";

export function CitizenSidebar() {
    const pathname = usePathname();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch("/api/citizens/announcements");
                if (res.ok) {
                    const data = await res.json();
                    setUnreadCount(data.filter(a => !a.isRead).length);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchAnnouncements();
    }, [pathname]);

    const navItems = [
        { name: "Dashboard", href: "/citizen/dashboard", icon: Home },
        { name: "Monthly Fee", href: "/citizen/fees", icon: CreditCard },
        { name: "Family", href: "/citizen/family", icon: Users },
        { name: "Accounts", href: "/citizen/accounts", icon: Calculator },
        { name: "Announcements", href: "/citizen/announcements", icon: Bell, badge: unreadCount },
        { name: "Profile", href: "/citizen/profile", icon: User },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 shadow-sm z-40 hidden md:block pt-24 overflow-y-auto hidden-scrollbar transition-transform duration-300">
            <div className="p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit mb-6">User Menu</p>
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon size={20} className={cn("transition-colors", isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-600")} strokeWidth={isActive ? 2.5 : 2} />
                                {item.name}
                                {item.badge > 0 && (
                                    <span className="absolute top-1/2 -translate-y-1/2 right-4 flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
