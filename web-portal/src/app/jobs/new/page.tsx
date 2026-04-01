'use client';

import React, { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Briefcase, DollarSign, X, Plus,
  ChevronDown, Loader2, CheckCircle2, AlertCircle, FileText,
  Globe, Clock, Users, ToggleLeft, ToggleRight
} from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  skills: string[];
  noticePeriodRequired: boolean;
  relocationRequired: boolean;
  maxApplications: string;
  screeningQuestions: string[];
}

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'];

// ─── Small building blocks ─────────────────────────────────────────────────────
function SectionHeading({ icon: Icon, label, desc }: { icon: React.ElementType; label: string; desc?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <Icon className="w-4 h-4 text-[#818CF8]" />
      </div>
      <div>
        <p className="text-sm font-display font-semibold text-white">{label}</p>
        {desc && <p className="text-[11px] text-[#6B7280] mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] mb-1.5">
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
};
const focusStyle = 'focus:outline-none focus:ring-2 focus:ring-[rgba(99,102,241,0.35)] focus:border-[rgba(99,102,241,0.4)]';
const inputBase = `w-full rounded-xl text-sm text-white placeholder:text-[#4B5563] transition-all ${focusStyle}`;

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2.5 group"
    >
      {on ? (
        <ToggleRight className="w-5 h-5 text-[#6366F1] transition-colors" />
      ) : (
        <ToggleLeft className="w-5 h-5 text-[#4B5563] group-hover:text-[#6B7280] transition-colors" />
      )}
      <span className="text-sm text-[#9CA3AF] group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function PostJobPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: 'Full-Time',
    skills: [],
    noticePeriodRequired: false,
    relocationRequired: false,
    maxApplications: '',
    screeningQuestions: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const toggleBool = (key: 'noticePeriodRequired' | 'relocationRequired') =>
    setForm(prev => ({ ...prev, [key]: !prev[key] }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, s] }));
    }
    setSkillInput('');
  };

  const addQuestion = () => {
    const q = questionInput.trim();
    if (q) {
      setForm(prev => ({ ...prev, screeningQuestions: [...prev.screeningQuestions, q] }));
    }
    setQuestionInput('');
  };

  const handleSkillKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); }
  };

  const removeSkill = (s: string) =>
    setForm(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }));

  const removeQuestion = (i: number) =>
    setForm(prev => ({ ...prev, screeningQuestions: prev.screeningQuestions.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (status: 'Active' | 'Draft') => {
    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      setError('Title, description and location are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload: Record<string, any> = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        type: form.type,
        skills: form.skills,
        noticePeriodRequired: form.noticePeriodRequired,
        relocationRequired: form.relocationRequired,
        screeningQuestions: form.screeningQuestions,
        status,
      };
      if (form.salary.trim()) payload.salary = form.salary.trim();
      if (form.maxApplications) payload.maxApplications = parseInt(form.maxApplications, 10);

      await apiFetch('/api/jobs', { method: 'POST', body: JSON.stringify(payload) });
      setSuccess(true);
      setTimeout(() => router.push('/jobs'), 1800);
    } catch (e: any) {
      setError(e.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Job Posted!</h2>
        <p className="text-[#9CA3AF] text-sm mb-1">Redirecting to your jobs...</p>
        <Loader2 className="w-5 h-5 text-[#6366F1] animate-spin mt-3" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl mx-auto pb-12"
    >
      {/* Back nav */}
      <div className="mb-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Jobs
        </Link>
        <h2 className="text-xl font-display font-bold text-white mt-3 tracking-tight">Post a New Role</h2>
        <p className="text-xs text-[#6B7280] mt-0.5">Fill in the details to attract the best candidates.</p>
      </div>

      <div className="space-y-4">
        {/* ── Section 1: Role Basics ── */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <SectionHeading icon={Briefcase} label="Role Details" desc="Basic information about the position" />

          <div className="space-y-4">
            {/* Title */}
            <div>
              <FieldLabel>Job Title <span className="text-[#EF4444]">*</span></FieldLabel>
              <input
                value={form.title}
                onChange={set('title')}
                placeholder="e.g. Senior React Developer"
                className={`${inputBase} h-11 px-4`}
                style={inputStyle}
              />
            </div>

            {/* Location + Type row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Location <span className="text-[#EF4444]">*</span></FieldLabel>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5563]" />
                  <input
                    value={form.location}
                    onChange={set('location')}
                    placeholder="e.g. Remote / Bangalore, IN"
                    className={`${inputBase} h-11 pl-9 pr-4`}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Employment Type</FieldLabel>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setTypeOpen(v => !v)}
                    className={`${inputBase} h-11 px-4 pr-9 text-left flex items-center justify-between`}
                    style={inputStyle}
                  >
                    {form.type}
                    <ChevronDown className="w-3.5 h-3.5 text-[#4B5563] absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </button>
                  <AnimatePresence>
                    {typeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-0 right-0 mt-1 rounded-xl overflow-hidden z-20 shadow-2xl"
                        style={{ background: 'rgba(12,17,36,0.98)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
                      >
                        {JOB_TYPES.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => { setForm(p => ({ ...p, type: t })); setTypeOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${form.type === t ? 'text-[#818CF8] bg-[rgba(99,102,241,0.1)]' : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Salary row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Compensation (CTC)</FieldLabel>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5563]" />
                  <input
                    value={form.salary}
                    onChange={set('salary')}
                    placeholder="e.g. ₹18–24 LPA or $120k"
                    className={`${inputBase} h-11 pl-9 pr-4`}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Max Applications</FieldLabel>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5563]" />
                  <input
                    type="number"
                    value={form.maxApplications}
                    onChange={set('maxApplications')}
                    placeholder="No limit"
                    min="1"
                    className={`${inputBase} h-11 pl-9 pr-4`}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-6 flex-wrap pt-2">
              <Toggle
                on={form.noticePeriodRequired}
                onToggle={() => toggleBool('noticePeriodRequired')}
                label="Notice period required"
              />
              <Toggle
                on={form.relocationRequired}
                onToggle={() => toggleBool('relocationRequired')}
                label="Relocation required"
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Description ── */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <SectionHeading icon={FileText} label="Job Description" desc="Write a compelling description to attract the right candidates" />
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={7}
            placeholder="Describe the role, responsibilities, what makes this opportunity exciting, and what the team is like..."
            className={`${inputBase} px-4 py-3 resize-y min-h-[140px]`}
            style={inputStyle}
          />
          <p className="text-[10px] text-[#4B5563] mt-1.5">{form.description.length} characters</p>
        </div>

        {/* ── Section 3: Skills ── */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <SectionHeading icon={Globe} label="Required Skills" desc="Add skills applicants should have (press Enter or comma to add)" />

          <div className="flex gap-2 mb-3">
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKey}
              placeholder="e.g. React, Node.js, Python..."
              className={`${inputBase} h-10 px-4 flex-1`}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={addSkill}
              className="h-10 px-4 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5 shrink-0 transition-all"
              style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.skills.map(s => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 text-[11px] pl-2.5 pr-1.5 py-1 rounded-lg font-medium text-[#818CF8]"
                  style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
                >
                  {s}
                  <button onClick={() => removeSkill(s)} className="hover:text-white transition-colors rounded-sm">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Section 4: Screening Questions ── */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <SectionHeading icon={Clock} label="Screening Questions" desc="Optional questions applicants will answer when applying" />

          <div className="flex gap-2 mb-3">
            <input
              value={questionInput}
              onChange={e => setQuestionInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addQuestion(); } }}
              placeholder="e.g. Do you have 5+ years of experience in React?"
              className={`${inputBase} h-10 px-4 flex-1`}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={addQuestion}
              className="h-10 px-4 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5 shrink-0 transition-all"
              style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {form.screeningQuestions.length > 0 && (
            <div className="space-y-2">
              {form.screeningQuestions.map((q, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl text-sm text-[#D1D5DB]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 text-[#818CF8]"
                    style={{ background: 'rgba(99,102,241,0.15)' }}>{i + 1}</span>
                  <span className="flex-1 text-[13px]">{q}</span>
                  <button onClick={() => removeQuestion(i)} className="text-[#4B5563] hover:text-[#F87171] transition-colors shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 p-3.5 rounded-xl text-[#F87171]"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSubmit('Draft')}
            disabled={loading}
            className="h-10 px-5 rounded-xl text-sm font-semibold text-[#9CA3AF] hover:text-white transition-all disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('Active')}
            disabled={loading}
            className="h-10 px-6 rounded-xl text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 4px 20px rgba(79,70,229,0.3)' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Job'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
