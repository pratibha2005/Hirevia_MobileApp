// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Briefcase, Users, CheckCircle, Clock } from 'lucide-react';
// import Link from 'next/link';

// export default function DashboardPage() {
//     const router = useRouter();
//     const [user, setUser] = useState<{ name: string, companyName?: string } | null>(null);

//     useEffect(() => {
//         const userData = localStorage.getItem('user');
//         if (!userData) {
//             router.push('/login');
//             return;
//         }
//         setUser(JSON.parse(userData));
//     }, [router]);

//     if (!user) return null;

//     return (
//         <div className="space-y-8 animate-in fade-in duration-500">
//             <div>
//                 <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Overview</h1>
//                 <p className="text-[var(--muted-foreground)]">Here is what is happening with your recruitment today.</p>
//             </div>

//             {/* Stats Cards */}
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//                 {[
//                     { title: "Total Jobs Posted", value: "12", icon: Briefcase, color: "text-blue-400", bg: "bg-blue-900/30" },
//                     { title: "Active Jobs", value: "8", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-900/40" },
//                     { title: "Total Applications", value: "148", icon: Users, color: "text-[var(--primary)]", bg: "bg-cyan-950/50" },
//                     { title: "Pending Review", value: "32", icon: Clock, color: "text-orange-400", bg: "bg-orange-900/30" },
//                 ].map((stat, i) => (
//                     <div key={i} className="p-6 rounded-xl subtle-glass flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md duration-200">
//                         <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
//                             <stat.icon className="w-6 h-6" />
//                         </div>
//                         <div>
//                             <p className="text-sm font-medium text-[var(--muted-foreground)]">{stat.title}</p>
//                             <p className="text-2xl font-bold text-[var(--foreground)] mt-0.5">{stat.value}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Recent Applications Table */}
//             <div className="subtle-glass rounded-xl overflow-hidden">
//                 <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Applications</h2>
//                     <Link href="/dashboard/applications" className="text-sm font-semibold text-[var(--primary)] hover:underline">
//                         View all
//                     </Link>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs uppercase font-semibold tracking-wider">
//                             <tr>
//                                 <th className="px-6 py-4 rounded-tl-lg">Applicant</th>
//                                 <th className="px-6 py-4">Role</th>
//                                 <th className="px-6 py-4">Applied Date</th>
//                                 <th className="px-6 py-4">Status</th>
//                                 <th className="px-6 py-4 text-right rounded-tr-lg">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
//                             {[
//                                 { name: "Alice Johnson", email: "alice@example.com", role: "Frontend Engineer", date: "Today, 10:30 AM", status: "New", statusColor: "bg-blue-900/40 text-blue-400" },
//                                 { name: "Bob Smith", email: "bob.s@example.com", role: "Product Manager", date: "Yesterday, 2:15 PM", status: "Under Review", statusColor: "bg-orange-900/40 text-orange-400" },
//                                 { name: "Charlie Davis", email: "cdavis@example.com", role: "UX Designer", date: "Oct 24, 2023", status: "Shortlisted", statusColor: "bg-emerald-900/40 text-emerald-400" },
//                             ].map((app, i) => (
//                                 <tr key={i} className="hover:bg-muted-ch/50 transition-colors">
//                                     <td className="px-6 py-4">
//                                         <div className="font-semibold text-[var(--foreground)]">{app.name}</div>
//                                         <div className="text-xs text-[var(--muted-foreground)]">{app.email}</div>
//                                     </td>
//                                     <td className="px-6 py-4 font-medium">{app.role}</td>
//                                     <td className="px-6 py-4 text-[var(--muted-foreground)]">{app.date}</td>
//                                     <td className="px-6 py-4">
//                                         <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${app.statusColor}`}>
//                                             {app.status}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-right">
//                                         <button className="text-[var(--primary)] font-medium hover:underline text-sm">Review</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 {/* Empty state example (commented out but ready) */}
//                 {/* <div className="p-12 text-center text-[var(--muted-foreground)]">
//                     <Users className="w-12 h-12 mx-auto opacity-20 mb-4" />
//                     <p className="text-lg font-medium text-[var(--foreground)]">No applications yet</p>
//                     <p className="text-sm mt-1">When candidates apply to your jobs, they will appear here.</p>
//                 </div> */}
//             </div>
//         </div>
//     );
// }










"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, CheckCircle, Clock, ArrowUpRight, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; companyName?: string } | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));
    }, [router]);

    if (!user) return null;

    const stats = [
        { title: "Total Jobs", value: "12", icon: Briefcase, color: "from-blue-500 to-cyan-400", trend: "+2 this week" },
        { title: "Active", value: "8", icon: CheckCircle, color: "from-emerald-500 to-teal-400", trend: "Stable" },
        { title: "Applications", value: "148", icon: Users, color: "from-violet-500 to-purple-400", trend: "+24% increase" },
        { title: "Pending", value: "32", icon: Clock, color: "from-orange-500 to-amber-400", trend: "Action required" },
    ];

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-10 max-w-7xl mx-auto selection:bg-purple-500/30">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--foreground)] to-gray-500 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h1>
                    <p className="text-[var(--muted-foreground)] mt-2 font-medium">
                        Welcome back, <span className="text-[var(--primary)]">@{user.name}</span>. Focus on your top talent today.
                    </p>
                </motion.div>
                
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--border)] transition-all flex items-center gap-2 text-sm font-semibold border border-[var(--border)]">
                        <Filter size={16} /> Filters
                    </button>
                    <button className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-all flex items-center gap-2 text-sm font-semibold shadow-lg shadow-purple-500/20">
                        Post New Job
                    </button>
                </div>
            </header>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="relative group p-6 rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-transparent overflow-hidden"
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                        
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] px-2 py-1 rounded-full bg-[var(--muted)]">
                                {stat.trend}
                            </span>
                        </div>
                        
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">{stat.title}</h3>
                            <p className="text-3xl font-bold mt-1 tracking-tighter">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Table Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm overflow-hidden"
            >
                <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Recent Applicants</h2>
                        <p className="text-sm text-[var(--muted-foreground)]">Latest 50 candidates sorted by date</p>
                    </div>
                    <Link href="/dashboard/applications" className="group flex items-center gap-1 text-sm font-bold text-[var(--primary)]">
                        Explore All <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[var(--muted-foreground)] text-xs uppercase tracking-widest border-b border-[var(--border)]">
                                <th className="px-8 py-5 font-semibold">Candidate</th>
                                <th className="px-8 py-5 font-semibold">Position</th>
                                <th className="px-8 py-5 font-semibold">Status</th>
                                <th className="px-8 py-5 font-semibold text-right">Resume</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {[
                                { name: "Alice Johnson", email: "alice@ux.com", role: "Frontend Lead", status: "Interviewing", color: "text-blue-400 bg-blue-500/10" },
                                { name: "Bob Smith", email: "bob@dev.io", role: "Product Manager", status: "Review", color: "text-amber-400 bg-amber-500/10" },
                                { name: "Charlie Davis", email: "charlie@design.com", role: "UI Designer", status: "Hired", color: "text-emerald-400 bg-emerald-500/10" },
                            ].map((app, i) => (
                                <tr key={i} className="group hover:bg-[var(--muted)]/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                                                {app.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[var(--foreground)]">{app.name}</div>
                                                <div className="text-xs text-[var(--muted-foreground)]">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium tracking-tight">{app.role}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase ${app.color}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--foreground)] text-[var(--background)] px-4 py-1.5 rounded-full text-xs font-bold shadow-xl">
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}