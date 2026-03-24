
"use client";
import { AdminTopNav } from "@/components/layout/AdminTopNav";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user from profile API to pass to top nav
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => {
                if (data.user) setUser(data.user);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 relative">
            <AdminTopNav user={user} />
            <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
