"use client"
import React, { useEffect, useState } from 'react'
import { Download, Search, ChevronDown, ChevronUp, Users, Briefcase, CheckCircle2, Clock3, XCircle, Sparkles } from 'lucide-react'
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
    resumeUrl?: string
    relocationAnswer?: string
    ctcAnswer?: string
}

const STATUS_OPTIONS = ['New', 'Under Review', 'Shortlisted', 'Rejected'] as const

const STATUS_STYLES: Record<string, { badge: string; select: string; dot: string }> = {
    'New': {
        badge: 'bg-sky-50 text-sky-700 border border-sky-200',
        select: 'bg-sky-50 border-sky-200 text-sky-700',
        dot: 'bg-sky-500',
    },
    'Under Review': {
        badge: 'bg-amber-50 text-amber-700 border border-amber-200',
        select: 'bg-amber-50 border-amber-200 text-amber-700',
        dot: 'bg-amber-500',
    },
    'Shortlisted': {
        badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        select: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        dot: 'bg-emerald-500',
    },
    'Rejected': {
        badge: 'bg-rose-50 text-rose-700 border border-rose-200',
        select: 'bg-rose-50 border-rose-200 text-rose-700',
        dot: 'bg-rose-500',
    },
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [activeStatus, setActiveStatus] = useState<'All' | (typeof STATUS_OPTIONS)[number]>('All')
    const [updatingId, setUpdatingId] = useState<string | null>(null)

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

    const normalizedSearch = search.toLowerCase().trim()

    const filtered = applications.filter((a) => {
        const matchesSearch =
            a.applicantId?.name?.toLowerCase().includes(normalizedSearch) ||
            a.applicantId?.email?.toLowerCase().includes(normalizedSearch) ||
            a.jobId?.title?.toLowerCase().includes(normalizedSearch)

        const matchesStatus = activeStatus === 'All' || a.status === activeStatus
        return matchesSearch && matchesStatus
    })

    const counts = {
        all: applications.length,
        new: applications.filter((app) => app.status === 'New').length,
        review: applications.filter((app) => app.status === 'Under Review').length,
        shortlisted: applications.filter((app) => app.status === 'Shortlisted').length,
        rejected: applications.filter((app) => app.status === 'Rejected').length,
    }

    const updateStatus = async (id: string, status: string) => {
        const token = localStorage.getItem('token')
        if (!token) return

        const previous = applications
        setUpdatingId(id)
        setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)))

        try {
            const res = await fetch(`${API_BASE_URL}/api/applications/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status }),
            })

            if (!res.ok) {
                setApplications(previous)
            }
        } catch {
            setApplications(previous)
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[rgba(var(--primary-ch),0.18)] via-white to-[rgba(var(--accent-ch),0.14)] p-6 sm:p-7">
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[rgba(var(--accent-ch),0.15)] blur-2xl" />
                <div className="absolute -bottom-12 left-24 h-36 w-36 rounded-full bg-[rgba(var(--primary-ch),0.2)] blur-2xl" />
                <div className="relative flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">Applications Hub</h1>
                            <p className="text-[var(--muted-foreground)] mt-1">Review candidates and move talent through your hiring pipeline faster.</p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] w-fit">
                            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                            Live Pipeline View
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="rounded-xl border border-[var(--border)] bg-white/80 p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-semibold">Total</p>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-2xl font-bold text-[var(--foreground)]">{counts.all}</p>
                                <Users className="h-5 w-5 text-[var(--primary)]" />
                            </div>
                        </div>
                        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wider text-sky-700/80 font-semibold">New</p>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-2xl font-bold text-sky-700">{counts.new}</p>
                                <Briefcase className="h-5 w-5 text-sky-600" />
                            </div>
                        </div>
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wider text-amber-700/80 font-semibold">Under Review</p>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-2xl font-bold text-amber-700">{counts.review}</p>
                                <Clock3 className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">Shortlisted</p>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-2xl font-bold text-emerald-700">{counts.shortlisted}</p>
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="subtle-glass rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 sm:p-5 border-b border-[var(--border)] bg-[var(--surface)] space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex items-center text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-2.5 rounded-xl w-full max-w-lg border border-[var(--border)] focus-within:border-[var(--primary)]/50 focus-within:ring-2 focus-within:ring-[var(--primary)]/10 transition-all">
                            <Search className="w-4 h-4 mr-2 text-[var(--muted-foreground)]" />
                        <input type="text" placeholder="Search by name, email or job title..."
                            className="bg-transparent border-none outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50"
                            value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)] font-semibold">
                            Showing <span className="text-[var(--foreground)]">{filtered.length}</span> of {applications.length} applications
                        </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {(['All', ...STATUS_OPTIONS] as const).map((status) => {
                            const isActive = activeStatus === status
                            const statusCount =
                                status === 'All'
                                    ? counts.all
                                    : status === 'New'
                                        ? counts.new
                                        : status === 'Under Review'
                                            ? counts.review
                                            : status === 'Shortlisted'
                                                ? counts.shortlisted
                                                : counts.rejected

                            return (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setActiveStatus(status)}
                                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
                                        isActive
                                            ? 'bg-[var(--foreground)] text-white border-[var(--foreground)] shadow-sm'
                                            : 'bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)]/40 hover:text-[var(--foreground)]'
                                    }`}
                                >
                                    {status} ({statusCount})
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[860px]">
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
                                        className={`transition-all cursor-pointer ${expandedRow === app._id ? 'bg-[var(--muted)]/50' : 'hover:bg-[var(--muted)]/30'}`}
                                        onClick={() => setExpandedRow(expandedRow === app._id ? null : app._id)}
                                    >
                                        <td className="px-6 py-4 text-[var(--muted-foreground)]">
                                            {expandedRow === app._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[var(--foreground)]">{app.applicantId?.name || 'Unknown Candidate'}</div>
                                            <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{app.applicantId?.email || 'No email available'}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[var(--foreground)]">{app.jobId?.title}</td>
                                        <td className="px-6 py-4 text-[var(--muted-foreground)]">
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[app.status]?.badge || STATUS_STYLES['New'].badge}`}>
                                                <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[app.status]?.dot || STATUS_STYLES['New'].dot}`} />
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <select
                                                    className={`text-xs border rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/25 transition-all ${STATUS_STYLES[app.status]?.select || STATUS_STYLES['New'].select} ${updatingId === app._id ? 'opacity-70 animate-pulse' : ''}`}
                                                    value={app.status}
                                                    onClick={e => e.stopPropagation()}
                                                    onChange={e => { e.stopPropagation(); updateStatus(app._id, e.target.value) }}
                                                >
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <option key={status}>{status}</option>
                                                    ))}
                                                </select>
                                                {updatingId === app._id && <span className="text-[10px] text-[var(--muted-foreground)]">Updating...</span>}
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedRow === app._id && (
                                        <tr className="bg-[var(--muted)]/70 border-none">
                                            <td colSpan={6} className="p-0 border-none">
                                                <div className="px-6 sm:px-10 py-6 animate-in slide-in-from-top-2 fade-in duration-300">
                                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4">
                                                        <h4 className="text-sm font-bold tracking-widest text-[var(--primary)] uppercase">Candidate Details & Answers</h4>
                                                        {app.resumeUrl && (
                                                            <a href={`${app.resumeUrl.startsWith('http') ? '' : API_BASE_URL}${app.resumeUrl}`} target="_blank" rel="noreferrer">
                                                                <Button size="sm" variant="outline" className="gap-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white">
                                                                    <Download className="w-4 h-4" /> View Resume
                                                                </Button>
                                                            </a>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                                                        {app.relocationAnswer && (
                                                            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                                                                <p className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase mb-2">Relocation</p>
                                                                <p className="font-semibold text-[var(--foreground)]">{app.relocationAnswer}</p>
                                                            </div>
                                                        )}
                                                        {app.ctcAnswer && (
                                                            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                                                                <p className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase mb-2">Current CTC & Expectations</p>
                                                                <p className="font-semibold text-[var(--foreground)]">{app.ctcAnswer}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {app.screeningAnswers.length > 0 ? (
                                                        <div className="space-y-4">
                                                            <h5 className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Screening Questions</h5>
                                                            {app.screeningAnswers.map((qa, idx) => (
                                                                <div key={idx} className="space-y-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
                                                                    <p className="font-semibold text-[var(--foreground)] text-sm">{qa.question}</p>
                                                                    <p className="text-[var(--muted-foreground)] text-sm">
                                                                        {qa.answer}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-[var(--muted-foreground)] italic flex items-center gap-2"><XCircle className="w-4 h-4" /> No screening questions were asked for this job.</p>
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