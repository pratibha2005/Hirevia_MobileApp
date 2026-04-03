import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'HireVia — Profile Settings',
  description: 'Edit your HR profile details and profile image.',
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}