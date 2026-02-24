"use client"
import React, { useState } from 'react'
import { Download, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

const mockApplications = [
    {
        id: "APP-001",
        applicant: "Alice Johnson",
        email: "alice@example.com",
        jobTitle: "Senior Frontend Engineer",
        appliedDate: "Today, 10:30 AM",
        status: "New",
        statusColor: "bg-blue-900/40 text-blue-400",
        resumeUrl: "#",
        screening: [
            { q: "How many years of React experience do you have?", a: "I have 5 years of production experience with React and Next.js." },
            { q: "Are you willing to relocate to San Francisco?", a: "Yes, I am happy to relocate." }
        ]
    },
    {
        id: "APP-002",
        applicant: "Bob Smith",
        email: "bob.s@example.com",
        jobTitle: "Product Manager",
        appliedDate: "Yesterday, 2:15 PM",
        status: "Under Review",
        statusColor: "bg-orange-900/40 text-orange-400",
        resumeUrl: "#",
        screening: [
            { q: "Describe your experience with agile methodologies.", a: "I've been a certified Scrum Master for 3 years, leading bi-weekly sprints." }
        ]
    },
    {
        id: "APP-003",
        applicant: "Charlie Davis",
        email: "cdavis@example.com",
        jobTitle: "UX Designer",
        appliedDate: "Oct 24, 2023",
        status: "Rejected",
        statusColor: "bg-zinc-800/60 text-zinc-400",
        resumeUrl: "#",
        screening: []
    }
]

export default function ApplicationsPage() {
    const [expandedRow, setExpandedRow] = useState<string | null>(null)

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id)
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
                <div className="p-4 border-b border-[var(--border)] flex items-center justify-between gap-4 bg-[var(--surface)]">
                        <div className="flex items-center text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-2 rounded-md w-full max-w-sm border border-[var(--border)] focus-within:border-[var(--primary)]/40 transition-colors">
                        <Search className="w-4 h-4 mr-2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or Job Title..."
                            className="bg-transparent border-none outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50"
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
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
                                <th className="px-6 py-4 text-right">Resume</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                            {mockApplications.map((app) => (
                                <React.Fragment key={app.id}>
                                    <tr
                                        className={`hover:bg-muted-ch/50 transition-colors cursor-pointer ${expandedRow === app.id ? 'bg-muted-ch/30' : ''}`}
                                        onClick={() => toggleRow(app.id)}
                                    >
                                        <td className="px-6 py-4 text-[var(--muted-foreground)]">
                                            {expandedRow === app.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[var(--foreground)]">{app.applicant}</div>
                                            <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{app.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[var(--foreground)]">{app.jobTitle}</td>
                                        <td className="px-6 py-4 text-[var(--muted-foreground)]">{app.appliedDate}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${app.statusColor}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Download className="w-4 h-4" /> CV
                                            </Button>
                                        </td>
                                    </tr>
                                    {/* Expanded Row Content */}
                                    {expandedRow === app.id && (
                                        <tr className="bg-[var(--muted)] border-none">
                                            <td colSpan={6} className="p-0 border-none">
                                                <div className="px-16 py-6 animate-in slide-in-from-top-2 fade-in duration-300">
                                                    <h4 className="text-sm font-bold tracking-widest text-[var(--primary)] uppercase mb-4">Screening Answers</h4>
                                                    {app.screening.length > 0 ? (
                                                        <div className="space-y-4">
                                                            {app.screening.map((qa, idx) => (
                                                                <div key={idx} className="space-y-1">
                                                                    <p className="font-semibold text-[var(--foreground)] text-sm">{qa.q}</p>
                                                                    <p className="text-[var(--muted-foreground)] text-sm bg-[var(--surface)] p-3 rounded-md border border-[var(--border)]">
                                                                        {qa.a}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-[var(--muted-foreground)] italic">No screening questions were asked for this application.</p>
                                                    )}

                                                    <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                                                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Shortlist Candidate</Button>
                                                        <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300 hover:bg-red-950/30 hover:border-red-900/30">Reject</Button>
                                                    </div>
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
