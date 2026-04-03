"use client";

import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import {
  Users, Clock, AlertCircle, Briefcase, ChevronRight, Inbox, Calendar, TrendingUp, Filter, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const applicationsData = [
  { name: "Mon", apps: 12 },
  { name: "Tue", apps: 19 },
  { name: "Wed", apps: 15 },
  { name: "Thu", apps: 22 },
  { name: "Fri", apps: 30 },
  { name: "Sat", apps: 10 }, 
  { name: "Sun", apps: 8 },
];

const jobsData = [
  { name: "Frontend Dev", applicants: 45 },
  { name: "Backend Dev", applicants: 30 },
  { name: "UX Designer", applicants: 25 },
  { name: "Product Mgr", applicants: 15 },
];

const successRateData = [
  { name: "Hired", value: 12 },
  { name: "Rejected", value: 68 },
  { name: "Withdrawn", value: 20 },
];
const COLORS = ["#10b981", "#f43f5e", "#f59e0b"];

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
                  <Badge variant="default">Under Review</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Hiring Funnel Visualization */}
      <Card className="p-6">
          <div className="mb-6">
              <h2 className="text-xl font-display font-bold text-on-surface">Hiring Funnel</h2>
              <p className="text-sm text-on-surface-variant">Candidate flow across all active positions</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {[ 
                  { stage: "Applied", count: metrics.totalApplications || 145, color: "text-[#3B82F6] bg-[rgba(59,130,246,0.15)] border-[#3B82F6]/30" },
                  { stage: "Reviewed", count: metrics.candidatesToReview > 0 ? metrics.candidatesToReview : 89, color: "text-[#6366F1] bg-[rgba(99,102,241,0.15)] border-[#6366F1]/30" },
                  { stage: "Shortlisted", count: 34, color: "text-[#8B5CF6] bg-[rgba(139,92,246,0.15)] border-[#8B5CF6]/30" },
                  { stage: "Interview", count: metrics.upcomingInterviews > 0 ? metrics.upcomingInterviews : 12, color: "text-[#EC4899] bg-[rgba(236,72,153,0.15)] border-[#EC4899]/30" },
                  { stage: "Hired", count: 3, color: "text-[#10B981] bg-[rgba(16,185,129,0.15)] border-[#10B981]/30" }
              ].map((step, idx, arr) => (
                  <div key={step.stage} className="flex-1 w-full flex flex-col items-center relative gap-2">
                      <div className="w-full flex items-center justify-center relative">
                          <div className={`h-16 w-full max-w-[120px] rounded-xl border flex items-center justify-center flex-col z-10 shadow-sm ${step.color}`}>
                              <span className="text-2xl font-bold">{step.count}</span>
                          </div>
                          {idx < arr.length - 1 && (
                              <div className="hidden md:block absolute right-[-50%] w-full h-[2px] bg-glass-border z-0" />
                          )}
                      </div>
                      <span className="text-sm font-semibold text-on-surface-variant mt-2">{step.stage}</span>
                  </div>
              ))}
          </div>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
              <h3 className="text-sm font-display font-semibold text-on-surface mb-4">Applications per day</h3>
              <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={applicationsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                          <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} width={30} />
                          <Tooltip contentStyle={{ backgroundColor: "#1e1e2d", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                          <Line type="monotone" dataKey="apps" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </Card>

          <Card className="p-6">
              <h3 className="text-sm font-display font-semibold text-on-surface mb-4">Jobs with most applicants</h3>
              <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={jobsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                          <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val.split(' ')[0]} />
                          <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} width={30} />
                          <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ backgroundColor: "#1e1e2d", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                          <Bar dataKey="applicants" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </Card>

          <Card className="p-6 flex flex-col items-center justify-center gap-2">
              <div className="w-full">
                  <h3 className="text-sm font-display font-semibold text-on-surface mb-1">Hiring Success Rate</h3>
                  <p className="text-xs text-on-surface-variant">Out of totally processed</p>
              </div>
              <div className="h-44 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={successRateData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                          >
                              {successRateData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#1e1e2d", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                      <span className="text-xl font-bold text-on-surface">12%</span>
                      <span className="text-[10px] text-on-surface-variant">Hired</span>
                  </div>
              </div>
              <div className="flex gap-3 text-[11px] mt-2">
                  {successRateData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                          <span className="text-on-surface-variant">{entry.name}</span>
                      </div>
                  ))}
              </div>
          </Card>
      </div>

    </motion.div>
  );
}
