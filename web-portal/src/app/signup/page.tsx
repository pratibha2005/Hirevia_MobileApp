'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, Zap, ArrowRight, AlertCircle, Loader2,
  User, Building2, Globe, CheckCircle2
} from 'lucide-react';
import { API_BASE_URL, isAuthenticated } from '@/lib/apiClient';

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyEmailDomain: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace('/');
  }, [router]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, companyName, companyEmailDomain } = form;

    if (!name || !email || !password || !companyName || !companyEmailDomain) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register/hr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, companyName, companyEmailDomain }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.');
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2500);
      }
    } catch {
      setError('Could not reach the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full h-12 rounded-xl text-sm text-white placeholder:text-[#4B5563] focus:outline-none transition-all`;
  const baseStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
  };
  const focusOn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(99,102,241,0.5)';
    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
  };
  const focusOff = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.10)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#080D1C' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[42%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D1228 0%, #131830 100%)' }}
      >
        <div className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full bg-[#4F46E5]/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/6 blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366F1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent tracking-tight">
            HireVia
          </span>
        </div>

        {/* Center */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white leading-[1.15] tracking-tight mb-5">
              Build your dream<br />
              <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">
                team faster.
              </span>
            </h1>
            <p className="text-[#9CA3AF] text-base leading-relaxed max-w-sm">
              Join hundreds of companies already using HireVia to streamline their entire recruitment workflow.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              'Drag-and-drop candidate pipeline',
              'AI-powered applicant screening',
              'Automated interview scheduling',
              'Real-time team collaboration',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5]/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-[#6366F1]" />
                </div>
                <span className="text-sm text-[#D1D5DB]">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div
          className="relative z-10 flex items-center gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Free for small teams</p>
            <p className="text-[11px] text-[#6B7280]">Up to 3 HR users · Unlimited candidates</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#4F46E5]/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-md py-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
              HireVia
            </span>
          </div>

          {/* Success state */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Account Created!</h2>
                <p className="text-[#9CA3AF] text-sm">
                  Your HR account is ready. Redirecting to login…
                </p>
                <div className="flex justify-center">
                  <div className="w-6 h-6">
                    <Loader2 className="w-6 h-6 text-[#6366F1] animate-spin" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create HR Account</h2>
                <p className="text-[#9CA3AF] text-sm">
                  Set up your company's recruiting workspace in seconds.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-[#6B7280]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                    <input
                      id="signup-name"
                      type="text"
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Jane Smith"
                      className={`${inputClass} pl-10 pr-4`}
                      style={{ ...baseStyle }}
                      onFocus={focusOn}
                      onBlur={focusOff}
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-[#6B7280]">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                    <input
                      id="signup-email"
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="jane@yourcompany.com"
                      autoComplete="email"
                      className={`${inputClass} pl-10 pr-4`}
                      style={{ ...baseStyle }}
                      onFocus={focusOn}
                      onBlur={focusOff}
                    />
                  </div>
                </div>

                {/* Company fields row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-[#6B7280]">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5563]" />
                      <input
                        id="signup-company-name"
                        type="text"
                        value={form.companyName}
                        onChange={set('companyName')}
                        placeholder="Acme Corp"
                        className={`${inputClass} pl-9 pr-3`}
                        style={{ ...baseStyle }}
                        onFocus={focusOn}
                        onBlur={focusOff}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-[#6B7280]">
                      Email Domain
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5563]" />
                      <input
                        id="signup-domain"
                        type="text"
                        value={form.companyEmailDomain}
                        onChange={set('companyEmailDomain')}
                        placeholder="acme.com"
                        className={`${inputClass} pl-9 pr-3`}
                        style={{ ...baseStyle }}
                        onFocus={focusOn}
                        onBlur={focusOff}
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-[#6B7280]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      className={`${inputClass} pl-10 pr-12`}
                      style={{ ...baseStyle }}
                      onFocus={focusOn}
                      onBlur={focusOff}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#9CA3AF] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-[#6B7280]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                    <input
                      id="signup-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={set('confirmPassword')}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      className={`${inputClass} pl-10 pr-12`}
                      style={{ ...baseStyle }}
                      onFocus={focusOn}
                      onBlur={focusOff}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#9CA3AF] transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm text-[#F87171]"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  id="signup-submit"
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
                  }}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <span className="text-[11px] text-[#4B5563] font-medium">Already have an account?</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <Link
                href="/login"
                className="w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#9CA3AF',
                }}
              >
                Sign In Instead
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
