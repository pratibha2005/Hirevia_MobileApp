import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700'],
});

const manrope = Manrope({
    subsets: ['latin'],
    variable: '--font-manrope',
    display: 'swap',
    weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
    title: 'HireVia — Premium Recruitment Platform',
    description: 'High-end B2B Recruitment & Applicant Tracking System. Manage your entire hiring pipeline with a modern, intuitive interface.',
    keywords: ['hiring', 'recruitment', 'ATS', 'applicant tracking', 'HR software'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
            <body className="min-h-screen antialiased transition-colors duration-300">
                <ThemeProvider>
                    <AppShell>{children}</AppShell>
                </ThemeProvider>
            </body>
        </html>
    );
}
