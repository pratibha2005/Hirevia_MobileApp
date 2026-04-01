"use client";

import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  LineChart, Line
} from 'recharts';
import { Briefcase, Users, Calendar, Award } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';

type TimeRange = '24h' | 'week' | 'month' | 'year';

export default function AnalyticsPage() {
  const [globalRange, setGlobalRange] = useState<TimeRange>('week');
  const [isLoading, setIsLoading] = useState(true);

  const [jobsData, setJobsData] = useState([]);
  const [hiredData, setHiredData] = useState([]);
  const [interviewsData, setInterviewsData] = useState([]);
  
  const [summary, setSummary] = useState({
      totalJobs: 0,
      totalCandidates: 0,
      interviewsScheduled: 0,
      candidatesHired: 0
  });

  const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
          const res = await apiFetch(`/api/analytics?range=${globalRange}`);
          if (res.success) {
              setJobsData(res.charts.jobs);
              setHiredData(res.charts.hired);
              setInterviewsData(res.charts.interviews);
              setSummary(res.summary);
          }
      } catch (err) {
          console.error("Failed to fetch analytics:", err);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      fetchAnalytics();
  }, [globalRange]);

  const StatCard = ({ title, value, icon: Icon }: any) => (
    <div className="bg-surface-lowest border border-glass-border rounded-xl p-6 hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{title}</p>
        <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div>
        <h3 className="text-4xl font-display font-bold text-on-surface tracking-tight">{value}</h3>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-high border border-glass-border p-4 rounded-xl shadow-glass backdrop-blur-md">
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-on-surface font-bold text-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.value} {entry.name}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-on-surface mb-2">Analytics</h1>
          <p className="text-on-surface-variant text-sm">Key metrics and hiring insights.</p>
        </div>

        <div className="flex bg-surface-lowest rounded-full p-1 border border-glass-border">
          {(['24h', 'week', 'month', 'year'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setGlobalRange(range)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-all duration-200 ${
                globalRange === range
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-mid'
              }`}
            >
              {range === '24h' ? '24H' : range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Jobs" value={summary.totalJobs} icon={Briefcase} />
        <StatCard title="Total Candidates" value={summary.totalCandidates} icon={Users} />
        <StatCard title="Interviews Scheduled" value={summary.interviewsScheduled} icon={Calendar} />
        <StatCard title="Candidates Hired" value={summary.candidatesHired} icon={Award} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-surface-lowest border border-glass-border rounded-2xl p-6 xl:col-span-2 shadow-glass relative overflow-hidden h-[400px] flex flex-col">
          <div className="flex items-center gap-3 mb-6 z-10 w-full relative">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h2 className="text-sm uppercase tracking-wider font-bold text-on-surface">Jobs Posted</h2>
          </div>
          
          <div className="flex-1 w-full min-h-0 z-10">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="5%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip cursor={false} content={<CustomTooltip />} />
                  <Bar dataKey="Jobs" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={60} activeBar={{ filter: 'brightness(1.25)' }}>
                    {jobsData.map((entry: any, index: number) => {
                      const isLast = index === jobsData.length - 1;
                      return <Cell key={`cell-${index}`} fill={isLast ? 'var(--primary)' : 'rgba(79, 70, 229, 0.4)'} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-surface-lowest border border-glass-border rounded-2xl p-6 shadow-glass relative overflow-hidden h-[350px] flex flex-col">
          <div className="flex items-center gap-3 mb-6 z-10 w-full">
            <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
            <h2 className="text-sm uppercase tracking-wider font-bold text-on-surface">Candidates Hired</h2>
          </div>

          <div className="flex-1 w-full min-h-0 z-10">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hiredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} dx={-10} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="Hired" 
                    stroke="var(--secondary)" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: 'var(--background)', stroke: 'var(--secondary)', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: 'var(--secondary)', stroke: 'var(--background)', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-surface-lowest border border-glass-border rounded-2xl p-6 shadow-glass relative overflow-hidden h-[350px] flex flex-col">
          <div className="flex items-center gap-3 mb-6 z-10 w-full">
            <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
            <h2 className="text-sm uppercase tracking-wider font-bold text-on-surface">Interviews Conducted</h2>
          </div>

          <div className="flex-1 w-full min-h-0 z-10">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={interviewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} dx={-10} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="Interviews" 
                    stroke="#ec4899" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorInterviews)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
