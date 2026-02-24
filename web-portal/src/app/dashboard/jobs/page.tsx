"use client"
import React from 'react'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function JobsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Active Jobs</h1>
                    <p className="text-[var(--muted-foreground)]">Manage your open positions and track their performance.</p>
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
                    <div className="flex items-center text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-2 rounded-md w-full max-w-sm border border-[var(--border)] focus-within:border-[var(--primary)] transition-colors">
                        <Search className="w-4 h-4 mr-2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by job title or location..."
                            className="bg-transparent border-none outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50"
                        />
                    </div>
                    <Button variant="outline" className="gap-2 bg-[var(--surface)]">
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Job Title</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4 text-center">Applications</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                            {[
                                { title: "Frontend Engineer", department: "Engineering", location: "Bangalore, Remote", apps: 45, status: "Active", statusColor: "bg-emerald-900/40 text-emerald-400" },
                                { title: "Product Manager", department: "Product", location: "Mumbai", apps: 12, status: "Active", statusColor: "bg-emerald-900/40 text-emerald-400" },
                                { title: "UX Designer", department: "Design", location: "Remote", apps: 89, status: "Closed", statusColor: "bg-zinc-800 text-zinc-300" },
                                { title: "Backend Engineer", department: "Engineering", location: "Bangalore", apps: 2, status: "Draft", statusColor: "bg-orange-900/40 text-orange-400" },
                            ].map((job, i) => (
                                <tr key={i} className="hover:bg-muted-ch/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[var(--foreground)]">{job.title}</div>
                                        <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{job.department}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--muted-foreground)] font-medium">{job.location}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--foreground)] font-semibold text-sm">
                                            {job.apps}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${job.statusColor}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button className="text-[var(--primary)] font-medium hover:underline text-sm">Edit</button>
                                        <Link href="/dashboard/applications" className="text-[var(--accent)] font-medium hover:underline text-sm">View Apps</Link>
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
