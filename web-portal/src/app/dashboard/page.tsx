"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, CheckCircle, Clock, ArrowUpRight, Search, Filter, Plus, CalendarClock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_BASE_URL } from '@/lib/apiClient';

interface Job {
    _id: string;
    title: string;
    status: string;
    applicationCount: number;
}

interface Applicant {
    name: string;
    email: string;
}

interface Application {
    _id: string;
    status: string;
    appliedAt: string;
    applicantId?: Applicant;
    jobId?: {
        _id: string;
        title: string;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; companyName?: string } | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [dashboardLoading, setDashboardLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));
    }, [router]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setDashboardLoading(false);
                return;
            }

            try {
                const [jobsRes, appsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/jobs/hr/my`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/api/applications/company`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const jobsData = await jobsRes.json();
                const appsData = await appsRes.json();

                if (jobsData.success) setJobs(jobsData.jobs || []);
                if (appsData.success) setApplications(appsData.applications || []);
            } catch {
                // Keep dashboard stable even if data calls fail.
            } finally {
                setDashboardLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (!user) return null;

    const activeJobs = jobs.filter((job) => job.status === 'Active');
    const activeJobIds = new Set(activeJobs.map((job) => job._id));
    const recentApplicants = [...applications]
        .filter((app) => app.jobId?._id && activeJobIds.has(app.jobId._id))
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
        .slice(0, 6);

    const pendingReviews = applications.filter(
        (app) => app.status === 'New' || app.status === 'Under Review'
    ).length;

    const stats = [
        { title: 'Total Jobs', value: String(jobs.length), icon: Briefcase, trend: `${jobs.length} posted`, tone: 'primary' as const },
        {
            title: 'Active Openings',
            value: String(activeJobs.length),
            icon: CheckCircle,
            trend: `${jobs.length ? Math.round((activeJobs.length / jobs.length) * 100) : 0}% active ratio`,
            tone: 'accent' as const,
        },
        { title: 'Applications', value: String(applications.length), icon: Users, trend: 'All candidates', tone: 'primary' as const },
        { title: 'Pending Reviews', value: String(pendingReviews), icon: Clock, trend: 'Needs attention', tone: 'accent' as const },
    ];

    const statToneStyles = {
        primary: {
            icon: 'bg-[var(--primary)]/25 text-[var(--primary)]',
            chip: 'bg-[var(--primary)]/30 text-[var(--primary)] border border-[var(--primary)]/25',
            orb: 'bg-[rgb(var(--primary-ch)/0.2)]',
            ring: 'border-[var(--primary)]/20',
            line: 'from-[var(--primary)]/45 to-transparent',
        },
        accent: {
            icon: 'bg-[var(--accent)]/25 text-[var(--accent)]',
            chip: 'bg-[var(--accent)]/30 text-[var(--accent)] border border-[var(--accent)]/25',
            orb: 'bg-[rgb(var(--accent-ch)/0.2)]',
            ring: 'border-[var(--accent)]/20',
            line: 'from-[var(--accent)]/45 to-transparent',
        },
    };

    const getStatusStyle = (status: string) => {
        if (status === 'Shortlisted') return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
        if (status === 'Under Review') return 'bg-amber-100 text-amber-700 border border-amber-300';
        if (status === 'Rejected') return 'bg-rose-100 text-rose-700 border border-rose-300';
        if (status === 'New') return 'bg-sky-100 text-sky-700 border border-sky-300';
        return 'bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]';
    };

    return (
        <div className="min-h-screen space-y-8">
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl border border-[var(--border)] subtle-glass p-6 md:p-8"
            >
                <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-3">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                            <CalendarClock size={14} /> Hiring Command Center
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Welcome back, <span className="text-[var(--primary)]">{user.name}</span>
                        </h1>
                        <p className="max-w-2xl text-sm md:text-base text-[var(--muted-foreground)]">
                            Track openings, review candidates, and move hiring stages faster from one unified dashboard.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                        <div className="relative min-w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                            <Input placeholder="Search candidate or role" className="pl-9 bg-[var(--surface)]" />
                        </div>
                        <Button variant="secondary" className="gap-2">
                            <Filter size={16} /> Filter
                        </Button>
                        <Link href="/dashboard/jobs/create">
                            <Button className="gap-2 w-full sm:w-auto">
                                <Plus size={16} /> Post New Job
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, i) => (
                    <motion.article
                        key={stat.title}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className={`group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:glow-effect ${statToneStyles[stat.tone].ring}`}
                    >
                        <div className={`pointer-events-none absolute -right-7 -top-7 h-24 w-24 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-80 ${statToneStyles[stat.tone].orb}`} />
                        <div className="pointer-events-none absolute -left-3 bottom-7 h-10 w-10 rotate-12 rounded-xl border border-[var(--border)]/70 bg-[var(--surface)]/70" />
                        <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${statToneStyles[stat.tone].line}`} />

                        <div className="flex items-start justify-between">
                            <div className={`rounded-xl p-2.5 ${statToneStyles[stat.tone].icon}`}>
                                <stat.icon size={18} />
                            </div>
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statToneStyles[stat.tone].chip}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="mt-5 text-3xl font-bold tracking-tight">{stat.value}</p>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{stat.title}</p>
                    </motion.article>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="xl:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
                >
                    <div className="flex items-center justify-between border-b border-[var(--border)] p-5 md:p-6">
                        <div>
                            <h2 className="text-lg font-bold md:text-xl">Recent Applicants</h2>
                            <p className="text-sm text-[var(--muted-foreground)]">Most recent candidates from active openings</p>
                        </div>
                        <Link href="/dashboard/applications" className="group inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">
                            View all
                            <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                                    <th className="px-5 py-4 font-semibold md:px-6">Candidate</th>
                                    <th className="px-5 py-4 font-semibold md:px-6">Role</th>
                                    <th className="px-5 py-4 font-semibold md:px-6">Status</th>
                                    <th className="px-5 py-4 font-semibold text-right md:px-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {dashboardLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-sm text-[var(--muted-foreground)] md:px-6">
                                            Loading recent applicants...
                                        </td>
                                    </tr>
                                ) : recentApplicants.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-sm text-[var(--muted-foreground)] md:px-6">
                                            No recent candidates from active openings.
                                        </td>
                                    </tr>
                                ) : recentApplicants.map((app) => (
                                    <tr key={app._id} className="hover:bg-[var(--muted)]/40 transition-colors">
                                        <td className="px-5 py-4 md:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/15 font-semibold text-[var(--accent)]">
                                                    {app.applicantId?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[var(--foreground)]">{app.applicantId?.name || 'Unknown Candidate'}</p>
                                                    <p className="text-xs text-[var(--muted-foreground)]">{app.applicantId?.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium md:px-6">{app.jobId?.title || 'Unknown Role'}</td>
                                        <td className="px-5 py-4 md:px-6">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right md:px-6">
                                            <Link href="/dashboard/applications">
                                                <Button variant="ghost" size="sm" className="text-[var(--foreground)]">
                                                    View Application
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <motion.aside
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6"
                >
                    <h3 className="text-lg font-bold">Quick Actions</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">Move faster with one-click hiring tasks.</p>

                    <div className="mt-5 space-y-3">
                        <Link href="/dashboard/jobs/create" className="block rounded-2xl border border-[var(--border)] p-4 hover:bg-[var(--muted)]/40 transition-colors">
                            <p className="text-sm font-semibold">Create a new opening</p>
                            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Publish a fresh role and start receiving applications.</p>
                        </Link>
                        <Link href="/dashboard/interviews" className="block rounded-2xl border border-[var(--border)] p-4 hover:bg-[var(--muted)]/40 transition-colors">
                            <p className="text-sm font-semibold">Schedule interviews</p>
                            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Plan upcoming calls and align interview panel slots.</p>
                        </Link>
                        <Link href="/dashboard/applications" className="block rounded-2xl border border-[var(--border)] p-4 hover:bg-[var(--muted)]/40 transition-colors">
                            <p className="text-sm font-semibold">Review pending profiles</p>
                            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Shortlist strong candidates waiting for feedback.</p>
                        </Link>
                    </div>
                </motion.aside>
            </section>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h4 className="text-base font-semibold">Hiring Velocity</h4>
                        <p className="text-sm text-[var(--muted-foreground)]">Application-to-interview conversion is improving steadily.</p>
                    </div>
                    <div className="w-full max-w-md">
                        <div className="h-2 rounded-full bg-[var(--muted)]">
                            <div className="h-2 w-[72%] rounded-full bg-[var(--primary)]" />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-[var(--muted-foreground)]">72% target completion for this hiring cycle</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}


