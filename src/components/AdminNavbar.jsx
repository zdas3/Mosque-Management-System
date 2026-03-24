
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, LayoutDashboard, CreditCard, LogOut, Building2, Bell, Settings, Calculator } from "lucide-react";
import { Button } from "./ui/button";

export function AdminNavbar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

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
        <nav className="border-b bg-white/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl text-emerald-800 font-outfit">
                    <Building2 className="text-emerald-600" />
                    <span>ICC Admin</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href; // Exact match might need adjustment for subroutes
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-emerald-100/50 text-emerald-800 shadow-sm ring-1 ring-emerald-200"
                                            : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    )}
                                >
                                    <Icon size={16} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                    >
                        <LogOut size={16} />
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
}
