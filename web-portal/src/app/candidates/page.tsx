"use client";

import React, { useState } from 'react';
import { useToast } from '@/lib/toast-context';
import { apiFetch, API_BASE_URL } from '@/lib/apiClient';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/input';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import {
  Mail, Phone, Search, Video, Clock, Download, FileText, X,
  MapPin, Briefcase, Star, ChevronRight, Plus, Sparkles,
  CheckCircle2, Calendar, MessageSquare, ExternalLink, MoreHorizontal,
  TrendingUp, Award
} from 'lucide-react';
import { SuccessAnimation } from '@/components/ui/SuccessAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragOverlay, DragStartEvent, DragOverEvent, DragEndEvent, useDroppable
} from '@dnd-kit/core';
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─── Types ────────────────────────────────────────────────────────────────────
export type CandidateStatus = 'New' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

interface Candidate {
  id: string;
  name: string;
  role: string;
  status: CandidateStatus;
  score: number;
  source: string;
  location: string;
  avatar: string;
  skills: string[];
  experience: string;
  email?: string;
  education?: string;
  resumeUrl?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const initialCandidates: Candidate[] = [];

const COLUMNS: CandidateStatus[] = ['New', 'Under Review', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'];

const colConfig: Record<CandidateStatus, { badge: string; dot: string; accent: string; count_bg: string }> = {
  'New':           { badge: 'applied',       dot: 'bg-on-surface-subtle',      accent: 'bg-on-surface-subtle/40',    count_bg: 'bg-surface-high text-on-surface-variant' },
  'Under Review':  { badge: 'interview',     dot: 'bg-[#FCD34D]',              accent: 'bg-[#F59E0B]/25',            count_bg: 'bg-[rgba(245,158,11,0.15)] text-[#FCD34D]' },
  'Shortlisted':   { badge: 'shortlisted',   dot: 'bg-[#818CF8]',              accent: 'bg-[#4F46E5]/30',            count_bg: 'bg-[rgba(79,70,229,0.15)] text-[#818CF8]' },
  'Interview':     { badge: 'interview',     dot: 'bg-[#C084FC]',              accent: 'bg-[#9333EA]/30',            count_bg: 'bg-[rgba(147,51,234,0.15)] text-[#C084FC]' },
  'Offer':         { badge: 'offer',         dot: 'bg-[#34D399]',              accent: 'bg-[#10B981]/30',            count_bg: 'bg-[rgba(16,185,129,0.15)] text-[#34D399]' },
  'Hired':         { badge: 'hired',         dot: 'bg-[#10B981]',              accent: 'bg-[#059669]/30',            count_bg: 'bg-[rgba(5,150,105,0.15)] text-[#10B981]' },
  'Rejected':      { badge: 'rejected',      dot: 'bg-[#F87171]',              accent: 'bg-[#EF4444]/20',            count_bg: 'bg-[rgba(239,68,68,0.12)] text-[#F87171]' },
};

// ─── Score badge color ────────────────────────────────────────────────────────
function getScoreColor(score: number) {
  if (score >= 90) return 'text-success bg-success/12 border-success/25';
  if (score >= 70) return 'text-[#818CF8] bg-primary/12 border-primary/25';
  if (score >= 50) return 'text-warning bg-warning/12 border-warning/25';
  return 'text-danger bg-danger/12 border-danger/25';
}

// ─── Candidate Card ───────────────────────────────────────────────────────────
function SortableCandidateCard({ candidate, onClick }: { candidate: Candidate; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: candidate.id,
    data: { status: candidate.status, candidate },
  });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };
  const cfg = colConfig[candidate.status];

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="outline-none">
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.18 } }}
        className="relative rounded-xl border border-glass-border overflow-hidden cursor-grab active:cursor-grabbing group"
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
        onClick={onClick}
      >
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${cfg.accent}`} />

        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {candidate.avatar ? (
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="w-9 h-9 rounded-full object-cover border border-glass-border shrink-0"
                  draggable="false"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary-gradient-start shrink-0">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-sm font-display font-semibold text-on-surface leading-tight truncate group-hover:text-primary-gradient-start transition-colors duration-200">
                  {candidate.name}
                </h3>
                <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{candidate.role}</p>
              </div>
            </div>

            {/* Score badge */}
            <div className={`text-[11px] font-bold w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${getScoreColor(candidate.score)}`}>
              {candidate.score}
            </div>
          </div>

          {/* Info row */}
          <div className="flex items-center gap-3 text-[11px] text-on-surface-variant mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {candidate.experience}
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-on-surface-subtle" />
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              {candidate.location}
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 3).map(s => (
              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-high border border-glass-border text-on-surface-variant font-medium">
                {s}
              </span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-high border border-glass-border text-on-surface-subtle font-medium">
                +{candidate.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Hover actions overlay */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[rgba(10,14,30,0.9)] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-end justify-end px-3 pb-2 pointer-events-none">
          <div className="flex gap-1.5 pointer-events-auto" onClick={e => e.stopPropagation()}>
            <button
              className="w-6 h-6 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors"
              onClick={onClick}
            >
              <FileText className="w-3 h-3 text-primary-gradient-start" />
            </button>
            <button className="w-6 h-6 rounded-md bg-surface-high border border-glass-border flex items-center justify-center hover:bg-surface-highest transition-colors">
              <Mail className="w-3 h-3 text-on-surface-variant" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────
function Column({ id, items, onCardClick }: { id: CandidateStatus; items: Candidate[]; onCardClick: (c: Candidate) => void }) {
  const cfg = colConfig[id];
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col rounded-xl border border-glass-border w-72 shrink-0 min-h-[600px]"
      style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(8px)' }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-glass-border shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <h3 className="text-xs font-display font-semibold text-on-surface uppercase tracking-wider">{id}</h3>
        </div>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.count_bg}`}>
          {items.length}
        </span>
      </div>

      {/* Cards */}
      <SortableContext id={id} items={items.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 flex flex-col gap-3 p-3">
          <AnimatePresence>
            {items.map(candidate => (
              <SortableCandidateCard key={candidate.id} candidate={candidate} onClick={() => onCardClick(candidate)} />
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-8 opacity-40">
              <div className="w-10 h-10 rounded-xl border border-dashed border-glass-border flex items-center justify-center mb-2">
                <Plus className="w-4 h-4 text-on-surface-variant" />
              </div>
              <p className="text-[11px] text-on-surface-variant text-center">Drop candidate here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// ─── Candidate Drawer Content ─────────────────────────────────────────────────
function CandidateDrawerContent({
  candidate,
  onStatusChange,
  onSchedule,
}: {
  candidate: Candidate;
  onStatusChange: (s: CandidateStatus) => void;
  onSchedule: () => void;
}) {
  const [notes, setNotes] = useState("Candidate showed excellent product sense. Cultural fit is exceptionally high.");
  const cfg = colConfig[candidate.status];

  const timelineSteps = [
    { label: 'Applied', date: 'New', active: true },
    { label: 'Under Review', date: 'In progress', active: ['Under Review', 'Shortlisted'].includes(candidate.status) },
    { label: 'Shortlisted', date: 'Pending', active: candidate.status === 'Shortlisted' },
    { label: 'Rejected', date: 'Closed', active: candidate.status === 'Rejected' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Hero */}
      <div className="relative px-6 py-6 border-b border-glass-border">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="flex items-start gap-4 relative">
          {candidate.avatar ? (
            <img src={candidate.avatar} alt={candidate.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-glass-border shadow-glass shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-xl font-display font-bold text-primary-gradient-start shrink-0">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-lg font-display font-bold text-on-surface leading-tight">{candidate.name}</h3>
            <p className="text-sm text-on-surface-variant mt-0.5">{candidate.role}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant={cfg.badge as any}>{candidate.status}</Badge>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getScoreColor(candidate.score)}`}>
                ★ {candidate.score} Match
              </span>
            </div>
          </div>
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { icon: MapPin, text: candidate.location },
            { icon: Briefcase, text: candidate.experience },
            { icon: Star, text: candidate.source },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-on-surface-variant bg-surface-low border border-glass-border rounded-full px-2.5 py-1">
              <c.icon className="w-3 h-3" />
              {c.text}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        
        {/* Contact */}
        <div className="flex gap-2">
          <a href={`mailto:${candidate.email}`} className="flex items-center gap-1.5 text-[11px] text-on-surface-variant bg-surface-low border border-glass-border rounded-lg px-3 py-2 hover:bg-surface-high hover:text-on-surface transition-colors">
            <Mail className="w-3 h-3" /> {candidate.email || 'email@example.com'}
          </a>
          <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant bg-surface-low border border-glass-border rounded-lg px-3 py-2 hover:bg-surface-high cursor-pointer transition-colors">
            <Phone className="w-3 h-3" /> Add phone
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle mb-3">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map(s => (
              <Badge key={s} variant="primary" className="text-[11px]">{s}</Badge>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle mb-3">Resume</p>
          {candidate.resumeUrl ? (
            <div className="flex items-center gap-3 bg-surface-low border border-glass-border rounded-xl p-3 hover:bg-surface-high transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-primary-gradient-start" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-on-surface">{candidate.name.split(' ')[0]}_Resume.pdf</p>
                <p className="text-[10px] text-on-surface-variant">Click to view or download</p>
              </div>
              <div className="flex gap-1.5">
                <a 
                  href={`${API_BASE_URL}${candidate.resumeUrl}`} 
                  target="_blank"
                  download
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-surface-high border border-glass-border flex items-center justify-center hover:bg-surface-highest transition-colors"
                >
                  <Download className="w-3 h-3 text-on-surface-variant" />
                </a>
                <a 
                  href={`${API_BASE_URL}${candidate.resumeUrl}`} 
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-surface-high border border-glass-border flex items-center justify-center hover:bg-surface-highest transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-on-surface-variant" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-surface-lowest border border-glass-border rounded-xl border-dashed flex items-center justify-center">
              <p className="text-xs text-on-surface-variant italic">No resume uploaded</p>
            </div>
          )}
        </div>

        {/* Education */}
        {candidate.education && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle mb-3">Education</p>
            <div className="flex items-center gap-2.5 bg-surface-low border border-glass-border rounded-xl p-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/15 border border-secondary/25 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5 text-secondary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">{candidate.education}</p>
                <p className="text-[10px] text-on-surface-variant">Degree in related field</p>
              </div>
            </div>
          </div>
        )}

        {/* Pipeline Timeline */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle mb-4">Pipeline History</p>
          <div className="relative space-y-3 before:absolute before:left-[10px] before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-primary/50 before:via-glass-border before:to-transparent">
            {timelineSteps.map((step, i) => (
              <div key={i} className={`flex items-center gap-3 relative transition-opacity ${step.active ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-5 h-5 rounded-full border-2 border-surface-base flex items-center justify-center z-10 relative shrink-0 ${
                  step.active ? 'bg-primary shadow-glow-sm' : 'bg-surface-high'
                }`}>
                  {step.active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface leading-none">{step.label}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle mb-3">Recruiter Notes</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-xl bg-surface-low border border-glass-border px-4 py-3 text-xs text-on-surface placeholder:text-on-surface-subtle resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
            placeholder="Add internal recruiter notes..."
          />
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="px-6 py-4 border-t border-glass-border shrink-0" style={{ background: 'rgba(10,14,30,0.95)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-2">
          <Button variant="primary" className="flex-1 text-xs" onClick={onSchedule}>
            <Calendar className="w-3.5 h-3.5 mr-1.5" /> Schedule Interview
          </Button>
          <Button variant="success" className="text-xs" size="sm" onClick={() => onStatusChange('Shortlisted')}>
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Shortlist
          </Button>
          <Button variant="danger" size="icon-sm" className="shrink-0" onClick={() => onStatusChange('Rejected')}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CandidatesPage() {
  const { addToast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const data = await apiFetch('/api/applications/company');
      if (data.success) {
        setCandidates(data.applications.map((app: any) => ({
          id: app._id,
          name: app.applicantId?.name || 'Unknown',
          role: app.jobId?.title || 'Unknown Role',
          status: app.status as CandidateStatus,
          score: Math.floor(Math.random() * 40) + 60, // Mock score for now
          source: 'Direct',
          location: 'Remote',
          avatar: '',
          skills: app.screeningAnswers?.map((a: any) => a.answer) || [],
          experience: 'N/A',
          email: app.applicantId?.email,
          resumeUrl: app.resumeUrl
        })));
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    }
  };


  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (e: DragStartEvent) => {
    setDragActiveId(e.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    // We get the active candidate's current status and the over container's status
    const activeCandidate = candidates.find(c => c.id === active.id);
    if (!activeCandidate) return;

    const activeContainer = activeCandidate.status;
    const overContainer = COLUMNS.includes(over.id as CandidateStatus)
      ? (over.id as CandidateStatus)
      : candidates.find(c => c.id === over.id)?.status;
      
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;
    
    setCandidates(prev => {
      const overItems = prev.filter(c => c.status === overContainer);
      const overIndex = overItems.findIndex(c => c.id === over.id);
      
      const itemToMove = prev.find(c => c.id === active.id);
      if (!itemToMove) return prev;
      
      return [
        ...prev.filter(c => c.id !== active.id),
        { ...itemToMove, status: overContainer as CandidateStatus }
      ];
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDragActiveId(null);
    if (!over) return;
    
    const activeCandidate = candidates.find(c => c.id === active.id);
    if (!activeCandidate) return;

    const overContainer = COLUMNS.includes(over.id as CandidateStatus)
      ? (over.id as CandidateStatus)
      : candidates.find(c => c.id === over.id)?.status;

    if (!overContainer) return;

    // Because of handleDragOver's optimistic update, activeCandidate.status is ALREADY the overContainer,
    // so we just persist it directly. If we want to support re-ordering later within the same column, we'd do arrayMove.
    // For now, let's just make the API call to save the new status.
    
    if (activeCandidate.status === overContainer) {
      try {
        const res = await apiFetch('/api/applications/' + active.id + '/status', {
          method: 'PATCH',
          body: JSON.stringify({ status: overContainer })
        });
        if (overContainer === 'Hired') {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2500);
        }
        
        if (!res.success) {
          throw new Error(res.message || 'API rejected status update');
        }

        addToast({ title: 'Status updated', description: `Moved candidate to ${overContainer}`, type: 'success' });
      } catch (err) {
        console.error('Failed to update status:', err);
        addToast({ title: 'Error', description: 'Failed to update candidate status', type: 'error' });
        // REVERT to DB state on error
        fetchCandidates();
      }
    }
  };

  const activeCandidate = dragActiveId ? candidates.find(c => c.id === dragActiveId) : null;

  const handleCardClick = (c: Candidate) => {
    setSelectedCandidate(c);
    setIsDrawerOpen(true);
  };

  const updateCandidateStatus = async (newStatus: CandidateStatus) => {
    if (!selectedCandidate) return;
    
    setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? { ...c, status: newStatus } : c));
    setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
    
    try {
      await apiFetch(`/api/applications/${selectedCandidate.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-5 flex flex-col h-[calc(100vh-5rem)]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-display font-semibold text-on-surface tracking-tight">Candidate Pipeline</h2>
          <p className="text-on-surface-variant text-xs mt-0.5">Drag and drop to advance candidates through your hiring flow.</p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Pipeline stats */}
          <div className="hidden md:flex items-center gap-1 bg-surface-low border border-glass-border rounded-lg px-3 py-2">
            {COLUMNS.map(col => {
              const count = candidates.filter(c => c.status === col).length;
              const cfg = colConfig[col];
              return count > 0 ? (
                <div key={col} className="flex items-center gap-1.5 text-[10px] text-on-surface-variant px-2 border-r border-glass-border last:border-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {count}
                </div>
              ) : null;
            })}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
            <Input
              placeholder="Search talent..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 h-9 w-52 text-xs rounded-lg"
            />
          </div>

          <Button variant="primary" size="sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Screen
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 no-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full min-w-max pt-1">
            {COLUMNS.map(col => (
              <Column key={col} id={col} items={filtered.filter(c => c.status === col)} onCardClick={handleCardClick} />
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
            {activeCandidate ? (
              <div className="opacity-90 scale-105 rotate-1 shadow-[0_20px_60px_rgba(0,0,0,0.7)] rounded-xl border border-primary/40"
                style={{ background: 'rgba(79,70,229,0.15)', backdropFilter: 'blur(12px)' }}>
                <div className="p-4 flex items-center gap-3">
                  {activeCandidate.avatar ? (
                    <img src={activeCandidate.avatar} className="w-9 h-9 rounded-full" draggable="false" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary-gradient-start">
                      {activeCandidate.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-display font-semibold text-on-surface">{activeCandidate.name}</p>
                    <p className="text-[11px] text-on-surface-variant">{activeCandidate.role}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      {showSuccess && <SuccessAnimation onComplete={() => setShowSuccess(false)} />}
      </div>

      {/* Candidate Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Candidate Profile" width="max-w-[420px]">
        {selectedCandidate && (
          <CandidateDrawerContent
            candidate={selectedCandidate}
            onStatusChange={updateCandidateStatus}
            onSchedule={() => setIsModalOpen(true)}
          />
        )}
      </Drawer>

      {/* Schedule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Interview" size="md">
        <div className="space-y-5">
          {/* Candidate preview */}
          {selectedCandidate && (
            <div className="flex items-center gap-3 p-3 bg-surface-low border border-glass-border rounded-xl">
              {selectedCandidate.avatar ? (
                <img src={selectedCandidate.avatar} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary-gradient-start">
                  {selectedCandidate.name[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-display font-semibold text-on-surface">{selectedCandidate.name}</p>
                <p className="text-[11px] text-on-surface-variant">{selectedCandidate.role}</p>
              </div>
            </div>
          )}

          {/* Interview type */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Interview Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['Technical', 'Culture Fit', 'Final Round'].map((t, i) => (
                <button key={t} className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                  i === 0 ? 'bg-primary/15 border-primary/40 text-primary-gradient-start' : 'bg-surface-low border-glass-border text-on-surface-variant hover:bg-surface-high'
                }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Date</label>
              <input type="date" className="w-full h-10 rounded-lg bg-surface-low border border-glass-border px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Time</label>
              <input type="time" defaultValue="14:00" className="w-full h-10 rounded-lg bg-surface-low border border-glass-border px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Duration</label>
            <select className="w-full h-10 rounded-lg bg-surface-low border border-glass-border px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none">
              <option>30 Minutes</option>
              <option selected>45 Minutes</option>
              <option>60 Minutes</option>
              <option>90 Minutes</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Meeting Link (optional)</label>
            <Input placeholder="https://meet.google.com/..." className="h-10 text-xs" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-glass-border">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              <Calendar className="w-3.5 h-3.5 mr-1.5" /> Confirm Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
