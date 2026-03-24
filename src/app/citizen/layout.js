
"use client";
import { CitizenSidebar } from "@/components/layout/CitizenSidebar";

export default function CitizenLayout({ children }) {
    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 relative">
            <CitizenSidebar />
            <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 pt-32 transition-all duration-300 md:pl-72">
                {children}
            </main>
        </div>
    );
}
