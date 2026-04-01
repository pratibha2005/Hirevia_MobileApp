import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HireVia — Sign In',
  description: 'Sign in to the HireVia HR recruitment dashboard.',
};

// Auth pages (login, signup) use a completely clean layout — no sidebar, no topbar
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
