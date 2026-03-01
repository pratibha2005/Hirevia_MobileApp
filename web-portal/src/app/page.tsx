// import Link from "next/link";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";

// export default function Home() {
//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-white bg-grid-pattern px-8 relative overflow-hidden">
//             {/* Ambient glow orbs */}
//             <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary-ch/5 blur-[120px] pointer-events-none" />
//             <div className="absolute bottom-[-100px] right-[10%] w-[300px] h-[300px] rounded-full bg-accent-ch/5 blur-[80px] pointer-events-none" />

//             <main className="max-w-2xl text-center space-y-8 relative z-10">
//                 <div className="flex justify-center mb-8">
//                     <Image src="/assets/Logo.jpg" alt="Hirevia" width={72} height={72} className="rounded-2xl border border-[var(--border)] shadow-lg" />
//                 </div>
//                 <div className="space-y-3">
//                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--primary)]/20 bg-primary-ch/5 mb-2">
//                         <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
//                         <span className="text-xs font-semibold text-teal-500 tracking-widest uppercase">Enterprise ATS Platform</span>
//                     </div>
//                     <h1 className="text-5xl font-extrabold tracking-tight text-blue-900 leading-tight">
//                         Hire smarter with{" "}
//                         <span className="text-teal-500 ">Hirevia</span>
//                     </h1>
//                     <p className="text-[var(--muted-foreground)] text-lg max-w-md mx-auto leading-relaxed">
//                         Enterprise-grade recruitment & applicant tracking, built for high-performance talent teams.
//                     </p>
//                 </div>
//                 <div className="flex gap-4 justify-center pt-4">
//                     <Link href="/login">
//                         <Button size="lg" className="font-semibold px-10 ">Sign In</Button>
//                     </Link>
//                     <Link href="/register">
//                         <Button size="lg" variant="outline" className="font-semibold px-10">Register Company</Button>
//                     </Link>
//                 </div>
//             </main>
//         </div>
//     );
// }












// import Link from "next/link";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";

// export default function Home() {
//     return (
//         <div className="min-h-screen relative overflow-hidden bg-slate-50">

//             {/* ── Diagonal background split ── */}
//             {/* Upper-left panel: teal/navy */}
//             <div
//                 className="absolute inset-0 z-0"
//                 style={{
//                     background: "linear-gradient(135deg, #0f2744 0%, #0f2744 50%, transparent 55%)",
//                 }}
//             />
//             {/* Lower-right panel: light */}
//             <div
//                 className="absolute inset-0 z-0"
//                 style={{
//                     background: "linear-gradient(135deg, transparent 50%, #f0f9f8 50%)",
//                 }}
//             />

//             {/* Subtle grid on light side */}
//             <div
//                 className="absolute inset-0 z-0 opacity-30"
//                 style={{
//                     backgroundImage:
//                         "linear-gradient(#14b8a633 1px, transparent 1px), linear-gradient(90deg, #14b8a633 1px, transparent 1px)",
//                     backgroundSize: "40px 40px",
//                     clipPath: "polygon(55% 0%, 100% 0%, 100% 100%, 0% 100%)",
//                 }}
//             />

//             {/* ── Upper-left: Hero image area ── */}
//             <div className="absolute top-0 left-0 w-[55%] h-full z-10 flex flex-col items-center justify-start pt-16 pr-16">
//                 {/* Decorative circles */}
//                 <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-teal-400/20" />
//                 <div className="absolute top-20 left-20 w-40 h-40 rounded-full border border-teal-400/10" />
//                 <div className="absolute bottom-40 left-6 w-80 h-80 rounded-full border border-blue-300/10" />

