"use client"
import React, { useEffect, useState } from 'react'
import { Download, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from '@/lib/apiClient'

interface Applicant { _id: string; name: string; email: string; phone?: string }
interface Job { _id: string; title: string; location: string }
interface ScreeningAnswer { question: string; answer: string }
interface Application {
    _id: string
    applicantId: Applicant
    jobId: Job
    status: string
    appliedAt: string
    screeningAnswers: ScreeningAnswer[]
}

const STATUS_COLORS: Record<string, string> = {
    'New': 'bg-blue-900/40 text-blue-400',
    'Under Review': 'bg-orange-900/40 text-orange-400',
    'Shortlisted': 'bg-emerald-900/40 text-emerald-400',
    'Rejected': 'bg-zinc-800/60 text-zinc-400',
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchApps = async () => {
            const token = localStorage.getItem('token')
            if (!token) return
            try {
                const res = await fetch(`${API_BASE_URL}/api/applications/company`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                if (data.success) setApplications(data.applications)
            } catch { /* ignore */ }
            finally { setLoading(false) }
        }
        fetchApps()
    }, [])

    const filtered = applications.filter(a =>
        a.applicantId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.applicantId?.email?.toLowerCase().includes(search.toLowerCase()) ||
        a.jobId?.title?.toLowerCase().includes(search.toLowerCase())
    )

    const updateStatus = async (id: string, status: string) => {
        const token = localStorage.getItem('token')
        await fetch(`${API_BASE_URL}/api/applications/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status }),
        })
        setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a))
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Applications</h1>
                    <p className="text-[var(--muted-foreground)]">Review candidates and manage the hiring pipeline.</p>
                </div>
            </div>

            <div className="subtle-glass rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--surface)]">
                    <div className="flex items-center text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-2 rounded-md w-full max-w-sm border border-[var(--border)] focus-within:border-[var(--primary)]/40 transition-colors">
                        <Search className="w-4 h-4 mr-2 text-gray-400" />
                        <input type="text" placeholder="Search by name, email or job title..."
                            className="bg-transparent border-none outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50"
                            value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-10"></th>
                                <th className="px-6 py-4">Applicant</th>
                                <th className="px-6 py-4">Job Title</th>
                                <th className="px-6 py-4">Applied Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-[var(--muted-foreground)]">Loading applications...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                                    {applications.length === 0 ? 'No applications yet. Post jobs and wait for candidates to apply.' : 'No results match your search.'}
                                </td></tr>
                            ) : filtered.map((app) => (
                                <React.Fragment key={app._id}>
                                    <tr
                                        className={`hover:bg-[var(--muted)]/50 transition-colors cursor-pointer ${expandedRow === app._id ? 'bg-[var(--muted)]/30' : ''}`}
                                        onClick={() => setExpandedRow(expandedRow === app._id ? null : app._id)}
                                    >
                                        <td className="px-6 py-4 text-[var(--muted-foreground)]">
                                            {expandedRow === app._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[var(--foreground)]">{app.applicantId?.name}</div>
                                            <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{app.applicantId?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[var(--foreground)]">{app.jobId?.title}</td>
                                        <td className="px-6 py-4 text-[var(--muted-foreground)]">
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[app.status] || STATUS_COLORS['New']}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <select
                                                className="text-xs bg-[var(--muted)] border border-[var(--border)] rounded px-2 py-1 text-[var(--foreground)] focus:outline-none"
                                                value={app.status}
                                                onClick={e => e.stopPropagation()}
                                                onChange={e => { e.stopPropagation(); updateStatus(app._id, e.target.value) }}
                                            >
                                                <option>New</option>
                                                <option>Under Review</option>
                                                <option>Shortlisted</option>
                                                <option>Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                    {expandedRow === app._id && (
                                        <tr className="bg-[var(--muted)] border-none">
                                            <td colSpan={6} className="p-0 border-none">
                                                <div className="px-16 py-6 animate-in slide-in-from-top-2 fade-in duration-300">
                                                    <h4 className="text-sm font-bold tracking-widest text-[var(--primary)] uppercase mb-4">Screening Answers</h4>
                                                    {app.screeningAnswers.length > 0 ? (
                                                        <div className="space-y-4">
                                                            {app.screeningAnswers.map((qa, idx) => (
                                                                <div key={idx} className="space-y-1">
                                                                    <p className="font-semibold text-[var(--foreground)] text-sm">{qa.question}</p>
                                                                    <p className="text-[var(--muted-foreground)] text-sm bg-[var(--surface)] p-3 rounded-md border border-[var(--border)]">
                                                                        {qa.answer}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-[var(--muted-foreground)] italic">No screening questions were asked for this job.</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}