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
        if (s === 'Active') return 'bg-emerald-50 text-emerald-600 border-emerald-200'
        if (s === 'Draft') return 'bg-orange-50 text-orange-600 border-orange-200'
        return 'bg-gray-50 text-gray-600 border-gray-200'
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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Jobs</h1>
                    <p className="text-[var(--muted-foreground)] text-sm mt-1">Manage your open positions and track performance</p>
                </div>
            </div>

            <div className="subtle-glass rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[var(--border)] flex items-center justify-between gap-4 bg-[var(--surface)]">
                    <div className="flex items-center text-sm text-[var(--muted-foreground)] bg-[var(--background)] px-3 py-2 rounded-lg w-full max-w-md border border-[var(--border)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/10 transition-colors">
                        <Search className="w-4 h-4 mr-2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by job title or location..."
                            className="bg-transparent border-none outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--background)] text-[var(--muted-foreground)] text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Job Title</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3 text-center">Applications</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted-foreground)]">Loading jobs...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                                        {jobs.length === 0 ? 'No jobs posted yet. Click "Post New Job" to create your first listing.' : 'No jobs match your search.'}
                                    </td>
                                </tr>
                            ) : filtered.map((job) => (
                                <tr key={job._id} className="hover:bg-[var(--background)] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[var(--foreground)]">{job.title}</div>
                                        <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--muted-foreground)] font-medium">{job.location}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-semibold text-sm">
                                            {job.applicationCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColor(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button
                                            onClick={() => handleClose(job._id, job.status)}
                                            className="text-[var(--primary)] font-medium hover:underline text-sm"
                                        >
                                            {job.status === 'Active' ? 'Close' : 'Reopen'}
                                        </button>
                                        <Link href="/dashboard/applications" className="text-[var(--accent)] font-medium hover:underline text-sm">
                                            View Apps
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Link href="/dashboard/jobs/create">
                <Button className="w-full sm:w-auto px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                </Button>
            </Link>
        </div>
    )
}
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
