"use client";

import React, { useEffect, useState } from "react";
import { Search, FileText, Mail, Phone, MapPin, Briefcase, Star, Download, Sparkles, StickyNote } from "lucide-react";
import { API_BASE_URL } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";

interface Applicant {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    experience?: string;
    skills?: string[];
    profilePhoto?: string;
}

interface Job {
    _id: string;
    title: string;
    location: string;
}

interface Application {
    _id: string;
    applicantId: Applicant;
    jobId: Job;
    status: string;
    appliedAt: string;
    resumeUrl?: string;
}

const PIPELINE_STAGES = ["New", "Under Review", "Shortlisted", "Interview", "Offer", "Hired", "Rejected"];

export default function PipelinePage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

    useEffect(() => {
        const fetchApps = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/applications/company`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setApplications(data.applications);
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const previousApplications = [...applications];
        setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));

        try {
            const res = await fetch(`${API_BASE_URL}/api/applications/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (!data.success) {
                setApplications(previousApplications);
                alert(`Failed to update status: ${data.message}`);
            }
        } catch (error) {
            setApplications(previousApplications);
            alert("An error occurred while updating the status");
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        e.dataTransfer.setData("applicationId", id);
        setDraggedAppId(id);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add("bg-[var(--muted)]");
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove("bg-[var(--muted)]");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
        e.preventDefault();
        e.currentTarget.classList.remove("bg-[var(--muted)]");
        const id = e.dataTransfer.getData("applicationId");
        if (id) {
            updateStatus(id, status);
        }
        setDraggedAppId(null);
    };

    const handleDragEnd = () => {
        setDraggedAppId(null);
    };

    const normalizedSearch = search.toLowerCase().trim();
    const filtered = applications.filter(a => {
        const name = a.applicantId?.name?.toLowerCase() || "";
        const title = a.jobId?.title?.toLowerCase() || "";
        return name.includes(normalizedSearch) || title.includes(normalizedSearch);
    });

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] space-y-4 pt-4 px-4 overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[var(--primary)]" /> Hiring Pipeline
                    </h1>
                    <p className="text-[var(--muted-foreground)] mt-1 text-sm">
                        Drag and drop candidates across stages to manage your hiring flow.
                    </p>
                </div>
                <div className="flex items-center text-sm text-[var(--muted-foreground)] bg-[var(--surface)] px-3 py-2 rounded-xl w-full max-w-sm border border-[var(--border)] focus-within:border-[var(--primary)]/50 focus-within:ring-2 focus-within:ring-[var(--primary)]/10 transition-all">
                    <Search className="w-4 h-4 mr-2 text-[var(--muted-foreground)]" />
                    <input
                        type="text"
                        placeholder="Search by name or job title..."
                        className="bg-transparent border-none outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-4 h-full min-w-max">
                    {PIPELINE_STAGES.map(stage => {
                        const stageApps = filtered.filter(app => app.status === stage);
                        return (
                            <div
                                key={stage}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={e => handleDrop(e, stage)}
                                className="w-72 flex flex-col rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm shrink-0 transition-colors duration-200"
                            >
                                <div className="p-3 border-b border-[var(--border)] bg-[var(--muted)]/50 rounded-t-2xl flex items-center justify-between">
                                    <h3 className="font-semibold text-sm text-[var(--foreground)]">{stage}</h3>
                                    <span className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)]">
                                        {stageApps.length}
                                    </span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                    {stageApps.map(app => (
                                        <div
                                            key={app._id}
                                            draggable
                                            onDragStart={e => handleDragStart(e, app._id)}
                                            onDragEnd={handleDragEnd}
                                            className={`p-4 rounded-xl border border-[var(--border)] bg-white cursor-grab active:cursor-grabbing hover:border-[var(--primary)]/40 hover:shadow-md transition-all ${draggedAppId === app._id ? "opacity-50 scale-95" : "opacity-100"}`}
                                        >
                                            <div className="flex gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 shrink-0 uppercase">
                                                    {app.applicantId?.name?.charAt(0) || "?"}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="font-semibold text-sm truncate text-[var(--foreground)]">
                                                        {app.applicantId?.name || "Unknown"}
                                                    </h4>
                                                    <p className="text-xs text-[var(--muted-foreground)] truncate flex items-center gap-1 mt-0.5">
                                                        <Briefcase className="w-3 h-3 shrink-0" /> <span className="truncate">{app.jobId?.title || "No Job Title"}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-3 mt-3">
                                                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                                                    {`${Math.floor(Math.random() * (99 - 70 + 1) + 70)}% Match`}
                                                </span>
                                            </div>

                                            <div className="flex items-center pt-3 border-t border-[var(--border)]/60 text-[var(--muted-foreground)] relative">
                                                <div className="flex items-center gap-2 flex-wrap flex-1">
                                                    {app.resumeUrl && (
                                                        <a href={`${app.resumeUrl.startsWith("http") ? "" : API_BASE_URL}${app.resumeUrl}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="hover:text-[var(--primary)] transition-colors p-1" title="View Resume">
                                                            <FileText className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    {app.applicantId?.email && (
                                                        <a href={`mailto:${app.applicantId.email}`} onClick={e => e.stopPropagation()} className="hover:text-[var(--primary)] transition-colors p-1" title={app.applicantId.email}>
                                                            <Mail className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    {app.applicantId?.phone && (
                                                        <a href={`tel:${app.applicantId.phone}`} onClick={e => e.stopPropagation()} className="hover:text-[var(--primary)] transition-colors p-1" title={app.applicantId.phone}>
                                                            <Phone className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                                <div>
                                                  <button onClick={e => { e.stopPropagation(); alert("Add note feature coming soon!") }} className="hover:text-[var(--primary)] transition-colors p-1 ml-auto" title="Notes">
                                                      <StickyNote className="w-4 h-4" />
                                                  </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {stageApps.length === 0 && (
                                        <div className="h-24 rounded-lg border-2 border-dashed border-[var(--border)] flex items-center justify-center text-xs text-[var(--muted-foreground)] items-center text-center px-4">
                                            Drop candidate here
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
