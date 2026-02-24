import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] bg-grid-pattern px-8 relative overflow-hidden">
            {/* Ambient glow orbs */}
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary-ch/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[10%] w-[300px] h-[300px] rounded-full bg-accent-ch/5 blur-[80px] pointer-events-none" />

            <main className="max-w-2xl text-center space-y-8 relative z-10">
                <div className="flex justify-center mb-8">
                    <Image src="/assets/Logo.jpg" alt="Hirevia" width={72} height={72} className="rounded-2xl border border-[var(--border)] shadow-lg" />
                </div>
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--primary)]/20 bg-primary-ch/5 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                        <span className="text-xs font-semibold text-[var(--primary)] tracking-widest uppercase">Enterprise ATS Platform</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
                        Hire smarter with{" "}
                        <span className="text-[var(--primary)] text-glow">Hirevia</span>
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-lg max-w-md mx-auto leading-relaxed">
                        Enterprise-grade recruitment & applicant tracking, built for high-performance talent teams.
                    </p>
                </div>
                <div className="flex gap-4 justify-center pt-4">
                    <Link href="/login">
                        <Button size="lg" className="font-semibold px-10 glow-primary">Sign In</Button>
                    </Link>
                    <Link href="/register">
                        <Button size="lg" variant="outline" className="font-semibold px-10">Register Company</Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
