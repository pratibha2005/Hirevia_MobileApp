import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Split path into segments and remove empty strings
  const pathSegments = pathname.split('/').filter(segment => segment);

  if (pathSegments.length === 0) return null; // Don't show on root

  return (
    <nav className="flex items-center space-x-1 text-xs text-on-surface-muted mb-4 pl-1" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-primary transition-colors flex items-center">
        <Home className="w-3.5 h-3.5" />
      </Link>
      
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const displayName = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-3.5 h-3.5 mx-0.5 text-glass-border" />
            
            {isLast ? (
              <span className="font-medium text-on-surface" aria-current="page">
                {displayName}
              </span>
            ) : (
              <Link href={path} className="hover:text-primary transition-colors">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
