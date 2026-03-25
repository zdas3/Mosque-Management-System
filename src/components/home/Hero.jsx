'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Heart, Sparkles, Navigation } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
            {/* Mind-Blowing Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Abstract Orbs */}
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#065f46]/20 blur-[150px] mix-blend-screen pointer-events-none"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#f59e0b]/15 blur-[120px] mix-blend-screen pointer-events-none"
                />
                <motion.div
                    animate={{ y: [0, -50, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[40vw] rounded-full bg-[#20b2aa]/10 blur-[150px] mix-blend-screen pointer-events-none"
                />
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Content Area */}
                <div className="text-left space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner"
                    >
                        <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                        <span className="text-sm font-semibold tracking-wide text-emerald-50 uppercase">The Crown of Peace</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter font-outfit leading-[1.1]"
                    >
                        Izzathul <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] via-[#065f46] to-[#f59e0b] drop-shadow-[0_0_15px_rgba(0,143,93,0.3)]">
                            Islam
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed font-inter font-light"
                    >
                        Experience spiritual elevation in an architectural masterpiece defining our community hub for education, worship, and absolute peace.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center gap-4 pt-4"
                    >
                        <Link href="#timings" className="group w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#065f46] font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transform hover:-translate-y-1">
                            Prayer Times <Navigation className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        </Link>
                        <Link href="#contribute" className="group w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/10 backdrop-blur-xl transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1">
                            Contribute <Heart className="w-5 h-5 text-[#f59e0b] group-hover:scale-110 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Right Decorative Glassmorphism Element */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="relative hidden lg:block h-[600px] w-full"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#065f46]/20 to-transparent rounded-[3rem] border border-white/10 backdrop-blur-sm shadow-2xl transform rotate-3" />

                    {/* Floating Feature Cards */}
                    <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 -left-10 bg-[#0f0f0f]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-2xl w-64"
                    >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f59e0b] to-amber-600 flex items-center justify-center mb-4">
                            <BookOpen className="text-white w-6 h-6" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">Weekly Halaqah</h3>
                        <p className="text-gray-400 text-sm">Join our transformative educational sessions.</p>
                    </motion.div>

                    <motion.div
                        animate={{ y: [10, -10, 10] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-32 -right-5 bg-[#0f0f0f]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-2xl w-64"
                    >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#065f46] to-[#004d33] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,143,93,0.5)]">
                            <Heart className="text-white w-6 h-6" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">Community Care</h3>
                        <p className="text-gray-400 text-sm">Empowering through consistent charity.</p>
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
}
