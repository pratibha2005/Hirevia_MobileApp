"use client";

import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import {
  Users, Clock, AlertCircle, Briefcase, ChevronRight, Inbox, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activeJobs: 0,
    totalApplications: 0,
    candidatesToReview: 0,
    upcomingInterviews: 0
  });

  const [attentionJobs, setAttentionJobs] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [jobsRes, applicationsRes, interviewsRes] = await Promise.all([
        apiFetch('/api/jobs/hr/my').catch(() => ({ jobs: [] })),
        apiFetch('/api/applications/company').catch(() => ({ applications: [] })),
        apiFetch('/api/interviews').catch(() => ({ interviews: [] }))
      ]);

      const jobs = jobsRes.jobs || [];
      const applications = applicationsRes.applications || [];
      const interviews = interviewsRes.interviews || [];

      const activeJobs = jobs.filter((j: any) => j.status === 'Active');
      const underReview = applications.filter((a: any) => a.status === 'Under Review');

      setMetrics({
        activeJobs: activeJobs.length,
        totalApplications: applications.length,
        candidatesToReview: underReview.length,
        upcomingInterviews: interviews.length
      });

      // Find jobs with no applicants or stale jobs
      const jobsNeedingAttention = activeJobs.slice(0, 4); // simplistic for now
      setAttentionJobs(jobsNeedingAttention);

      // Recent applicant actions
      setRecentApplications(underReview.slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-on-surface-subtle text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-[1200px]"
    >
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-on-surface tracking-tight">
            Overview
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Your recruiting command center.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/jobs/new">
            <Button variant="primary" size="sm">
              <Briefcase className="w-3.5 h-3.5 mr-2" />
              Post a Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Priority Action Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">To Review</p>
            <div className="p-2 rounded-lg bg-surface-high border border-glass-border">
              <Inbox className="w-4 h-4 text-violet-400" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-display font-bold text-on-surface">{metrics.candidatesToReview}</span>
            <p className="text-xs text-on-surface-variant mt-1.5">candidates awaiting review</p>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Interviews</p>
            <div className="p-2 rounded-lg bg-surface-high border border-glass-border">
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-display font-bold text-on-surface">{metrics.upcomingInterviews}</span>
            <p className="text-xs text-on-surface-variant mt-1.5">upcoming or to schedule</p>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Active Jobs</p>
            <div className="p-2 rounded-lg bg-surface-high border border-glass-border">
              <Briefcase className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-display font-bold text-on-surface">{metrics.activeJobs}</span>
            <p className="text-xs text-on-surface-variant mt-1.5">currently open positions</p>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Total Pipeline</p>
            <div className="p-2 rounded-lg bg-surface-high border border-glass-border">
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-display font-bold text-on-surface">{metrics.totalApplications}</span>
            <p className="text-xs text-on-surface-variant mt-1.5">total active applicants</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Jobs Needing Attention */}
        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-glass-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-display font-semibold text-on-surface">Active Jobs</h3>
            </div>
            <Link href="/jobs">
              <Button variant="ghost" size="sm" className="text-[11px]">View all</Button>
            </Link>
          </div>
          <div className="divide-y divide-glass-border flex-1">
            {attentionJobs.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">
                No active jobs to display.
              </div>
            ) : (
              attentionJobs.map((job) => (
                <div key={job._id} className="p-4 flex items-center justify-between hover:bg-surface-low transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{job.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{job.department} • {job.location}</p>
                  </div>
                  <Link href={`/jobs/${job._id}`}>
                    <Button variant="secondary" size="sm">
                      Manage <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recently Applied */}
        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-glass-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-display font-semibold text-on-surface">Needs Review</h3>
            </div>
            <Link href="/candidates">
              <Button variant="ghost" size="sm" className="text-[11px]">Go to Pipeline</Button>
            </Link>
          </div>
          <div className="divide-y divide-glass-border flex-1">
            {recentApplications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">
                No new applications to review.
              </div>
            ) : (
              recentApplications.map((app) => (
                <div key={app._id} className="p-4 flex items-center justify-between hover:bg-surface-low transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{app.applicantId?.name || 'Unknown Candidate'}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Applied for <span className="text-on-surface font-medium">{app.jobId?.title || 'Unknown Job'}</span></p>
                  </div>
                  <Badge variant="info">Under Review</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
