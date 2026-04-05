'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  Loader2,
  Mail,
  Save,
  Trash2,
  UserRound,
} from 'lucide-react';
import { apiFetch, getStoredUser, updateStoredUser } from '@/lib/apiClient';

type ProfileUser = {
  id?: string;
  name: string;
  email?: string;
  companyName?: string;
  profileImage?: string;
  role?: string;
  companyId?: string;
  resumeUrl?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'H';
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<ProfileUser>({ name: 'HR User' });
  const [name, setName] = useState('HR User');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      const nextUser = {
        ...stored,
        name: stored.name || 'HR User',
        profileImage: stored.profileImage || '',
      };
      setUser(nextUser);
      setName(nextUser.name);
      setProfileImage(nextUser.profileImage || '');
    }

    const loadProfile = async () => {
      try {
        const data = await apiFetch<{ user: ProfileUser }>('/api/auth/profile');
        if (data?.user) {
          const nextUser = {
            ...(stored || {}),
            ...data.user,
            name: data.user.name || 'HR User',
            profileImage: data.user.profileImage || '',
          };
          setUser(nextUser);
          setName(nextUser.name);
          setProfileImage(nextUser.profileImage || '');
          updateStoredUser(nextUser);
        }
      } catch (err: any) {
        setError(err.message || 'Could not load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be 2 MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(typeof reader.result === 'string' ? reader.result : '');
      setError('');
      setSuccess('');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const data = await apiFetch<{ user: ProfileUser; message?: string }>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          profileImage,
        }),
      });

      if (data?.user) {
        const nextUser = {
          ...user,
          ...data.user,
          name: data.user.name || 'HR User',
          profileImage: data.user.profileImage || '',
        };
        setUser(nextUser);
        setName(nextUser.name);
        setProfileImage(nextUser.profileImage || '');
        updateStoredUser(nextUser);
        setSuccess('Profile saved successfully.');
      } else {
        setSuccess(data?.message || 'Profile saved successfully.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const clearImage = () => {
    setProfileImage('');
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayName = name.trim() || user.name || 'HR User';

  return (
    <div className="min-h-[calc(100vh-64px)] pb-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-display font-semibold tracking-tight text-on-surface">Profile Settings</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Update the name and avatar shown in the top-right corner.</p>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-glass-border bg-surface-lowest px-3 py-2 text-xs text-on-surface-variant shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-success" />
          Changes sync instantly after save
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {success}
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onSubmit={handleSave}
        className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]"
      >
        <section className="rounded-3xl border border-glass-border bg-surface-base/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-subtle">Avatar</p>
              <h2 className="mt-1 text-lg font-semibold text-on-surface">Profile picture</h2>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <Camera className="w-4 h-4" />
              Choose image from device
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            <div className="relative">
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[2rem] border border-glass-border bg-surface-lowest shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                {profileImage ? (
                  <img src={profileImage} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary-gradient text-4xl font-bold text-white">
                    {getInitials(displayName)}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 inline-flex h-12 w-12 items-center justify-center rounded-full border border-glass-border bg-surface-base text-on-surface shadow-lg transition-transform hover:scale-105"
                aria-label="Change profile image"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-1">
              <p className="text-base font-semibold text-on-surface">{displayName}</p>
              <p className="text-sm text-on-surface-variant">{user.email || 'No email available'}</p>
              {user.companyName && (
                <p className="text-xs text-on-surface-subtle">{user.companyName}</p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-surface-lowest px-4 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-low"
              >
                <UserRound className="w-4 h-4" />
                Change photo
              </button>
              <button
                type="button"
                onClick={clearImage}
                className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-surface-lowest px-4 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:text-danger hover:bg-danger/10"
              >
                <Trash2 className="w-4 h-4" />
                Remove photo
              </button>
            </div>

            <p className="mt-4 max-w-xs text-xs leading-5 text-on-surface-subtle">
              JPG, PNG, or WebP only. Keep it under 2 MB for faster loading.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-glass-border bg-surface-base/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between gap-3 border-b border-glass-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-subtle">Profile</p>
              <h2 className="mt-1 text-lg font-semibold text-on-surface">Edit details</h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-on-surface-subtle">
              <Save className="w-4 h-4" />
              Saved data updates your header badge
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-subtle">Name</span>
                <div className="flex items-center gap-3 rounded-2xl border border-glass-border bg-surface-lowest px-4 py-3 focus-within:border-primary/50">
                  <UserRound className="w-4 h-4 text-on-surface-subtle" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-subtle focus:outline-none"
                  />
                </div>
              </label>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-subtle">Email</span>
                <div className="flex items-center gap-3 rounded-2xl border border-glass-border bg-surface-lowest px-4 py-3 text-sm text-on-surface-variant">
                  <Mail className="w-4 h-4 text-on-surface-subtle" />
                  <span>{user.email || 'No email available'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-subtle">Workspace</span>
                <div className="flex items-center gap-3 rounded-2xl border border-glass-border bg-surface-lowest px-4 py-3 text-sm text-on-surface-variant">
                  <Building2 className="w-4 h-4 text-on-surface-subtle" />
                  <span>{user.companyName || 'HireVia'}</span>
                </div>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-dashed border-glass-border bg-surface-lowest/60 p-4 text-sm text-on-surface-variant">
                Tip: after you save, the top-right profile chip updates immediately with the new name and photo.
              </div>

              <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save changes'}
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="rounded-full border border-glass-border bg-surface-lowest px-5 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface hover:bg-surface-low"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </motion.form>
    </div>
  );
}