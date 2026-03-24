'use client';

import { motion } from 'framer-motion';
import { Book, Users, HeartHandshake } from 'lucide-react';

const blocks = [
    {
        title: 'Education',
        description: 'Comprehensive Islamic studies for all ages, including Quranic memorization and Tajweed.',
        icon: Book,
        color: 'from-[#008f5d] to-[#00eb9b]',
        glow: 'shadow-[0_0_20px_rgba(0,235,155,0.4)]'
    },
    {
        title: 'Community',
        description: 'Fostering brotherhood and sisterhood through diverse cultural and social events.',
        icon: Users,
        color: 'from-[#d4af37] to-yellow-300',
        glow: 'shadow-[0_0_20px_rgba(212,175,55,0.4)]'
    },
    {
        title: 'Charity',
        description: 'Supporting those in need through Zakat distribution and dedicated welfare programs.',
        icon: HeartHandshake,
        color: 'from-[#20b2aa] to-cyan-300',
        glow: 'shadow-[0_0_20px_rgba(32,178,170,0.4)]'
    }
];

export default function AboutSnippet() {
    return (
        <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
            {/* Background glowing orbs */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[150px] -translate-y-1/2 translate-x-[-20%] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-outfit leading-tight tracking-tight">
                            More Than Just a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eb9b] to-[#008f5d]">Place of Worship</span>
                        </h2>
                        <p className="text-lg text-gray-400 mb-10 leading-relaxed font-light">
                            Izzathul Islam ICC is a beacon of light for the community. We strive to provide comprehensive spiritual, educational, and social services that enrich the lives of Muslims and foster harmony with the broader society.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {blocks.map((block, index) => {
                                const Icon = block.icon;
                                return (
                                    <motion.div
                                        key={block.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 + 0.3 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="group p-6 rounded-3xl bg-[#111] hover:bg-[#151515] border border-white/5 hover:border-white/10 transition-all shadow-xl"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${block.color} flex items-center justify-center mb-5 ${block.glow} transition-transform group-hover:scale-110`}>
                                            <Icon size={24} className="text-[#050505]" strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400">{block.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{block.description}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative h-[650px] rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,143,93,0.15)] border border-white/10 group"
                    >
                        <div className="absolute inset-0 bg-[#000]/30 mix-blend-multiply group-hover:opacity-70 transition-opacity duration-700 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

                        <img
                            src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80"
                            alt="Mosque Interior"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s] ease-out"
                        />

                        {/* Glowing accent borders on the image */}
                        <div className="absolute inset-0 rounded-[3rem] border border-white/5 outline outline-1 outline-[#008f5d]/20 -outline-offset-2 z-20 pointer-events-none" />

                        <div className="absolute bottom-0 left-0 p-10 z-30">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-bold mb-5 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                                Established 1995
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight"
                            >
                                Serving the community for over two decades
                            </motion.h3>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
