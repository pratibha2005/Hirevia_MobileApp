import type { Metadata } from 'next';
import { Epilogue } from 'next/font/google';
import './globals.css';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-epilogue',
});

export const metadata: Metadata = {
    title: 'Hirevia - Enterprise Recruitment System',
    description: 'High-end B2B Recruitment & Applicant Tracking System',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${epilogue.variable} font-sans`}>
            <body className="min-h-screen relative antialiased leading-relaxed bg-[var(--background)] text-[var(--foreground)]">
                {/* Subtle geometric grid texture */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />
                {children}
            </body>
        </html>
    );
}
