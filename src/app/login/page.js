
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Phone, User, Lock, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState("citizen");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Redirect based on role
            if (role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/citizen/dashboard");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[url('https://images.unsplash.com/photo-1542204637-e67bc7d41e0e?q=80&w=2667&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-amber-400" />

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4 ring-1 ring-emerald-400/30">
                            <Building2 className="w-8 h-8 text-emerald-100" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 font-outfit">Izzathul Islam ICC</h1>
                        <p className="text-emerald-100/80">Mosque Management System</p>
                    </div>

                    <div className="flex bg-black/20 p-1 rounded-xl mb-6 relative">
                        <div className="absolute inset-0" aria-hidden="true" />
                        {["citizen", "admin"].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={cn(
                                    "flex-1 relative z-10 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg capitalize",
                                    role === r ? "text-emerald-950 shadow-sm" : "text-emerald-100 hover:text-white"
                                )}
                            >
                                {role === r && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-emerald-50 rounded-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {r === "citizen" ? <User size={16} /> : <ShieldCheck size={16} />}
                                    {r}
                                </span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder={role === "citizen" ? "Membership ID or Mobile" : "Username or Mobile"}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-emerald-100/50 focus:bg-white/10 focus:border-emerald-400 transition-all font-inter"
                                    required
                                />
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-emerald-100/50" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-emerald-100/50 focus:bg-white/10 focus:border-emerald-400 transition-all font-inter"
                                    required
                                />
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-100/50" />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="text-amber-300 text-sm text-center bg-amber-500/10 p-2 rounded border border-amber-500/20"
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg shadow-emerald-900/20 border-0"
                            disabled={loading}
                            isLoading={loading}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>

                <div className="bg-emerald-950/30 p-4 text-center border-t border-white/5">
                    <p className="text-xs text-emerald-100/40">© 2026 Izzathul Islam ICC. All rights reserved.</p>
                </div>
            </motion.div>
        </div>
    );
}
