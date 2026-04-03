'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, Briefcase, TrendingUp, Search, 
  FileText, Eye, CheckSquare, AlertCircle, Inbox
} from 'lucide-react';
import { Button } from './button';
import { EmptyStateAnimation } from './EmptyStateAnimation';
import { cn } from '@/lib/utils';

type EmptyStateType = 
  | 'candidates' 
  | 'interviews' 
  | 'jobs' 
  | 'analytics' 
  | 'search' 
  | 'filter' 
  | 'applications'
  | 'generic';

const emptyStateConfig: Record<
  EmptyStateType,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
  }
> = {
  candidates: {
    icon: <Users className="w-12 h-12" />,
    title: 'No Candidates Yet',
    description: 'Start building your talent pipeline. Import candidates or wait for applications to arrive.',
    gradient: 'from-blue-500 to-cyan-400',
  },
  interviews: {
    icon: <Calendar className="w-12 h-12" />,
    title: 'No Interviews Scheduled',
    description: 'Schedule interviews with shortlisted candidates to move them through the hiring pipeline.',
    gradient: 'from-purple-500 to-pink-400',
  },
  jobs: {
    icon: <Briefcase className="w-12 h-12" />,
    title: 'No Jobs Posted',
    description: 'Create a new job posting to start your recruitment process.',
    gradient: 'from-indigo-500 to-purple-400',
  },
  analytics: {
    icon: <TrendingUp className="w-12 h-12" />,
    title: 'No Analytics Data',
    description: 'Analytics will appear here as your hiring process progresses.',
    gradient: 'from-green-500 to-emerald-400',
  },
  search: {
    icon: <Search className="w-12 h-12" />,
    title: 'No Results Found',
    description: 'Try adjusting your search terms or filters to find what you are looking for.',
    gradient: 'from-orange-500 to-red-400',
  },
  filter: {
    icon: <AlertCircle className="w-12 h-12" />,
    title: 'No Results Match Your Filters',
    description: 'Clear some filters or adjust your criteria to see more results.',
    gradient: 'from-yellow-500 to-orange-400',
  },
  applications: {
    icon: <FileText className="w-12 h-12" />,
    title: 'No Applications',
    description: 'Applications for this job will appear here once candidates apply.',
    gradient: 'from-teal-500 to-cyan-400',
  },
  generic: {
    icon: <Inbox className="w-12 h-12" />,
    title: 'Nothing Here',
    description: 'There is no data to display right now.',
    gradient: 'from-slate-500 to-slate-400',
  },
};

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  type = 'generic',
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayIcon = icon || config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4',
        className
      )}
    >
      {/* Animated Icon */}
      <EmptyStateAnimation />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.1 }}
        className="text-center max-w-sm"
      >
        <h3 className="text-lg font-semibold text-on-surface mb-2">
          {displayTitle}
        </h3>
        <p className="text-sm text-on-surface-variant mb-6">
          {displayDescription}
        </p>

        {/* Action Button */}
        {action && (
          <Button
            variant="primary"
            size="sm"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-10 left-10 w-40 h-40 rounded-full opacity-5 filter blur-3xl"
          style={{
            background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-48 h-48 rounded-full opacity-5 filter blur-3xl"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          }}
        />
      </div>
    </div>
  );
}