//                 {/* Main illustration / image placeholder */}
//                 <div className="relative z-20 flex flex-col items-center gap-6">
//                     {/* Floating card mockups to suggest ATS platform */}
//                     <div className="relative w-80">
//                         {/* Card 1 - back */}
//                         <div className="absolute -top-4 -left-4 w-72 h-36 rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-xl" />
//                         {/* Card 2 - middle */}
//                         <div className="absolute -top-2 left-2 w-72 h-36 rounded-2xl bg-white/15 backdrop-blur border border-white/25 shadow-xl" />
//                         {/* Card 3 - front */}
//                         <div className="relative w-72 h-36 rounded-2xl bg-white/20 backdrop-blur border border-white/30 shadow-2xl p-5 flex flex-col justify-between">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-9 h-9 rounded-full bg-teal-400/80 flex items-center justify-center text-white text-xs font-bold">AK</div>
//                                 <div>
//                                     <div className="h-2.5 w-28 bg-white/60 rounded-full" />
//                                     <div className="h-2 w-20 bg-white/30 rounded-full mt-1.5" />
//                                 </div>
//                                 <div className="ml-auto px-2.5 py-1 rounded-full bg-teal-400/80 text-white text-[10px] font-semibold">Hired</div>
//                             </div>
//                             <div className="space-y-1.5">
//                                 <div className="h-1.5 w-full bg-white/25 rounded-full" />
//                                 <div className="h-1.5 w-4/5 bg-white/25 rounded-full" />
//                             </div>
//                             <div className="flex gap-1.5">
//                                 {["Resume", "Interview", "Offer"].map((s, i) => (
//                                     <div key={s} className={`px-2 py-0.5 rounded text-[9px] font-semibold ${i === 2 ? "bg-teal-400 text-white" : "bg-white/20 text-white/70"}`}>{s}</div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Stats row */}
//                     <div className="flex gap-4 mt-6">
//                         {[
//                             { val: "10k+", label: "Candidates" },
//                             { val: "98%", label: "Satisfaction" },
//                             { val: "3x", label: "Faster Hiring" },
//                         ].map(({ val, label }) => (
//                             <div key={label} className="text-center px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
//                                 <div className="text-xl font-extrabold text-teal-300">{val}</div>
//                                 <div className="text-[10px] text-white/60 mt-0.5 tracking-wide uppercase">{label}</div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* ── Lower-right: CTA area ── */}
//             <div className="absolute top-0 right-0 w-[52%] h-full z-10 flex flex-col items-start justify-center pl-60 pr-12">

//                 {/* Logo */}
//                 <div className="flex items-center gap-3 mb-6">
//                     <Image
//                         src="/assets/Logo.jpg"
//                         alt="Hirevia"
//                         width={52}
//                         height={52}
//                         className="rounded-xl border border-teal-200 shadow-md"
//                     />
//                     <span className="text-slate-500 text-sm font-semibold tracking-widest uppercase">Hirevia</span>
//                 </div>

//                 {/* Badge */}
//                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-50 mb-4">
//                     <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
//                     <span className="text-xs font-semibold text-teal-600 tracking-widest uppercase">Enterprise ATS Platform</span>
//                 </div>

//                 {/* Heading */}
//                 <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-blue-900 leading-tight mb-4">
//                     Hire smarter<br />
//                     with <span className="text-teal-500">Hirevia</span>
//                 </h1>

//                 <p className="text-slate-500 text-base max-w-sm leading-relaxed mb-8">
//                     Enterprise-grade recruitment & applicant tracking, built for high-performance talent teams.
//                 </p>

//                 {/* Buttons */}
//                 <div className="flex gap-4">
//                     <Link href="/login">
//                         <Button size="lg" className="font-semibold px-10 bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-200">
//                             Sign In
//                         </Button>
//                     </Link>
//                     <Link href="/register">
//                         <Button size="lg" variant="outline" className="font-semibold px-10 border-slate-300 text-slate-700 hover:border-teal-400 hover:text-teal-600">
//                             Register Company
//                         </Button>
//                     </Link>
//                 </div>
//             </div>

//         </div>
//     );
// }









import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50">

            {/* ── Diagonal background split ── */}
            {/* Upper-left panel: teal/navy */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "linear-gradient(135deg, #0f2744 0%, #0f2744 50%, transparent 55%)",
                }}
            />
            {/* Lower-right panel: light */}
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
                className="absolute top-0 left-0 w-[55%] h-[115vh] z-10 overflow-hidden"
                style={{ clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)" }}
            >
                <Image
                    src="/assets/downld.png"
                    alt="Hirevia Platform"
                    fill
                    sizes="55vw"
                    className="object-cover object-[25%_center]"
                    priority
                />

                {/* Decorative circles */}
                <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-teal-400/20 pointer-events-none" />
                <div className="absolute top-20 left-20 w-40 h-40 rounded-full border border-teal-400/10 pointer-events-none" />
                <div className="absolute bottom-40 left-6 w-80 h-80 rounded-full border border-blue-300/10 pointer-events-none" />
            </div>

            {/* ── Lower-right: CTA area ── */}
            <div className="absolute top-0 right-0 w-[52%] h-full z-10 flex flex-col items-start justify-center pl-60 pr-12">

                {/* Logo */}
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

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-50 mb-4">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    <span className="text-xs font-semibold text-teal-600 tracking-widest uppercase">
                        Enterprise ATS Platform
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-blue-900 leading-tight mb-4">
                    Hire smarter<br />
                    with <span className="text-teal-500">Hirevia</span>
                </h1>

                <p className="text-slate-500 text-base max-w-sm leading-relaxed mb-8">
                    Enterprise-grade recruitment & applicant tracking, built for high-performance talent teams.
                </p>

                {/* Buttons */}
                <div className="flex gap-4">
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
    );
}