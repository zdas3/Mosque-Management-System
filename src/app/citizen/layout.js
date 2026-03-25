
"use client";

import { useEffect, useState } from "react";
import { CitizenTopNav } from "@/components/layout/CitizenTopNav";

export default function CitizenLayout({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => {
                if (data.name) setUser(data);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 relative">
            <CitizenTopNav user={user} />
            <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
