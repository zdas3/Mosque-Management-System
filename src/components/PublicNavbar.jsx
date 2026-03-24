'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, UserCircle } from 'lucide-react';

const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Administration', path: '/administration' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Contact', path: '/contact' },
];

export default function PublicNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll(); // Check on mount
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-950/95 backdrop-blur-md border-b border-white/10 shadow-xl py-4' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-300 bg-[#008f5d] text-white shadow-md group-hover:scale-105">
                                IC
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg leading-tight text-white transition-colors duration-300">
                                    Izzathul Islam
                                </span>
                                <span className={`text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${isScrolled ? 'text-emerald-100' : 'text-emerald-300'}`}>
                                    ICC
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {links.map((link) => {
                            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                            return (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className={`relative px-1 py-2 text-sm font-medium transition-colors ${isActive ? (isScrolled ? 'text-white font-bold' : 'text-emerald-300') : 'text-white/90 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                        >
                            <UserCircle size={18} />
                            Portal Login
                        </Link>
                        <Link
                            href="/#contribute"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-[#008f5d] bg-white hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Contribute <ChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 focus:outline-none text-white"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4 shadow-xl">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#008f5d] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col gap-3 border-t border-gray-100">
                                <Link
                                    href="/login"
                                    className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-base font-medium bg-gray-50 text-gray-700 hover:bg-gray-100"
                                >
                                    <UserCircle size={20} />
                                    Portal Login
                                </Link>
                                <Link
                                    href="/#contribute"
                                    className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-base font-medium text-white bg-[#008f5d] hover:bg-[#007049]"
                                >
                                    Contribute
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
