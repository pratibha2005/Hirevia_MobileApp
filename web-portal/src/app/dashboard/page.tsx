"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string, companyName?: string } | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));
    }, [router]);

    if (!user) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Overview</h1>
                <p className="text-[var(--muted-foreground)]">Here is what is happening with your recruitment today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Jobs Posted", value: "12", icon: Briefcase, color: "text-blue-400", bg: "bg-blue-900/30" },
                    { title: "Active Jobs", value: "8", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-900/40" },
                    { title: "Total Applications", value: "148", icon: Users, color: "text-[var(--primary)]", bg: "bg-cyan-950/50" },
                    { title: "Pending Review", value: "32", icon: Clock, color: "text-orange-400", bg: "bg-orange-900/30" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-xl subtle-glass flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md duration-200">
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--muted-foreground)]">{stat.title}</p>
                            <p className="text-2xl font-bold text-[var(--foreground)] mt-0.5">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Applications Table */}
            <div className="subtle-glass rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Applications</h2>
                    <Link href="/dashboard/applications" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                        View all
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-lg">Applicant</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Applied Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right rounded-tr-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                            {[
                                { name: "Alice Johnson", email: "alice@example.com", role: "Frontend Engineer", date: "Today, 10:30 AM", status: "New", statusColor: "bg-blue-900/40 text-blue-400" },
                                { name: "Bob Smith", email: "bob.s@example.com", role: "Product Manager", date: "Yesterday, 2:15 PM", status: "Under Review", statusColor: "bg-orange-900/40 text-orange-400" },
                                { name: "Charlie Davis", email: "cdavis@example.com", role: "UX Designer", date: "Oct 24, 2023", status: "Shortlisted", statusColor: "bg-emerald-900/40 text-emerald-400" },
                            ].map((app, i) => (
                                <tr key={i} className="hover:bg-muted-ch/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[var(--foreground)]">{app.name}</div>
                                        <div className="text-xs text-[var(--muted-foreground)]">{app.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{app.role}</td>
                                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{app.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${app.statusColor}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[var(--primary)] font-medium hover:underline text-sm">Review</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Empty state example (commented out but ready) */}
                {/* <div className="p-12 text-center text-[var(--muted-foreground)]">
                    <Users className="w-12 h-12 mx-auto opacity-20 mb-4" />
                    <p className="text-lg font-medium text-[var(--foreground)]">No applications yet</p>
                    <p className="text-sm mt-1">When candidates apply to your jobs, they will appear here.</p>
                </div> */}
            </div>
        </div>
    );
}
