'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sunset, Sun, Sunrise, MoonStar } from 'lucide-react';
import { formatTimeWithOffset } from '@/lib/prayerTimes';

const defaultPrayers = [
    { name: 'Fajr', time: '05:30 AM', iqamah: '05:50 AM', icon: Sunrise, active: false, offset: 20 },
    { name: 'Dhuhr', time: '12:45 PM', iqamah: '01:05 PM', icon: Sun, active: true, offset: 20 },
    { name: 'Asr', time: '04:15 PM', iqamah: '04:30 PM', icon: Sun, active: false, offset: 15 },
    { name: 'Maghrib', time: '06:10 PM', iqamah: '06:15 PM', icon: Sunset, active: false, offset: 5 },
    { name: 'Isha', time: '07:45 PM', iqamah: '08:05 PM', icon: MoonStar, active: false, offset: 20 },
];

export default function NamazTimetable({ apiTimings }) {
    const [activeIndex, setActiveIndex] = useState(-1);

    const prayers = defaultPrayers.map((p, index) => {
        let time24 = "00:00";
        if (apiTimings && apiTimings[p.name]) {
            const rawT = apiTimings[p.name].split(' ')[0];
            const [hr, min] = rawT.split(":").map(Number);
            let totalM = min + 3; // Add 3 minutes Adhan buffer explicitly requested
            let newHr = hr + Math.floor(totalM / 60);
            let newMin = totalM % 60;
            time24 = `${newHr.toString().padStart(2, '0')}:${newMin.toString().padStart(2, '0')}`;
        } else {
            // Fallback 24h array to prevent NaN offsets
            if (p.name === 'Fajr') time24 = "05:30";
            else if (p.name === 'Dhuhr') time24 = "12:45";
            else if (p.name === 'Asr') time24 = "16:15";
            else if (p.name === 'Maghrib') time24 = "18:10";
            else if (p.name === 'Isha') time24 = "19:45";
        }

        return {
            ...p,
            time24,
            time: formatTimeWithOffset(time24, 0),
            iqamah: formatTimeWithOffset(time24, p.offset),
            active: activeIndex === index
        };
    });

    useEffect(() => {
        const updateActivePrayer = () => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            let nextIdx = 0; // Default to Fajr next day
            for (let i = 0; i < prayers.length; i++) {
                const [h, m] = prayers[i].time24.split(":").map(Number);
                const prayerTimeMinutes = h * 60 + m;
                if (prayerTimeMinutes > currentTime) {
                    nextIdx = i;
                    break;
                }
            }
            setActiveIndex(nextIdx);
        };

        updateActivePrayer();
        const interval = setInterval(updateActivePrayer, 60000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiTimings]);

    return (
        <section id="timings" className="py-32 bg-[#050505] relative overflow-hidden border-t border-white/5">
            {/* Mind-Blowing Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-[#065f46] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,143,93,0.15)]"
                    >
                        <Clock className="text-[#f59e0b] w-8 h-8" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-6xl font-black text-white mb-6 font-outfit tracking-tight"
                    >
                        Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#065f46]">Prayers</span>
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
                                    ? 'bg-gradient-to-br from-[#065f46] to-[#004d33] shadow-[0_10px_40px_rgba(0,143,93,0.4)] border border-[#0d9488]/30'
                                    : 'bg-[#111111] hover:bg-[#151515] border border-white/5 hover:border-white/10 shadow-lg'
                                    }`}
                            >
                                {/* Hover Glow */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${isNext ? 'from-white/10 to-transparent' : 'from-[#065f46]/10 to-transparent'}`} />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`p-3 rounded-2xl ${isNext ? 'bg-white/10 text-white' : 'bg-white/5 text-[#065f46] group-hover:text-[#0d9488] transition-colors border border-white/5'}`}>
                                            <Icon size={28} strokeWidth={1.5} />
                                        </div>
                                        {isNext && (
                                            <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-white text-[#065f46] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse">
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
                                            <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isNext ? 'text-[#f59e0b]' : 'text-[#065f46]'}`}>Iqamah</span>
                                            <span className={`text-xl font-bold tracking-tight ${isNext ? 'text-[#f59e0b]' : 'text-white'}`}>{prayer.iqamah}</span>
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
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f59e0b]"></span>
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
