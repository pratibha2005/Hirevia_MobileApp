import React from "react"
import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row">
            {/* Left structural branding panel */}
            <div className="hidden md:flex flex-col justify-between w-[45%] lg:w-[42%] text-white p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #0B1729 0%, #060D18 60%, #081420 100%)' }}>

                {/* Grid texture */}
                <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

                {/* Top-right ambient glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-ch/5 blur-[100px] pointer-events-none" />
                {/* Bottom-left accent glow */}
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent-ch/5 blur-[80px] pointer-events-none" />

                {/* Vertical accent line on right edge */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary-ch/30 to-transparent" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <Image src="/assets/Logo.jpg" alt="Hirevia Logo" width={40} height={40} className="rounded-lg border border-primary-ch/20" />
                        <div>
                            <h1 className="text-xl font-bold tracking-[0.15em] uppercase text-[var(--foreground)]">Hirevia</h1>
                            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[var(--primary)]/70">HR Portal</p>
                        </div>
                    </div>

                    {/* Feature highlights */}
                    <div className="mt-auto space-y-8">
                        <div>
                            <h2 className="text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.1] mb-5 text-[var(--foreground)]">
                                Enterprise-grade<br />
                                <span className="text-[var(--primary)] text-glow">Recruitment & ATS.</span>
                            </h2>
                            <p className="text-[var(--muted-foreground)] text-base leading-relaxed font-medium max-w-sm">
                                Streamline hiring with precision. Built for high-performance talent acquisition teams.
                            </p>
                        </div>

                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-2">
                            {['AI Screening', 'Pipeline Tracking', 'Team Collaboration', 'Analytics'].map((f) => (
                                <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-primary-ch/20 bg-primary-ch/8 text-[var(--primary)]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-[var(--background)] bg-grid-pattern">
                {/* Ambient center glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-ch/3 via-transparent to-accent-ch/3 pointer-events-none" />
                <div className="w-full max-w-[440px] relative z-10">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 mb-8 md:hidden">
                        <Image src="/assets/Logo.jpg" alt="Hirevia Logo" width={36} height={36} className="rounded-lg" />
                        <span className="text-lg font-bold tracking-widest uppercase text-[var(--foreground)]">Hirevia</span>
                    </div>
                    <div className="bg-[var(--surface)] p-10 rounded-2xl glow-effect border border-[var(--border)]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
