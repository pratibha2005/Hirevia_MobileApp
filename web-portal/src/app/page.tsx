
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="bg-slate-50 scroll-smooth">
            <section className="min-h-screen relative overflow-hidden">

                {/* ── Diagonal background split ── */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: "linear-gradient(135deg, #0f2744 0%, #0f2744 50%, transparent 55%)",
                    }}
                />
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: "linear-gradient(135deg, transparent 50%, #f0f9f8 50%)",
                    }}
                />

                {/* Subtle grid on light side */}
                <div
                    className="absolute inset-0 z-0 opacity-30"
                    style={{
                        backgroundImage:
                            "linear-gradient(#14b8a633 1px, transparent 1px), linear-gradient(90deg, #14b8a633 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                        clipPath: "polygon(55% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    }}
                />

                {/* ── Upper-left: Hero image area ── */}
                <div
                    className="absolute top-0 left-0 w-[58%] h-[110vh] z-10 overflow-hidden hidden md:block"
                    style={{ clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)" }}
                >
                    <Image
                        src="/assets/downld.png"
                        alt="Hirevia Platform"
                        fill
                        sizes="58vw"
                        className="object-cover object-[25%_center]"
                        priority
                    />

                    <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-teal-400/20 pointer-events-none" />
                    <div className="absolute top-20 left-20 w-40 h-40 rounded-full border border-teal-400/10 pointer-events-none" />
                    <div className="absolute bottom-40 left-6 w-80 h-80 rounded-full border border-blue-300/10 pointer-events-none" />
                </div>

                {/* Mobile hero image */}
                <div className="absolute inset-0 z-10 md:hidden">
                    <Image
                        src="/assets/downld.png"
                        alt="Hirevia Platform"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-25"
                        priority
                    />
                </div>

                {/* ── Lower-right: CTA area ── */}
               <div className="relative z-20 min-h-screen flex items-center justify-end pl-60 pr-4 py-16 md:pr-6 lg:pr-12 -mr-32" >
                   <div className="w-full max-w-xl md:max-w-md lg:max-w-lg ml-auto mr-0">
                        <div className="flex items-center gap-3 mb-6">
                            <Image
                                src="/assets/Logo.jpg"
                                alt="Hirevia"
                                width={52}
                                height={52}
                                className="rounded-xl border border-teal-200 shadow-md"
                            />
                            <span className="text-slate-500 text-sm font-semibold tracking-widest uppercase">
                                Hirevia
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-50 mb-4">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                            <span className="text-xs font-semibold text-teal-600 tracking-widest uppercase">
                                Enterprise ATS Platform
                            </span>
                        </div>

                        <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-blue-900 leading-tight mb-4">
                            Hire smarter<br />
                            with <span className="text-teal-500">Hirevia</span>
                        </h1>

                        <p className="text-slate-600 text-base max-w-md leading-relaxed mb-8">
                            Enterprise-grade recruitment and applicant tracking, built for high-performance talent teams.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/login">
                                <Button
                                    size="lg"
                                    className="font-semibold px-10 bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-200"
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="font-semibold px-10 border-slate-300 text-slate-700 hover:border-teal-400 hover:text-teal-600"
                                >
                                    Register Company
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Indeed-style scrollable recruiter sections */}
            <section className="relative overflow-hidden bg-white py-24 px-6 md:px-12 lg:px-20">
                <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-200/35 blur-3xl animate-pulse" />
                <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-sky-200/35 blur-3xl animate-pulse [animation-delay:900ms]" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            "linear-gradient(#0f766e14 1px, transparent 1px), linear-gradient(90deg, #0f766e14 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />

                <div className="relative max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/90 px-4 py-1.5 mb-4">
                        <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
                        <p className="text-teal-700 font-semibold tracking-[0.18em] uppercase text-[11px]">Why Recruiters Choose Hirevia</p>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight max-w-3xl">
                        Post jobs faster, screen applicants better, and hire with confidence.
                    </h2>
                    <p className="text-slate-600 mt-4 max-w-2xl leading-relaxed">
                        Built for high-volume teams that need speed, clarity, and a hiring flow that feels effortless from first application to final offer.
                    </p>

                    <div className="grid gap-6 mt-12 md:grid-cols-3">
                        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-100">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400" />
                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                <span className="text-lg">AI</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Matching</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Automatically rank top-fit candidates using skills, experience, and intent signals.</p>
                            <div className="mt-5 h-1.5 w-20 rounded-full bg-teal-100 transition-all duration-500 group-hover:w-28 group-hover:bg-teal-300" />
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-100 md:translate-y-4">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400" />
                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                <span className="text-lg">PI</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Pipeline Visibility</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Track every applicant stage from applied to offer with clear recruiter dashboards.</p>
                            <div className="mt-5 h-1.5 w-20 rounded-full bg-cyan-100 transition-all duration-500 group-hover:w-28 group-hover:bg-cyan-300" />
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-100">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400" />
                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                <span className="text-lg">GO</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Faster Outreach</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Send personalized interview invites and reminders in minutes, not hours.</p>
                            <div className="mt-5 h-1.5 w-20 rounded-full bg-sky-100 transition-all duration-500 group-hover:w-28 group-hover:bg-sky-300" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-slate-950 via-[#0f2744] to-slate-900 text-white">
                <div className="pointer-events-none absolute -top-24 left-10 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl animate-pulse" />
                <div className="pointer-events-none absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl animate-pulse [animation-delay:1000ms]" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 20%, #5eead422 0, transparent 45%), radial-gradient(circle at 80% 80%, #38bdf822 0, transparent 40%)",
                    }}
                />

                <div className="relative max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/40 bg-white/5 px-4 py-1.5 mb-4 backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-teal-300 animate-ping" />
                            <p className="text-teal-200 font-semibold tracking-[0.18em] uppercase text-[11px]">Recruiter Workflow</p>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
                            Everything you need to hire, in one clean flow.
                        </h2>
                        <p className="text-slate-200 leading-relaxed max-w-xl">
                            Build role pages, receive applications, schedule interviews, and move candidates forward with a single platform.
                        </p>

                        <div className="mt-8 flex items-center gap-4">
                            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 animate-pulse" />
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Fast. Structured. Scalable.</p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="pointer-events-none absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-teal-300/0 via-teal-300/60 to-cyan-300/0" />
                        <div className="grid gap-4">
                            <div className="animate-workflow-float">
                                <div className="group relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/15 hover:shadow-2xl hover:shadow-teal-900/30">
                                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-teal-300/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-teal-200/60 bg-teal-300/20 text-xs font-bold text-teal-100">1</div>
                                        <div>
                                            <p className="text-teal-300 text-xs font-semibold tracking-widest uppercase mb-2">Step 1</p>
                                            <p className="font-semibold">Create and publish jobs in under 2 minutes.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="animate-workflow-float [animation-delay:0.9s] md:translate-x-4">
                                <div className="group relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/15 hover:shadow-2xl hover:shadow-cyan-900/30">
                                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-200/60 bg-cyan-300/20 text-xs font-bold text-cyan-100">2</div>
                                        <div>
                                            <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase mb-2">Step 2</p>
                                            <p className="font-semibold">Filter and shortlist applicants using AI-ready scoring.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="animate-workflow-float [animation-delay:1.8s]">
                                <div className="group relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/15 hover:shadow-2xl hover:shadow-blue-900/30">
                                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-300/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-blue-200/60 bg-blue-300/20 text-xs font-bold text-blue-100">3</div>
                                        <div>
                                            <p className="text-blue-300 text-xs font-semibold tracking-widest uppercase mb-2">Step 3</p>
                                            <p className="font-semibold">Schedule interviews and close top talent faster.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#e8fbf7] via-[#f3fffd] to-[#ebf6ff]">
                <div className="pointer-events-none absolute -top-24 left-0 h-80 w-80 rounded-full bg-teal-300/40 blur-3xl animate-pulse" />
                <div className="pointer-events-none absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-cyan-300/35 blur-3xl animate-pulse [animation-delay:800ms]" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-35"
                    style={{
                        backgroundImage:
                            "linear-gradient(#0f766e14 1px, transparent 1px), linear-gradient(90deg, #0f766e14 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                    }}
                />

                <div className="relative max-w-6xl mx-auto">
                    <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between mb-10">
                        <div>
                            <p className="text-teal-700 font-semibold tracking-[0.2em] uppercase text-[11px]">Hiring Outcomes</p>
                            <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-2">Numbers that prove recruiter velocity</h3>
                        </div>
                        <p className="text-slate-600 max-w-md text-sm md:text-base">From first outreach to final scheduling, Hirevia compresses cycle time and keeps your team moving.</p>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 px-5 py-8 shadow-[0_28px_80px_-45px_rgba(14,116,144,0.55)] backdrop-blur-sm md:px-8 lg:px-10">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400" />

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="group text-center lg:text-left transition-transform duration-500 hover:-translate-y-1">
                                <p className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">3x</p>
                                <p className="text-xs uppercase tracking-[0.18em] text-teal-700/80 mt-1">Efficiency Gain</p>
                                <p className="text-sm text-slate-600 mt-3">faster shortlist creation</p>
                            </div>

                            <div className="group text-center lg:text-left transition-transform duration-500 hover:-translate-y-1 lg:border-l lg:border-slate-200 lg:pl-6">
                                <p className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-cyan-700 to-sky-600 bg-clip-text text-transparent">70%</p>
                                <p className="text-xs uppercase tracking-[0.18em] text-cyan-700/80 mt-1">Time Saved</p>
                                <p className="text-sm text-slate-600 mt-3">lower scheduling effort</p>
                            </div>

                            <div className="group text-center lg:text-left transition-transform duration-500 hover:-translate-y-1 lg:border-l lg:border-slate-200 lg:pl-6">
                                <p className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-sky-700 to-blue-600 bg-clip-text text-transparent">92%</p>
                                <p className="text-xs uppercase tracking-[0.18em] text-sky-700/80 mt-1">Engagement</p>
                                <p className="text-sm text-slate-600 mt-3">candidate response rate</p>
                            </div>

                            <div className="group text-center lg:text-left transition-transform duration-500 hover:-translate-y-1 lg:border-l lg:border-slate-200 lg:pl-6">
                                <p className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">24/7</p>
                                <p className="text-xs uppercase tracking-[0.18em] text-emerald-700/80 mt-1">Live Tracking</p>
                                <p className="text-sm text-slate-600 mt-3">pipeline visibility</p>
                            </div>
                        </div>

                        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                        <p className="mt-5 text-center text-xs uppercase tracking-[0.18em] text-slate-500">Built for recruiter teams scaling with speed and precision</p>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden py-24 px-6 md:px-12 lg:px-20 bg-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,#14b8a61a_0,transparent_35%),radial-gradient(circle_at_80%_80%,#0ea5e91a_0,transparent_35%)]" />
                <div className="pointer-events-none absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full border border-teal-200/60 animate-pulse" />

                <div className="relative max-w-5xl mx-auto">
                    <div className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-b from-white via-white to-teal-50/60 p-8 md:p-12 shadow-[0_35px_90px_-40px_rgba(20,184,166,0.45)]">
                        <div className="max-w-4xl mx-auto text-center">
                            <p className="text-teal-700 font-semibold tracking-[0.22em] uppercase text-[11px] mb-3">Ready To Hire Better</p>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                                Start building your recruiter pipeline today.
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                                Keep your current Hirevia look at the top, and now scroll down to discover a richer recruiter journey inspired by modern hiring homepages.
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/register">
                                    <Button size="lg" className="group font-semibold px-10 bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 hover:from-teal-600 hover:via-cyan-600 hover:to-sky-600 text-white shadow-xl shadow-cyan-200 transition-all duration-500 hover:-translate-y-1">
                                        <span className="transition-transform duration-500 group-hover:translate-x-0.5">Start Hiring</span>
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="lg" variant="outline" className="font-semibold px-10 border-slate-300 bg-white/80 text-slate-700 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50 transition-all duration-500 hover:-translate-y-1">
                                        Recruiter Sign In
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
                                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />No setup friction</p>
                                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse [animation-delay:400ms]" />Built for fast teams</p>
                                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse [animation-delay:800ms]" />Enterprise-ready workflow</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-950 px-6 py-12 md:px-12 lg:px-20">
                <div className="pointer-events-none absolute -top-16 left-1/4 h-44 w-44 rounded-full bg-teal-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 right-1/4 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />

                <div className="relative mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-white text-2xl font-extrabold tracking-tight">Hirevia</p>
                        <p className="mt-2 max-w-md text-sm text-slate-300">Enterprise-grade hiring platform for modern recruitment teams.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 text-sm text-slate-300">
                        <Link href="/login" className="transition-colors hover:text-teal-300">Sign In</Link>
                        <Link href="/register" className="transition-colors hover:text-teal-300">Register</Link>
                        <Link href="/dashboard" className="transition-colors hover:text-teal-300">Dashboard</Link>
                    </div>
                </div>

                <div className="relative mx-auto mt-8 flex max-w-6xl flex-col gap-3 border-t border-slate-800 pt-5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
                    <p>© {new Date().getFullYear()} Hirevia. All rights reserved.</p>
                    <p className="uppercase tracking-[0.16em]">Fast Hiring. Better Teams.</p>
                </div>
            </footer>
        </main>
    );
}