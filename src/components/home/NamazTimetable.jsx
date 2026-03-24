'use client';

import { motion } from 'framer-motion';
import { Clock, Sunset, Sun, Sunrise, MoonStar } from 'lucide-react';

const prayers = [
    { name: 'Fajr', time: '05:30 AM', iqamah: '06:00 AM', icon: Sunrise, active: false },
    { name: 'Dhuhr', time: '12:45 PM', iqamah: '01:15 PM', icon: Sun, active: true },
    { name: 'Asr', time: '04:15 PM', iqamah: '04:45 PM', icon: Sun, active: false },
    { name: 'Maghrib', time: '06:10 PM', iqamah: '06:15 PM', icon: Sunset, active: false },
    { name: 'Isha', time: '07:45 PM', iqamah: '08:15 PM', icon: MoonStar, active: false },
];

export default function NamazTimetable() {
    return (
        <section id="timings" className="py-32 bg-[#050505] relative overflow-hidden border-t border-white/5">
            {/* Mind-Blowing Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-[#008f5d] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,143,93,0.15)]"
                    >
                        <Clock className="text-[#d4af37] w-8 h-8" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-6xl font-black text-white mb-6 font-outfit tracking-tight"
                    >
                        Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eb9b] to-[#008f5d]">Prayers</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed"
                    >
                        "Indeed, prayer has been decreed upon the believers a decree of specified times." <br /> <span className="text-emerald-500/80 font-medium">(Surah An-Nisa, 4:103)</span>
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {prayers.map((prayer, index) => {
                        const Icon = prayer.icon;
                        const isNext = prayer.active;
                        return (
                            <motion.div
                                key={prayer.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                                className={`group relative rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 ${isNext
                                    ? 'bg-gradient-to-br from-[#008f5d] to-[#004d33] shadow-[0_10px_40px_rgba(0,143,93,0.4)] border border-[#00eb9b]/30'
                                    : 'bg-[#111111] hover:bg-[#151515] border border-white/5 hover:border-white/10 shadow-lg'
                                    }`}
                            >
                                {/* Hover Glow */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${isNext ? 'from-white/10 to-transparent' : 'from-[#008f5d]/10 to-transparent'}`} />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`p-3 rounded-2xl ${isNext ? 'bg-white/10 text-white' : 'bg-white/5 text-[#008f5d] group-hover:text-[#00eb9b] transition-colors border border-white/5'}`}>
                                            <Icon size={28} strokeWidth={1.5} />
                                        </div>
                                        {isNext && (
                                            <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-white text-[#008f5d] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse">
                                                Next
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={`text-3xl font-bold mb-6 font-outfit tracking-tight ${isNext ? 'text-white' : 'text-gray-100'}`}>{prayer.name}</h3>

                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isNext ? 'text-emerald-100/70' : 'text-gray-500'}`}>Adhan</span>
                                            <span className={`text-xl font-medium tracking-tight ${isNext ? 'text-white' : 'text-gray-300'}`}>{prayer.time}</span>
                                        </div>
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isNext ? 'text-[#d4af37]' : 'text-[#008f5d]'}`}>Iqamah</span>
                                            <span className={`text-xl font-bold tracking-tight ${isNext ? 'text-[#d4af37]' : 'text-white'}`}>{prayer.iqamah}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-[#111] via-[#151515] to-[#111] border border-white/10 rounded-full shadow-2xl backdrop-blur-xl">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d4af37]"></span>
                        </span>
                        <span className="text-gray-300 font-medium tracking-wide">
                            Jumu'ah Prayer: Khutbah <span className="text-white font-bold">1:00 PM</span> | Salah <span className="text-white font-bold">1:30 PM</span>
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
