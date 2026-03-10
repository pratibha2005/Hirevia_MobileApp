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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
                <p className="text-[var(--muted-foreground)] text-sm mt-1">Track your recruitment performance at a glance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Jobs Posted", value: "12", icon: Briefcase, color: "#0F4C5C", bg: "rgba(15, 76, 92, 0.08)" },
                    { title: "Active Jobs", value: "8", icon: CheckCircle, color: "#059669", bg: "rgba(5, 150, 105, 0.08)" },
                    { title: "Total Applications", value: "148", icon: Users, color: "#B7725D", bg: "rgba(183, 114, 93, 0.08)" },
                    { title: "Pending Review", value: "32", icon: Clock, color: "#D97706", bg: "rgba(217, 119, 6, 0.08)" },
                ].map((stat, i) => (
                    <div key={i} className="subtle-glass rounded-xl p-5 flex items-center gap-4 transition-transform hover:-translate-y-0.5 duration-200">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: stat.bg }}>
                            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">{stat.title}</p>
                            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Applications Table */}
            <div className="subtle-glass rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Applications</h2>
                    <Link href="/dashboard/applications" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                        View all
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--background)] text-[var(--muted-foreground)] text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Applicant</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Applied Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                            {[
                                { name: "Alice Johnson", email: "alice@example.com", role: "Frontend Engineer", date: "Today, 10:30 AM", status: "New", statusColor: "bg-blue-50 text-blue-600 border-blue-200" },
                                { name: "Bob Smith", email: "bob.s@example.com", role: "Product Manager", date: "Yesterday, 2:15 PM", status: "Under Review", statusColor: "bg-orange-50 text-orange-600 border-orange-200" },
                                { name: "Charlie Davis", email: "cdavis@example.com", role: "UX Designer", date: "Oct 24, 2023", status: "Shortlisted", statusColor: "bg-emerald-50 text-emerald-600 border-emerald-200" },
                            ].map((app, i) => (
                                <tr key={i} className="hover:bg-[var(--background)] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[var(--foreground)]">{app.name}</div>
                                        <div className="text-xs text-[var(--muted-foreground)]">{app.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[var(--foreground)]">{app.role}</td>
                                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{app.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${app.statusColor}`}>
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
            </div>
        </div>
    );
}
