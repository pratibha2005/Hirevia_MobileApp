"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
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

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('token')
            if (!token) return
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

    const filtered = jobs.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.location.toLowerCase().includes(search.toLowerCase())
    )

    const handleClose = async (id: string, current: string) => {
        const token = localStorage.getItem('token')
        const newStatus = current === 'Active' ? 'Closed' : 'Active'
        await fetch(`${API_BASE_URL}/api/jobs/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status: newStatus }),
        })
        setJobs(prev => prev.map(j => j._id === id ? { ...j, status: newStatus } : j))
    }
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Jobs</h1>
                    <p className="text-[var(--muted-foreground)] text-sm mt-1">Manage your open positions and track performance</p>
                </div>
                <Link href="/dashboard/jobs/create">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Post New Job
                    </Button>
                </Link>
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
        </div>
    )
}
