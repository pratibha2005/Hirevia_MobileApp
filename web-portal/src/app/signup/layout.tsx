import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HireVia — Create Account',
  description: 'Create your HR account on HireVia.',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
