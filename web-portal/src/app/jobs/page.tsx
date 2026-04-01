'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { Pagination } from '@/components/ui/Pagination';
import {
  Search, Plus, MapPin, Users, Clock,
  CheckCircle2, XCircle, RotateCcw,
  RefreshCw, AlertCircle, Loader2, ChevronRight,
  Briefcase, ArrowUpRight, ArrowUpDown, ArrowUp, ArrowDown,
  Bookmark, BookmarkPlus, X as XIcon, Check
} from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';

export type SortColumn = 'title' | 'status' | 'applicationCount' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary?: string;
  type?: string;
  status: 'Active' | 'Closed' | 'Draft';
  skills: string[];
  applicationCount: number;
  createdAt: string;
  maxApplications?: number;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ── Status dot ─────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: Job['status'] }) {
  const cfg = {
    Active: { dot: '#22C55E', label: 'Active', text: '#4ADE80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.18)' },
    Draft:  { dot: '#6B7280', label: 'Draft',  text: '#9CA3AF', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
    Closed: { dot: '#EF4444', label: 'Closed', text: '#F87171', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.18)' },
  }[status] ?? { dot: '#6B7280', label: status, text: '#9CA3AF', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

// ── Context menu ───────────────────────────────────────────────────────────────
function RowMenu({
  job,
  onStatusChange,
}: {
  job: Job;
  onStatusChange: (id: string, s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  const change = async (s: string) => {
    setOpen(false);
    setBusy(true);
    try {
      await apiFetch(`/api/jobs/${job._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: s }) });
      onStatusChange(job._id, s);
    } catch { /* silent */ }
    finally { setBusy(false); }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={busy}
        className="w-7 h-7 rounded-md flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-high border border-glass-border transition-colors bg-surface-low shadow-sm"
      >
        {busy
          ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6366F1]" />
          : <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.96 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 top-8 w-40 rounded-xl overflow-hidden z-50 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
            style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            {job.status !== 'Active' && (
              <button onClick={() => change('Active')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] text-[#4ADE80] hover:bg-white/4 transition-colors text-left">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Activate
              </button>
            )}
            {job.status !== 'Draft' && (
              <button onClick={() => change('Draft')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] text-[#9CA3AF] hover:bg-white/4 transition-colors text-left">
                <RotateCcw className="w-3.5 h-3.5 shrink-0" /> Move to Draft
              </button>
            )}
            {job.status !== 'Closed' && (
              <button onClick={() => change('Closed')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] text-[#F87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors text-left border-t border-white/5">
                <XCircle className="w-3.5 h-3.5 shrink-0" /> Close
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Table row ──────────────────────────────────────────────────────────────────
const Row = React.memo(function Row({
  job,
  index,
  onStatusChange,
  isSelected,
  onSelectChange,
}: {
  job: Job;
  index: number;
  onStatusChange: (id: string, s: string) => void;
  isSelected?: boolean;
  onSelectChange?: (id: string, checked: boolean) => void;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="group border-b hover:bg-white/[0.025] transition-colors duration-150 cursor-default"
      style={{
        borderColor: 'rgba(255,255,255,0.055)',
        backgroundColor: isSelected ? 'rgba(99,102,241,0.05)' : 'transparent'
      }}
    >
      {/* Checkbox */}
      <td className="py-4 pl-4 pr-2 w-10">
        <label className="flex items-center cursor-pointer relative z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectChange?.(job._id, e.target.checked)}
            className="w-3.5 h-3.5 rounded border border-[#4B5563] bg-transparent checked:bg-primary checked:border-primary appearance-none transition-colors"
          />
          {isSelected && (
            <svg
              className="absolute w-2.5 h-2.5 text-white left-0.5 top-0.5 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </label>
      </td>

      {/* Title + meta */}
      <td className="py-4 pl-6 pr-4">
        <div className="flex flex-col gap-1">
          <span className="text-[13.5px] font-semibold text-[#E5E7EB] group-hover:text-white transition-colors leading-tight">
            {job.title}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-[#52576B]">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{job.location}</span>
            {job.type && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-[#374151]" />
                <span>{job.type}</span>
              </>
            )}
            {job.salary && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-[#374151]" />
                <span className="text-[#6B7280]">{job.salary}</span>
              </>
            )}
          </div>
        </div>
      </td>

      {/* Skills */}
      <td className="py-4 px-4 hidden lg:table-cell">
        <div className="flex items-center gap-1.5 flex-wrap">
          {job.skills.slice(0, 3).map(s => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-md font-medium text-[#6B7480]"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {s}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[10px] text-[#4B5563]">+{job.skills.length - 3}</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <StatusDot status={job.status} />
      </td>

      {/* Applicants */}
      <td className="py-4 px-4 text-right hidden sm:table-cell">
        <span className="text-[13px] font-semibold text-[#C9D1D9]">{job.applicationCount}</span>
        {job.maxApplications && (
          <span className="text-[11px] text-[#4B5563]"> / {job.maxApplications}</span>
        )}
      </td>

      {/* Posted */}
      <td className="py-4 px-4 text-right hidden md:table-cell">
        <span className="text-[11px] text-[#4B5563]">{timeAgo(job.createdAt)}</span>
      </td>

      {/* Actions */}
      <td className="py-4 pl-4 pr-5 text-right relative">
        <div className="flex items-center justify-end gap-2">
          {job.applicationCount === 0 && job.status === 'Active' && (
            <span className="text-[10px] text-warning bg-warning/10 px-2 py-1 rounded-md font-medium mr-2">
              Needs Attention
            </span>
          )}
          <Link
            href={`/candidates?job=${job._id}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors px-3 py-1.5 rounded-md shadow-sm"
          >
            Pipeline <ArrowUpRight className="w-3 h-3" />
          </Link>
          <RowMenu job={job} onStatusChange={onStatusChange} />
        </div>
      </td>
    </motion.tr>
  );
});

// ── Skeleton rows ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b animate-pulse" style={{ borderColor: 'rgba(255,255,255,0.055)' }}>
      <td className="py-4 pl-4 pr-2 w-10"><div className="w-3.5 h-3.5 rounded border border-white/10" /></td>
      <td className="py-4 pl-4 pr-4"><div className="space-y-2"><div className="h-3.5 bg-white/6 rounded w-48" /><div className="h-2.5 bg-white/3 rounded w-32" /></div></td>
      <td className="py-4 px-4 hidden lg:table-cell"><div className="flex gap-1.5"><div className="h-4 bg-white/4 rounded-md w-12" /><div className="h-4 bg-white/4 rounded-md w-16" /></div></td>
      <td className="py-4 px-4"><div className="h-5 bg-white/5 rounded-full w-16" /></td>
      <td className="py-4 px-4 hidden sm:table-cell"><div className="h-3.5 bg-white/4 rounded w-6 ml-auto" /></td>
      <td className="py-4 px-4 hidden md:table-cell"><div className="h-2.5 bg-white/3 rounded w-10 ml-auto" /></td>
      <td className="py-4 pl-4 pr-5" />
    </tr>
  );
}

export interface SavedFilterView {
  id: string;
  name: string;
  search: string;
  filter: 'All' | 'Active' | 'Draft' | 'Closed';
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Draft' | 'Closed'>('All');
  
  // Saved Views
  const [savedViews, setSavedViews] = useState<SavedFilterView[]>([]);
  const [showSavedViewsMenu, setShowSavedViewsMenu] = useState(false);
  const [viewNameInput, setViewNameInput] = useState('');
  const [isSavingView, setIsSavingView] = useState(false);

  // Pagination & Sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const itemsPerPage = 6;

  // Selected jobs
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());

  // Column Resizing
  const [colWidths, setColWidths] = useState({
    title: 250,
    skills: 200,
    status: 120,
    applicationCount: 120,
    createdAt: 120
  });

  const onResize = (col: keyof typeof colWidths) => (e: React.SyntheticEvent, { size }: { size: { width: number } }) => {
    setColWidths(prev => ({ ...prev, [col]: size.width }));
  };

  useEffect(() => {
    const loaded = localStorage.getItem('hirevia_saved_job_views');
    if (loaded) {
      try {
        setSavedViews(JSON.parse(loaded));
      } catch (e) {}
    }
  }, []);

  const handleSaveView = () => {
    if (!viewNameInput.trim()) return;
    const newView: SavedFilterView = {
      id: Math.random().toString(36).substring(7),
      name: viewNameInput.trim(),
      search,
      filter
    };
    const updated = [...savedViews, newView];
    setSavedViews(updated);
    localStorage.setItem('hirevia_saved_job_views', JSON.stringify(updated));
    setViewNameInput('');
    setIsSavingView(false);
    setShowSavedViewsMenu(false);
  };

  const applyView = (view: SavedFilterView) => {
    setSearch(view.search);
    setFilter(view.filter);
    setShowSavedViewsMenu(false);
  };

  const deleteView = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedViews.filter(v => v.id !== id);
    setSavedViews(updated);
    localStorage.setItem('hirevia_saved_job_views', JSON.stringify(updated));
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/jobs/hr/my');
      setJobs(data.jobs ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleStatusChange = (id: string, s: string) =>
    setJobs(prev => prev.map(j => j._id === id ? { ...j, status: s as Job['status'] } : j));

  const filtered = useMemo(() => {
    const list = jobs.filter(j => {
      const q = search.toLowerCase();
      return (filter === 'All' || j.status === filter) &&
        (j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q));
    });

    return list.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      if (sortColumn === 'title') {
        valA = a.title.toLowerCase(); valB = b.title.toLowerCase();
      } else if (sortColumn === 'status') {
        valA = a.status; valB = b.status;
      } else if (sortColumn === 'applicationCount') {
        valA = a.applicationCount; valB = b.applicationCount;
      } else if (sortColumn === 'createdAt') {
        valA = new Date(a.createdAt).getTime(); valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [jobs, search, filter, sortColumn, sortDirection]);

  // Reset pagination when search, filter, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedJobs = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const active = jobs.filter(j => j.status === 'Active').length;
  const totalApplicants = jobs.reduce((n, j) => n + j.applicationCount, 0);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobIds(new Set(paginatedJobs.map(j => j._id)));
    } else {
      setSelectedJobIds(new Set());
    }
  };

  const isAllSelected = paginatedJobs.length > 0 && paginatedJobs.every(j => selectedJobIds.has(j._id));
  const isSomeSelected = selectedJobIds.size > 0 && !isAllSelected;

  const handleSelectChange = (id: string, checked: boolean) => {
    const next = new Set(selectedJobIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedJobIds(next);
  };

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (col: SortColumn) => {
    if (sortColumn !== col) return <ArrowUpDown className="w-3 h-3 text-on-surface-subtle opacity-50 group-hover:opacity-100 transition-opacity" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-semibold text-[#E5E7EB] tracking-tight">Jobs</h2>
          {!loading && (
            <p className="text-[12px] text-[#4B5563] mt-0.5">
              {jobs.length} positions
              {active > 0 && <> · <span className="text-[#4ADE80]">{active} active</span></>}
              {totalApplicants > 0 && <> · {totalApplicants} applicants</>}
            </p>
          )}
        </div>

        {/* Post Job — no outline version */}
        <Link href="/jobs/new">
          <button
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[12.5px] font-medium text-white transition-all hover:brightness-110 active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg,#4F46E5,#6D28D9)', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Position
          </button>
        </Link>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#374151]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="h-8 pl-8 pr-3 rounded-lg text-[12.5px] text-[#9CA3AF] placeholder:text-[#374151] focus:outline-none focus:text-white transition-all w-48 focus:w-64"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', transition: 'width 0.2s ease, border-color 0.15s' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.35)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; }}
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {(['All', 'Active', 'Draft', 'Closed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-1 rounded-md text-[11.5px] font-medium transition-all duration-150"
              style={{
                background: filter === s ? 'rgba(99,102,241,0.25)' : 'transparent',
                color: filter === s ? '#818CF8' : '#6B7280',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Saved Views Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSavedViewsMenu(!showSavedViewsMenu)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11.5px] font-medium transition-colors hover:text-[#D1D5DB] text-[#9CA3AF]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Views
          </button>
          
          <AnimatePresence>
            {showSavedViewsMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 w-56 bg-[#0B1020]/95 backdrop-blur-xl border border-glass-border rounded-xl shadow-modal overflow-hidden z-50 flex flex-col"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-glass-border bg-white/5">
                  <span className="text-[11px] font-semibold text-on-surface-subtle uppercase tracking-wider">Saved Views</span>
                </div>
                <div className="max-h-48 overflow-y-auto w-full p-1.5 flex flex-col gap-0.5">
                  {savedViews.length === 0 ? (
                    <div className="px-3 py-4 text-center text-[11px] text-on-surface-variant">No saved views yet</div>
                  ) : (
                    savedViews.map(view => (
                      <div key={view.id} className="flex items-center justify-between w-full group rounded-md hover:bg-white/5 transition-colors">
                        <button
                          onClick={() => applyView(view)}
                          className="flex flex-col flex-1 text-left px-2.5 py-1.5"
                        >
                          <span className="text-[12px] font-medium text-[#E5E7EB]">{view.name}</span>
                          <span className="text-[10px] text-on-surface-variant line-clamp-1 mt-0.5">
                            {view.filter} {view.search ? `• "${view.search}"` : ''}
                          </span>
                        </button>
                        <button
                          onClick={(e) => deleteView(e, view.id)}
                          className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-danger rounded-md opacity-0 group-hover:opacity-100 transition-all mr-1"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-1.5 border-t border-glass-border">
                  {isSavingView ? (
                    <div className="flex flex-col gap-2 p-1.5">
                      <input 
                        type="text" 
                        value={viewNameInput}
                        onChange={(e) => setViewNameInput(e.target.value)}
                        placeholder="Name this view..."
                        className="w-full bg-black/20 border border-white/10 rounded-md px-2.5 py-1.5 text-[11.5px] text-white focus:outline-none focus:border-primary/50"
                        autoFocus
                      />
                      <div className="flex gap-1.5">
                        <button 
                          onClick={handleSaveView}
                          className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-md py-1 text-[11px] font-medium transition-colors"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setIsSavingView(false)}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-on-surface-variant rounded-md py-1 text-[11px] font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSavingView(true)}
                      className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/5 text-[11.5px] font-medium text-primary transition-colors"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      Save Current View
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={fetchJobs}
          title="Refresh"
          className="h-8 w-8 rounded-lg flex items-center justify-center text-[#374151] hover:text-[#6B7280] transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[#F87171] text-[12.5px]"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
          <button onClick={fetchJobs} className="ml-auto underline opacity-60 hover:opacity-100 text-xs">Retry</button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Bulk Actions Header (Replaces normal headers when items selected) */}
        {selectedJobIds.size > 0 && (
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 py-3 px-4 backdrop-blur-md bg-[#0B1020]/95" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <label className="flex items-center cursor-pointer relative z-10">
              <input
                type="checkbox"
                checked={isAllSelected || isSomeSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-3.5 h-3.5 rounded border border-[#4B5563] bg-transparent checked:bg-primary checked:border-primary appearance-none transition-colors"
              />
              {isAllSelected && (
                <svg
                  className="absolute w-2.5 h-2.5 text-white left-0.5 top-0.5 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isSomeSelected && !isAllSelected && (
                <svg
                  className="absolute w-2.5 h-2.5 text-white left-0.5 top-0.5 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              )}
            </label>
            <span className="text-[12px] font-medium text-white ml-2">{selectedJobIds.size} selected</span>
            <div className="flex items-center gap-2 ml-auto">
              {/* Add bulk actions here */}
              <button 
                className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors text-[#F87171] hover:bg-[#F87171]/10 border border-[#F87171]/20"
                onClick={() => {
                  // TODO: Implement bulk delete
                  setSelectedJobIds(new Set());
                }}
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Column headers */}
        <table className="w-full border-collapse relative">
          <thead className="sticky top-0 z-10 backdrop-blur-md bg-[#0B1020]/90">
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <th className="py-3 pl-4 pr-2 text-left w-10">
                <label className="flex items-center cursor-pointer relative z-10 w-3.5 h-3.5">
                  <input
                    type="checkbox"
                    checked={isAllSelected || isSomeSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border border-[#4B5563] bg-transparent checked:bg-primary checked:border-primary appearance-none transition-colors"
                  />
                  {isAllSelected && (
                    <svg
                      className="absolute w-2.5 h-2.5 text-white left-[2px] top-[2px] pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isSomeSelected && !isAllSelected && (
                    <svg
                      className="absolute w-2.5 h-2.5 text-white left-[2px] top-[2px] pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  )}
                </label>
              </th>
              <Resizable width={colWidths.title} height={0} onResize={onResize('title')}>
                <th 
                  className="text-left py-3 pr-4 text-[10.5px] font-semibold uppercase tracking-widest text-[#374151] cursor-pointer hover:bg-white/5 transition-colors group relative"
                  style={{ width: colWidths.title }}
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center justify-start gap-1">Role {getSortIcon('title')}</div>
                </th>
              </Resizable>
              <Resizable width={colWidths.skills} height={0} onResize={onResize('skills')}>
                <th 
                  className="text-left py-3 px-4 text-[10.5px] font-semibold uppercase tracking-widest text-[#374151] hidden lg:table-cell relative"
                  style={{ width: colWidths.skills }}
                >
                  Skills
                </th>
              </Resizable>
              <Resizable width={colWidths.status} height={0} onResize={onResize('status')}>
                <th 
                  className="text-left py-3 px-4 text-[10.5px] font-semibold uppercase tracking-widest text-[#374151] cursor-pointer hover:bg-white/5 transition-colors group relative"
                  style={{ width: colWidths.status }}
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center justify-start gap-1">Status {getSortIcon('status')}</div>
                </th>
              </Resizable>
              <Resizable width={colWidths.applicationCount} height={0} onResize={onResize('applicationCount')}>
                <th 
                  className="text-right py-3 px-4 text-[10.5px] font-semibold uppercase tracking-widest text-[#374151] hidden sm:table-cell cursor-pointer hover:bg-white/5 transition-colors group relative"
                  style={{ width: colWidths.applicationCount }}
                  onClick={() => handleSort('applicationCount')}
                >
                  <div className="flex items-center justify-end gap-1">{getSortIcon('applicationCount')} Applicants</div>
                </th>
              </Resizable>
              <Resizable width={colWidths.createdAt} height={0} onResize={onResize('createdAt')}>
                <th 
                  className="text-right py-3 px-4 text-[10.5px] font-semibold uppercase tracking-widest text-[#374151] hidden md:table-cell cursor-pointer hover:bg-white/5 transition-colors group relative"
                  style={{ width: colWidths.createdAt }}
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center justify-end gap-1">{getSortIcon('createdAt')} Posted</div>
                </th>
              </Resizable>
              <th className="py-3 pl-4 pr-5 w-24" />
            </tr>
          </thead>

          <tbody style={{ background: 'rgba(11,16,32,0.6)' }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="inline-flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Briefcase className="w-5 h-5 text-[#374151]" />
                    </div>
                    <p className="text-[13px] text-[#6B7280]">
                      {search || filter !== 'All' ? 'No results match your filters' : 'No positions posted yet'}
                    </p>
                    {!search && filter === 'All' && (
                      <Link href="/jobs/new"
                        className="text-[12px] font-medium text-[#6366F1] hover:text-[#818CF8] transition-colors">
                        Post your first job →
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job, i) => (
                <Row 
                  key={job._id} 
                  job={job} 
                  index={i} 
                  onStatusChange={handleStatusChange} 
                  isSelected={selectedJobIds.has(job._id)}
                  onSelectChange={handleSelectChange}
                />
              ))
            )}
          </tbody>
        </table>

        {/* Footer count & Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 text-[11px] text-[#374151]"
            style={{ borderTop: '1px solid rgba(255,255,255,0.055)', background: 'rgba(255,255,255,0.02)' }}>
            <div>
              Showing {paginatedJobs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} ({jobs.length} total positions)
            </div>
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
