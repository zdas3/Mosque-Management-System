'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, UserCircle, LogOut, LayoutDashboard } from 'lucide-react';

const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Administration', path: '/administration' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Contact', path: '/contact' },
];

export default function GlobalHeader({ user }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isHome = pathname === '/';
    const isAdminArea = pathname === '/admin' || pathname?.startsWith('/admin/');
    const isCitizenArea = pathname === '/citizen' || pathname?.startsWith('/citizen/');

    // Solid background if not home, or if scrolled
    const shouldBeSolid = !isHome || isScrolled;

    useEffect(() => {
        if (!isHome) {
            setIsScrolled(true);
            return;
        }
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    if (isAdminArea) return null;

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.refresh();
        router.push('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${shouldBeSolid ? 'bg-gray-950/95 backdrop-blur-md border-b border-white/10 shadow-xl py-4' : 'bg-transparent py-6'}`}
        >
            <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${isAdminArea || isCitizenArea ? 'max-w-none' : 'max-w-7xl'}`}>
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <Link href={isAdminArea ? '/admin/dashboard' : isCitizenArea ? '/citizen/dashboard' : '/'} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-300 bg-[#008f5d] text-white shadow-md group-hover:scale-105">
                                IC
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg leading-tight text-white transition-colors duration-300">
                                    Izzathul Islam
                                </span>
                                <span className={`text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${!shouldBeSolid ? 'text-emerald-300' : 'text-emerald-100'}`}>
                                    ICC
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu - Conditional based on Role/Area */}
                    {!(isAdminArea || isCitizenArea) ? (
                        <div className="hidden md:flex items-center space-x-8">
                            {publicLinks.map((link) => {
                                const isActive = pathname === link.path || (link.path !== '/' && pathname?.startsWith(link.path));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className={`relative px-1 py-2 text-sm font-medium transition-colors ${isActive ? (shouldBeSolid ? 'text-white font-bold' : 'text-emerald-300') : 'text-white/90 hover:text-white'
                                            }`}
                                    >
                                        {link.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="header-indicator"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ) : null}

                    {/* Action Buttons / User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {!(isAdminArea || isCitizenArea) && (
                                    <Link
                                        href={user.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard'}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                                    >
                                        <LayoutDashboard size={18} />
                                        Dashboard
                                    </Link>
                                )}
                                <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                                    <div className="flex flex-col text-right">
                                        <span className="text-sm font-bold text-white leading-tight">{user.name}</span>
                                        <span className="text-xs text-emerald-300 uppercase font-medium tracking-wider">{user.role}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-100 font-bold uppercase">
                                        {user.name?.charAt(0)}
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="p-2 ml-2 rounded-full text-gray-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                                >
                                    <UserCircle size={18} />
                                    Portal Login
                                </Link>
                                {!(isAdminArea || isCitizenArea) && (
                                    <Link
                                        href="/#contribute"
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-[#008f5d] bg-white hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        Contribute <ChevronRight size={16} />
                                    </Link>
                                )}
                            </>
                        )}
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
                        className="md:hidden bg-[#0a0a0a] border-t border-white/5 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4 shadow-xl">
                            {!(isAdminArea || isCitizenArea) && publicLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-white/5 hover:text-[#00eb9b] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col gap-3 border-t border-white/5">
                                {user ? (
                                    <>
                                        {!(isAdminArea || isCitizenArea) && (
                                            <Link
                                                href={user.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard'}
                                                className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-base font-medium bg-white/5 text-emerald-300 hover:bg-white/10"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <LayoutDashboard size={20} />
                                                Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                                            className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-base font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                                        >
                                            <LogOut size={20} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-base font-medium bg-white/5 text-emerald-300 hover:bg-white/10"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <UserCircle size={20} />
                                            Portal Login
                                        </Link>
                                        <Link
                                            href="/#contribute"
                                            className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-base font-medium text-black bg-[#00eb9b] hover:bg-emerald-400"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Contribute
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
