'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Wallet, CreditCard, ArrowRight, QrCode, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ContributeSection({ contributionQr }) {
    const [showQr, setShowQr] = useState(false);

    return (
        <section id="contribute" className="py-32 bg-[#050505] relative overflow-hidden border-t border-white/5">
            {/* Mind-Blowing Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute left-1/4 top-1/2 w-[600px] h-[600px] bg-[#008f5d]/10 blur-[150px] rounded-full -translate-y-1/2" />
                <div className="absolute right-1/4 top-1/2 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full -translate-y-1/2" />
                <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#008f5d]/20 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.1)] mb-8"
                >
                    <Heart size={16} className="text-[#d4af37]" />
                    <span className="text-sm font-bold tracking-wide text-emerald-100 uppercase">Support the House of Allah</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black text-white mb-8 font-outfit tracking-tighter"
                >
                    Sadaqah <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-yellow-200">Jariyah</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-400 max-w-3xl mx-auto mb-20 leading-relaxed font-light"
                >
                    "Those who spend their wealth in the cause of Allah, and do not follow up their gifts with reminders of their generosity or with injury, their reward is with their Lord." <br /> <span className="text-[#d4af37]/80 font-medium">(Al-Baqarah 2:262)</span>
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { title: 'General Fund', desc: 'Support the daily operations and maintenance of the mosque.', icon: Wallet, color: 'from-[#008f5d] to-[#00eb9b]', glow: 'shadow-[0_0_30px_rgba(0,143,93,0.3)]' },
                        { title: 'Zakat Fund', desc: 'Fulfill your obligatory Zakat. 100% distributed to the needy.', icon: Heart, color: 'from-[#d4af37] to-amber-300', glow: 'shadow-[0_0_30px_rgba(212,175,55,0.3)]' },
                        { title: 'Expansion Project', desc: 'Help us build a better future for the growing community.', icon: CreditCard, color: 'from-blue-500 to-cyan-400', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' }
                    ].map((fund, index) => {
                        const Icon = fund.icon;
                        return (
                            <motion.div
                                key={fund.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + (index * 0.1), type: "spring", stiffness: 100 }}
                                whileHover={{ y: -10 }}
                                className="group relative bg-[#111] border border-white/5 hover:border-white/10 p-10 rounded-[2.5rem] shadow-xl text-left overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${fund.color} flex items-center justify-center mb-8 ${fund.glow} transition-transform group-hover:scale-110 group-hover:-rotate-6`}>
                                        <Icon size={28} className="text-[#050505]" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4 font-outfit tracking-tight">{fund.title}</h3>
                                    <p className="text-gray-400 mb-8 leading-relaxed font-light">{fund.desc}</p>

                                    <button
                                        onClick={() => contributionQr ? setShowQr(true) : null}
                                        className="inline-flex w-full items-center justify-between px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5 group/btn"
                                    >
                                        <span className="flex items-center gap-2">
                                            Donate Now <Sparkles size={16} className="text-[#d4af37] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        </span>
                                        <ArrowRight size={20} className="text-[#008f5d] group-hover/btn:translate-x-1 group-hover/btn:text-[#00eb9b] transition-all" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="relative inline-block"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#008f5d] to-[#d4af37] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    <Link href="/login" className="relative inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-950 rounded-full font-black text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 transform">
                        Become a Member
                        <ArrowRight size={22} className="text-[#008f5d]" />
                    </Link>
                </motion.div>
            </div>

            {/* Premium QR Code Modal */}
            <AnimatePresence>
                {showQr && contributionQr && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                        onClick={() => setShowQr(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#111] border border-white/10 rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl relative text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowQr(false)}
                                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors border border-white/5"
                            >
                                <X size={20} />
                            </button>

                            <div className="w-20 h-20 bg-gradient-to-br from-[#008f5d] to-[#00eb9b] text-[#050505] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,143,93,0.3)]">
                                <QrCode size={36} strokeWidth={2} />
                            </div>

                            <h3 className="text-3xl font-black text-white mb-3 font-outfit tracking-tight">Donate via scan</h3>
                            <p className="text-gray-400 mb-8 font-light leading-relaxed text-sm">Scan this secure QR code with any supported payment app to make your contribution.</p>

                            <div className="relative group mx-auto w-full max-w-[280px]">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#008f5d] via-[#d4af37] to-[#00eb9b] rounded-[2.5rem] blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                                <div className="relative bg-white p-6 rounded-[2rem] shadow-2xl overflow-hidden shadow-[0_0_40px_rgba(0,143,93,0.4)]">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/50 pointer-events-none rounded-[2rem]"></div>
                                    <img
                                        src={contributionQr}
                                        alt="Contribution QR Code"
                                        className="w-full aspect-square object-contain relative z-10 drop-shadow-md"
                                    />
                                    <div className="absolute bottom-4 left-0 right-0 text-center z-10 opacity-50 flex justify-center">
                                        <QrCode size={20} className="text-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
