import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { NotFoundAnimation } from '@/components/ui/NotFoundAnimation';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 mix-blend-plus-lighter">
      <div className="w-full max-w-[400px] mb-8">
        <NotFoundAnimation / >
      </div>
      <h1 className="text-3xl font-display font-bold gradient-text mb-4">
        Page Not Found
      </h1>
      <p className="text-on-surface-variant max-w-md mb-8">
        Oops! We can't seem to find the page you're looking for. It might have been removed, renamed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button variant="primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
