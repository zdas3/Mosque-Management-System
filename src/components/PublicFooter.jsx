import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function PublicFooter() {
    return (
        <footer className="bg-gray-950 text-gray-300 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-white tracking-tight">Izzathul Islam</span>
                            <span className="text-sm font-semibold tracking-wider text-[#f59e0b]">ISLAMIC CULTURAL CENTER</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Serving the community with spiritual guidance, educational programs, and a welcoming environment for all.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Administration', 'Rules & Regulations', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#065f46] opacity-50"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-[#065f46] mt-1 flex-shrink-0" size={18} />
                                <span className="text-sm text-gray-400">123 Mosque Street, Community District, City 12345</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-[#065f46] flex-shrink-0" size={18} />
                                <span className="text-sm text-gray-400">+1 (234) 567-8900</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-[#065f46] flex-shrink-0" size={18} />
                                <span className="text-sm text-gray-400">contact@izzathulislam.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Jamaat Times Mini */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Daily Prayers</h4>
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                            <ul className="space-y-3">
                                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                                    <li key={prayer} className="flex justify-between items-center bg-gray-800/50 px-3 py-2 rounded-lg">
                                        <span className="text-sm font-medium text-gray-300">{prayer}</span>
                                        <span className="text-sm text-[#065f46] font-semibold">00:00 AM</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Izzathul Islam ICC. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
