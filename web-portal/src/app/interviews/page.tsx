"use client";

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { useToast } from '@/lib/toast-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import {
  Video, Clock, ChevronLeft, ChevronRight, Plus,
  Calendar, CheckCircle2, AlertCircle, RefreshCw,
  MoreHorizontal, Users, Zap, Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCenter, useSensor, useSensors, PointerSensor,
  DragEndEvent, DragOverlay, DragStartEvent, useDroppable, useDraggable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// ─── Types & Data ─────────────────────────────────────────────────────────────
interface Interview {
  id: string;
  candidateName: string;
  candidateAvatar: string;
  role: string;
  type: string;
  status: 'Confirmed' | 'Pending';
  timeSlotId: string;
  duration: number;
}

const initialInterviews: Interview[] = [];

const timeSlots = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dates = [28, 29, 30, 31, 1];

// ─── Draggable Interview Card ─────────────────────────────────────────────────
function DraggableInterviewCard({ interview, compact = false }: { interview: Interview; compact?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: interview.id,
    data: { interview },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  const isConfirmed = interview.status === 'Confirmed';

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="w-full group">
      <div className={`relative rounded-xl border overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200
        ${isConfirmed 
          ? 'border-success/30 bg-success/5 hover:border-success/50' 
          : 'border-warning/30 bg-warning/5 hover:border-warning/50'
        } hover:-translate-y-0.5 hover:shadow-glass`}>
        
        {/* Left accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isConfirmed ? 'bg-success' : 'bg-warning'}`} />

        <div className="pl-4 pr-3 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              {interview.candidateAvatar ? (
                <img src={interview.candidateAvatar} alt={interview.candidateName} className="w-8 h-8 rounded-full border border-glass-border object-cover" draggable="false" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary-gradient-start">
                  {interview.candidateName[0]}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-xs font-display font-semibold text-on-surface truncate group-hover:text-primary-gradient-start transition-colors">{interview.candidateName}</h4>
                <p className="text-[10px] text-on-surface-variant truncate">{interview.role} · {interview.type}</p>
              </div>
            </div>
            <Badge variant={isConfirmed ? 'confirmed' : 'pending'} className="text-[9px] shrink-0">{interview.status}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
              <Clock className="w-3 h-3" />
              <span>{interview.duration} hr block · {interview.timeSlotId}</span>
            </div>
            <div className="flex gap-1">
              <Button variant="primary" size="icon-sm" className="h-6 w-6 rounded-md shadow-none" title="Join Meeting">
                <Video className="w-3 h-3" />
              </Button>
              <button className="h-6 w-6 rounded-md bg-surface-high border border-glass-border flex items-center justify-center hover:bg-surface-highest transition-colors" title="Reschedule">
                <RefreshCw className="w-2.5 h-2.5 text-on-surface-variant" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Droppable Time Slot ──────────────────────────────────────────────────────
function DroppableTimeSlot({ timeSlot, interviews, isCurrentTime }: { timeSlot: string; interviews: Interview[]; isCurrentTime?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: timeSlot });
  const hour = parseInt(timeSlot);
  const isPM = hour >= 12;
  const displayHour = hour > 12 ? hour - 12 : hour;

  return (
    <div className={`flex min-h-[88px] border-b border-glass-border/40 last:border-0 group transition-colors ${isOver ? 'bg-primary/5' : ''}`}>
      {/* Time label */}
      <div className="w-20 shrink-0 flex flex-col items-end justify-start pt-3 pr-4 border-r border-glass-border/40">
        <span className={`text-xs font-display font-bold tabular-nums ${isCurrentTime ? 'text-primary-gradient-start' : 'text-on-surface-variant'}`}>
          {displayHour}:00
        </span>
        <span className={`text-[9px] font-semibold uppercase tracking-widest ${isCurrentTime ? 'text-primary-gradient-start/70' : 'text-on-surface-subtle'}`}>
          {isPM ? 'PM' : 'AM'}
        </span>
        {isCurrentTime && (
          <div className="mt-1 w-1 h-1 rounded-full bg-primary-gradient-start animate-pulse" />
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 px-3 py-2.5 transition-all duration-200 relative ${
          isOver ? 'bg-primary/8 border border-dashed border-primary/40 rounded-lg m-1' : ''
        }`}
      >
        {interviews.length > 0 ? (
          <div className="space-y-2">
            {interviews.map(i => (
              <DraggableInterviewCard key={i.id} interview={i} />
            ))}
          </div>
        ) : (
          <div className={`h-full flex items-center transition-opacity ${isOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <span className="text-[10px] text-primary-gradient-start font-semibold bg-primary/10 border border-primary/20 px-2 py-1 rounded-lg cursor-pointer hover:bg-primary/15 transition-colors">
              + Schedule here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InterviewScheduling() {
  const { addToast } = useToast();
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(2); // Wed = index 2
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New Interview Form State
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('candidate@example.com');
  const [interviewDate, setInterviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [interviewType, setInterviewType] = useState('Technical Screen');
  const [interviewDescription, setInterviewDescription] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const data = await apiFetch('/api/interviews');
      if (data.success) {
        setInterviews(data.interviews.map((inv: any) => ({
          id: inv._id,
          candidateName: inv.candidateName,
          candidateAvatar: '',
          role: inv.jobTitle || 'Candidate',
          type: inv.title || 'Interview',
          status: 'Confirmed', // We can derive this if needed later
          timeSlotId: inv.startTime.substring(0, 5), // e.g. "10:00"
          duration: 1
        })));
      }
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
    }
  };

  const handlePostInterview = async () => {
    if (isLoading) return; // Prevent multiple clicks
    if (!candidateName.trim() || !candidateEmail.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please fill in all required fields',
      });
      return;
    }

    setIsLoading(true);
    const defaultEnd = parseInt(startTime.split(':')[0]) + 1;
    let endTime = `${defaultEnd < 10 ? '0' : ''}${defaultEnd}:00`;

    try {
      const data = await apiFetch('/api/interviews', {
        method: 'POST',
        body: JSON.stringify({
          title: interviewType,
          candidateName,
          candidateEmail,
          interviewDate,
          startTime,
          endTime,
          mode: 'Google Meet',
          notes: interviewDescription
        })
      });

      if (data.success) {
        const generatedMeetLink = data.interview?.meetingLink;
        addToast({
          type: 'success',
          title: 'Interview Scheduled Successfully! 🎉',
          description: generatedMeetLink
            ? `Email sent to ${candidateEmail} with Meet link`
            : `Email sent to ${candidateEmail}`,
          duration: 5000,
        });
        setShowAddModal(false);
        fetchInterviews();
        setCandidateName('');
        setCandidateEmail('candidate@example.com');
        setInterviewDescription('');
        setStartTime('10:00');
        setInterviewType('Technical Screen');
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: data.message || 'Failed to schedule interview',
        });
      }
    } catch (error: any) {
      console.error('Error scheduling:', error);
      addToast({
        type: 'error',
        title: 'Error',
        description: error.message || 'Failed to schedule interview',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);
  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (over?.id) {
      const newSlot = over.id as string;
      setInterviews(prev => prev.map(inv => inv.id === active.id ? { ...inv, timeSlotId: newSlot } : inv));
      
      try {
        await apiFetch(`/api/interviews/${active.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ startTime: newSlot })
        });
      } catch (err) {
        console.error('Failed to update interview slot', err);
      }
    }
  };

  const activeInterview = interviews.find(i => i.id === activeId);
  const confirmed = interviews.filter(i => i.status === 'Confirmed').length;
  const pending = interviews.filter(i => i.status === 'Pending').length;

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(4px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4 }}
      className="space-y-5 h-[calc(100vh-5rem)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-display font-semibold text-on-surface tracking-tight">Interview Schedule</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Drag cards to reschedule · Click to view details</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Sync Calendar
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Interview
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 shrink-0">
        {[
          { label: 'Total Today', value: interviews.length, icon: Calendar, color: 'text-primary-gradient-start', bg: 'bg-primary/10 border-primary/20' },
          { label: 'Confirmed', value: confirmed, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10 border-success/20' },
          { label: 'Pending', value: pending, icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
          { label: 'Candidates', value: new Set(interviews.map(i => i.candidateName)).size, icon: Users, color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20' },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${s.bg} transition-all`}>
            <s.icon className={`w-4 h-4 ${s.color}`} />
            <div>
              <p className={`text-lg font-display font-bold ${s.color} leading-none`}>{s.value}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar + Timeline */}
      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Day selector */}
        <div className="flex flex-col shrink-0 w-64">
          {/* Week nav */}
          <div className="flex items-center justify-between mb-3 bg-surface-low border border-glass-border rounded-xl px-3 py-2">
            <button className="w-7 h-7 rounded-lg hover:bg-surface-high flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
            </button>
            <span className="text-xs font-display font-semibold text-on-surface">March 2026</span>
            <button className="w-7 h-7 rounded-lg hover:bg-surface-high flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>

          {/* Day pills */}
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {days.map((day, i) => {
              const count = i === selectedDay ? interviews.length : Math.max(0, 2 - i);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(i)}
                  className={`flex flex-col items-center py-2.5 rounded-xl border transition-all ${
                    selectedDay === i
                      ? 'bg-primary/20 border-primary/40 text-on-surface'
                      : 'bg-surface-low border-glass-border text-on-surface-variant hover:bg-surface-high'
                  }`}
                >
                  <span className="text-[9px] font-semibold uppercase tracking-wider mb-1">{day}</span>
                  <span className={`text-sm font-display font-bold ${selectedDay === i ? 'text-primary-gradient-start' : ''}`}>
                    {dates[i]}
                  </span>
                  {count > 0 && (
                    <div className={`mt-1 w-1 h-1 rounded-full ${selectedDay === i ? 'bg-primary-gradient-start' : 'bg-on-surface-subtle'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Today's interview list */}
          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle mb-2">Today's Lineup</p>
            {interviews.map(inv => (
              <div key={inv.id} className="flex items-center gap-2.5 bg-surface-low border border-glass-border rounded-xl p-3 hover:bg-surface-high transition-colors cursor-pointer group">
                {inv.candidateAvatar ? (
                  <img src={inv.candidateAvatar} alt={inv.candidateName} className="w-8 h-8 rounded-full object-cover border border-glass-border shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary-gradient-start shrink-0">
                    {inv.candidateName[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary-gradient-start transition-colors">{inv.candidateName}</p>
                  <p className="text-[10px] text-on-surface-variant">{inv.timeSlotId} · {inv.type}</p>
                </div>
                <Badge variant={inv.status === 'Confirmed' ? 'confirmed' : 'pending'} className="text-[9px] shrink-0">{inv.status === 'Confirmed' ? '✓' : '…'}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 rounded-xl border border-glass-border overflow-hidden flex flex-col"
          style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}>
          
          {/* Timeline header */}
          <div className="flex items-center px-5 py-3.5 border-b border-glass-border bg-surface-low/30 shrink-0">
            <div className="w-20 shrink-0" />
            <div className="flex-1 flex items-center justify-between">
              <div>
                <span className="text-sm font-display font-semibold text-on-surface">
                  {days[selectedDay]}, March {dates[selectedDay]}
                </span>
                <span className="text-[11px] text-on-surface-variant ml-2">{interviews.length} interview{interviews.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-success" /> Confirmed
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-warning" /> Pending
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable time slots */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="py-2">
                {timeSlots.map(time => (
                  <DroppableTimeSlot
                    key={time}
                    timeSlot={time}
                    interviews={interviews.filter(i => i.timeSlotId === time)}
                    isCurrentTime={time === '15:00'}
                  />
                ))}
              </div>

              <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeInterview ? (
                  <div className="opacity-90 scale-105 rotate-1 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
                    <DraggableInterviewCard interview={activeInterview} />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>

      {/* Add Interview Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Schedule Interview" size="md">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Candidate Name</label>
            <Input 
              placeholder="E.g., John Doe" 
              className="text-xs h-9" 
              value={candidateName} 
              onChange={e => setCandidateName(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Candidate Email</label>
            <Input 
              placeholder="candidate@example.com" 
              className="text-xs h-9" 
              value={candidateEmail} 
              onChange={e => setCandidateEmail(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Date</label>
              <input 
                type="date" 
                value={interviewDate}
                onChange={e => setInterviewDate(e.target.value)}
                className="w-full h-9 rounded-lg bg-surface-low border border-glass-border px-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" 
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Time</label>
              <input 
                type="time" 
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full h-9 rounded-lg bg-surface-low border border-glass-border px-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" 
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Interview Type</label>
            <select
              value={interviewType}
              onChange={e => setInterviewType(e.target.value)}
              className="w-full h-9 rounded-lg bg-surface-low border border-glass-border px-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none"
            >
              <option>Technical Screen</option>
              <option>Portfolio Review</option>
              <option>Culture Fit</option>
              <option>Final Round</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-subtle block mb-2">Description</label>
            <textarea
              placeholder="Add interview details, topics to cover, or any notes..."
              className="w-full h-16 rounded-lg bg-surface-low border border-glass-border px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
              value={interviewDescription}
              onChange={e => setInterviewDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-glass-border">
            <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)} disabled={isLoading}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handlePostInterview} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5 mr-1.5" /> Schedule
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
