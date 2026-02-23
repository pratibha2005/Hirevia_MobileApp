import React from "react"
import { ShieldCheck } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row">
            {/* Left structural branding panel */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-[var(--primary)] text-[var(--primary-foreground)] p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-16">
                        <ShieldCheck className="w-8 h-8 text-[var(--accent)]" />
                        <h1 className="text-2xl font-bold tracking-tight">Hirevia</h1>
                    </div>
                    <div className="max-w-md mt-auto">
                        <h2 className="text-4xl font-semibold tracking-tight leading-tight mb-6">
                            Enterprise-grade Recruitment & ATS.
                        </h2>
                        <p className="text-[var(--primary-foreground)]/80 text-lg leading-relaxed font-medium">
                            Streamline your hiring process with precision and authority. Designed for high-performance talent acquisition teams.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    )
}
