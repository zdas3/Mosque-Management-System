import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, CreditCard, User, LogOut, Building2, Bell, Calculator } from "lucide-react";
import { Button } from "./ui/button";

export function CitizenNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [unreadCount, setUnreadCount] = useState(0);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

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
    }, [pathname]); // Re-fetch when pathname changes to keep badge updated

    const navItems = [
        { name: "Home", href: "/citizen/dashboard", icon: Home },
        { name: "Monthly Fee", href: "/citizen/fees", icon: CreditCard },
        { name: "Family", href: "/citizen/family", icon: Users },
        { name: "Accounts", href: "/citizen/accounts", icon: Calculator },
        { name: "Announcements", href: "/citizen/announcements", icon: Bell, badge: unreadCount },
        { name: "Profile", href: "/citizen/profile", icon: User },
    ];

    return (
        <nav className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl text-emerald-800 font-outfit">
                    <Building2 className="text-emerald-600" />
                    <span>ICC Member</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-amber-100/50 text-amber-900 shadow-sm ring-1 ring-amber-200"
                                            : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    )}
                                >
                                    <Icon size={16} />
                                    {item.name}
                                    {item.badge > 0 && (
                                        <span className="absolute top-0 right-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-600 gap-2"
                    >
                        <LogOut size={16} />
                        <span className="sr-only md:not-sr-only">Logout</span>
                    </Button>
                </div>

                {/* Mobile Nav could be added here (Sheet or Menu) - For now keeping simple */}
            </div>
        </nav>
    );
}
