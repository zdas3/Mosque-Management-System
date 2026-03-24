'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function GlobalFooter() {
    const pathname = usePathname();
    const isAdminArea = pathname === '/admin' || pathname?.startsWith('/admin/');
    const isCitizenArea = pathname === '/citizen' || pathname?.startsWith('/citizen/');

    // Minimal professional footer for Admin & Citizen panels
    if (isAdminArea || isCitizenArea) {
        return (
            <footer className="bg-white border-t border-gray-100 py-6 mt-auto shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                <div className="w-full mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 font-medium tracking-tight">
                        © {new Date().getFullYear()} Izzathul Islam ICC System.
                    </p>
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link href="#" className="hover:text-emerald-600 transition-colors">Support</Link>
                        <Link href="#" className="hover:text-emerald-600 transition-colors">Documentation</Link>
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold border border-gray-200">v3.0</span>
                    </div>
                </div>
            </footer>
        );
    }

    // Public Universal Footer
    return (
        <footer className="bg-[#0a0a0a] text-gray-300 py-16 border-t border-white/5 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#008f5d]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex flex-col">
                            <span className="font-black text-3xl text-white tracking-tight font-outfit">Izzathul Islam</span>
                            <span className="text-xs font-bold tracking-widest text-[#d4af37] uppercase mt-1">Islamic Cultural Center</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed font-light">
                            Serving the community with spiritual guidance, robust educational programs, and a welcoming, inclusive environment for all.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm font-outfit">Quick Links</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Administration', 'Rules & Regulations', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-gray-400 hover:text-[#00eb9b] transition-colors duration-200 flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#008f5d] group-hover:bg-[#00eb9b] transition-colors"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm font-outfit">Contact Us</h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-3 group">
                                <MapPin className="text-[#008f5d] mt-0.5 flex-shrink-0 group-hover:text-[#00eb9b] transition-colors" size={18} />
                                <span className="text-sm text-gray-400 font-light">123 Mosque Street, Community District, City 12345</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <Phone className="text-[#008f5d] flex-shrink-0 group-hover:text-[#00eb9b] transition-colors" size={18} />
                                <span className="text-sm text-gray-400 font-light">+1 (234) 567-8900</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <Mail className="text-[#008f5d] flex-shrink-0 group-hover:text-[#00eb9b] transition-colors" size={18} />
                                <span className="text-sm text-gray-400 font-light">contact@izzathulislam.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Jamaat Times Mini */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm font-outfit">Daily Prayers</h4>
                        <div className="bg-[#111] border border-white/5 rounded-2xl p-5 shadow-lg">
                            <ul className="space-y-3">
                                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                                    <li key={prayer} className="flex justify-between items-center bg-white/5 px-3 py-2.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <span className="text-sm font-medium text-gray-300">{prayer}</span>
                                        <span className="text-sm text-[#00eb9b] font-bold">00:00 AM</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-gray-500 font-light">
                        © {new Date().getFullYear()} Izzathul Islam ICC. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
