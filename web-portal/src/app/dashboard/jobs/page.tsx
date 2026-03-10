"use client"
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, BriefcaseBusiness, Users, TrendingUp, MapPin, Clock3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from '@/lib/apiClient'

interface Job {
    _id: string
    title: string
    location: string
    applicationCount: number
    status: string
    createdAt: string
}

type StatusFilter = 'All' | 'Active' | 'Draft' | 'Closed'

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
    const [sortBy, setSortBy] = useState<'Newest' | 'Most Applications'>('Newest')

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                setLoading(false)
                return
            }
            try {
                const res = await fetch(`${API_BASE_URL}/api/jobs/hr/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                if (data.success) setJobs(data.jobs)
            } catch { /* ignore */ }
            finally { setLoading(false) }
        }
        fetchJobs()
    }, [])

    const statusColor = (s: string) => {
        if (s === 'Active') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        if (s === 'Draft') return 'bg-amber-100 text-amber-700 border-amber-200'
        if (s === 'Closed') return 'bg-rose-100 text-rose-700 border-rose-200'
        return 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]'
    }

    const filtered = useMemo(() => {
        const bySearch = jobs.filter(j =>
            j.title.toLowerCase().includes(search.toLowerCase()) ||
            j.location.toLowerCase().includes(search.toLowerCase())
        )

        const byStatus = statusFilter === 'All'
            ? bySearch
            : bySearch.filter(j => j.status === statusFilter)

        if (sortBy === 'Most Applications') {
            return [...byStatus].sort((a, b) => b.applicationCount - a.applicationCount)
        }

        return [...byStatus].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }, [jobs, search, statusFilter, sortBy])

    const stats = useMemo(() => {
        const active = jobs.filter(j => j.status === 'Active').length
        const draft = jobs.filter(j => j.status === 'Draft').length
        const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0)
        return { active, draft, totalApplications }
    }, [jobs])

    const handleClose = async (id: string, current: string) => {
        const token = localStorage.getItem('token')
        if (!token) return
        const newStatus = current === 'Active' ? 'Closed' : 'Active'
        try {
            await fetch(`${API_BASE_URL}/api/jobs/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus }),
            })
            setJobs(prev => prev.map(j => j._id === id ? { ...j, status: newStatus } : j))
        } catch {
            // Keep UI stable if the status update call fails.
        }
    }

    const maxApplications = Math.max(...jobs.map(j => j.applicationCount || 0), 1)

    return (
        <div className="relative space-y-7 animate-in fade-in duration-500">
            <div className="pointer-events-none absolute -top-12 -right-16 h-40 w-40 rounded-full bg-[var(--primary)]/20 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
            <div className="pointer-events-none absolute top-20 -left-16 h-40 w-40 rounded-full bg-[var(--accent)]/20 blur-3xl animate-[float_11s_ease-in-out_infinite]" />

            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-grid-pattern bg-[var(--surface)] p-6 md:p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/[0.08] via-transparent to-[var(--accent)]/[0.1]" />
                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--foreground)]">My Jobs</h1>
                        <p className="mt-2 text-[var(--muted-foreground)] max-w-xl">Manage your open positions and track their performance.</p>
                    </div>
                    <Link href="/dashboard/jobs/create">
                        <Button className="gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                            <Plus className="w-4 h-4" />
                            Post New Job
                        </Button>
                    </Link>
                </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <article className="subtle-glass rounded-2xl p-4 md:p-5 hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Open Jobs</p>
                        <BriefcaseBusiness className="h-4 w-4 text-[var(--primary)]" />
                    </div>
                    <p className="mt-2 text-3xl font-black text-[var(--foreground)]">{stats.active}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">Currently accepting applications</p>
                </article>

                <article className="subtle-glass rounded-2xl p-4 md:p-5 hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Draft Jobs</p>
                        <Clock3 className="h-4 w-4 text-[var(--accent)]" />
                    </div>
                    <p className="mt-2 text-3xl font-black text-[var(--foreground)]">{stats.draft}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">Needs review before publishing</p>
                </article>

                <article className="subtle-glass rounded-2xl p-4 md:p-5 hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Applications</p>
                        <TrendingUp className="h-4 w-4 text-[var(--primary)]" />
                    </div>
                    <p className="mt-2 text-3xl font-black text-[var(--foreground)]">{stats.totalApplications}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">Across all job listings</p>
                </article>
            </section>

            <div className="subtle-glass rounded-2xl overflow-hidden">
                <div className="p-4 md:p-5 border-b border-[var(--border)] bg-[var(--surface)] space-y-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-2 rounded-md w-full lg:max-w-md border border-[var(--border)] focus-within:border-[var(--primary)] transition-colors">
                            <Search className="w-4 h-4 mr-2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title or location..."
                                className="bg-transparent border-none outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Sort</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'Newest' | 'Most Applications')}
                                className="rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                            >
                                <option value="Newest">Newest</option>
                                <option value="Most Applications">Most Applications</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {(['All', 'Active', 'Draft', 'Closed'] as StatusFilter[]).map(status => {
                            const active = statusFilter === status
                            return (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${active
                                        ? 'bg-[var(--foreground)] text-white border-[var(--foreground)] shadow-md'
                                        : 'bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--foreground)]'
                                        }`}
                                >
                                    {status}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="p-4 md:p-5 bg-[var(--surface)]">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="rounded-xl border border-[var(--border)] p-4 animate-pulse space-y-3">
                                    <div className="h-5 w-1/2 bg-[var(--muted)] rounded" />
                                    <div className="h-4 w-1/3 bg-[var(--muted)] rounded" />
                                    <div className="h-2 w-full bg-[var(--muted)] rounded" />
                                    <div className="h-4 w-1/4 bg-[var(--muted)] rounded" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16 rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/35">
                            <p className="text-lg font-semibold text-[var(--foreground)]">No jobs found</p>
                            <p className="text-[var(--muted-foreground)] mt-2">
                                {jobs.length === 0
                                    ? 'No jobs posted yet. Start with your first listing.'
                                    : 'Try a different search or status filter.'}
                            </p>
                            {jobs.length === 0 && (
                                <Link href="/dashboard/jobs/create" className="inline-block mt-5">
                                    <Button className="gap-2 bg-[var(--foreground)] text-white hover:opacity-90">
                                        <Plus className="h-4 w-4" /> Post New Job
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filtered.map((job, index) => {
                                const progress = Math.round(((job.applicationCount || 0) / maxApplications) * 100)
                                return (
                                    <article
                                        key={job._id}
                                        className="group rounded-xl border border-[var(--border)] bg-white p-4 md:p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                                        style={{ animation: `slideFade 380ms ease ${index * 50}ms both` }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h2 className="text-lg font-bold text-[var(--foreground)] leading-tight group-hover:text-[var(--accent)] transition-colors">{job.title}</h2>
                                                <p className="text-xs text-[var(--muted-foreground)] mt-1 inline-flex items-center gap-1">
                                                    <Clock3 className="h-3.5 w-3.5" />
                                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColor(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between text-sm">
                                            <p className="text-[var(--muted-foreground)] inline-flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-[var(--accent)]" />
                                                {job.location}
                                            </p>
                                            <p className="text-[var(--foreground)] font-semibold inline-flex items-center gap-1.5">
                                                <Users className="h-4 w-4 text-[var(--primary)]" />
                                                {job.applicationCount} applicants
                                            </p>
                                        </div>

                                        <div className="mt-4">
                                            {/* <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                                                    style={{ width: `${Math.max(progress, 6)}%` }}
                                                />
                                            </div> */}
                                            {/* <p className="text-[11px] text-[var(--muted-foreground)] mt-1">Performance score: {progress}%</p> */}
                                        </div>

                                        <div className="mt-5 flex items-center justify-between">
                                            <button
                                                onClick={() => handleClose(job._id, job.status)}
                                                className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--accent)] transition-colors"
                                            >
                                                {job.status === 'Active' ? 'Close Position' : 'Reopen Position'}
                                            </button>
                                            <Link href="/dashboard/applications" className="text-sm font-semibold text-[var(--accent)] hover:underline">
                                                View Applications
                                            </Link>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes slideFade {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}
