"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, CalendarDays } from "lucide-react"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Applications", href: "/dashboard/applications", icon: Users },
    { name: "Interviews", href: "/dashboard/interviews", icon: CalendarDays },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col w-64 min-h-screen border-r border-[var(--border)] relative"
            style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)' }}>

            {/* Logo */}
            <div className="flex items-center gap-3 px-5 h-16 border-b border-[var(--border)]">
                <Image src="/assets/Logo.jpg" alt="Hirevia" width={28} height={28} className="rounded-md border border-[var(--border)]" />
                <div>
                    <span className="text-base font-bold tracking-[0.1em] uppercase text-[var(--foreground)]">Hirevia</span>
                </div>
            </div>

            {/* Teal accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary-ch/40 to-transparent" />

            <nav className="flex-1 px-3 py-5 space-y-0.5">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? "bg-primary-ch/10 text-[var(--primary)] border border-primary-ch/20"
                                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] border border-transparent"
                            }`}
                        >
                            {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--primary)] rounded-r-full" />}
                            <item.icon className="w-4 h-4 shrink-0" />
                            {item.name}
                            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                        </Link>
                    )
                })}

                <div className="relative group">
                    <div
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border ${
                            pathname.startsWith('/dashboard/settings')
                                ? "bg-primary-ch/10 text-[var(--primary)] border-primary-ch/20"
                                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] border-transparent"
                        }`}
                    >
                        {pathname.startsWith('/dashboard/settings') && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--primary)] rounded-r-full" />
                        )}
                        <Settings className="w-4 h-4 shrink-0" />
                        Settings
                    </div>

                    {/* <div className="hidden group-hover:block pl-6 pr-2 pt-1.5 pb-1">
                        <Link
                            href="/dashboard/settings/edit-profile"
                            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                pathname === '/dashboard/settings/edit-profile'
                                    ? 'text-[var(--primary)] bg-primary-ch/10 border border-primary-ch/20'
                                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] border border-transparent'
                            }`}
                        >
                            Edit Profile
                        </Link>
                    </div> */}
                    <div className="absolute left-full top-0 ml-2 hidden group-hover:block w-40 bg-white shadow-lg rounded-md border border-[var(--border)] z-50">
    <Link
        href="/dashboard/settings/edit-profile"
        className={`block px-4 py-2 rounded-md text-sm transition-colors ${
            pathname === '/dashboard/settings/edit-profile'
                ? 'text-black bg-primary-ch/10'
                : 'text-black hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
        }`}
    >
        Edit Profile
    </Link>
</div>
                </div>
            </nav>

            <div className="p-3 border-t border-[var(--border)]">
                <button
                    onClick={() => {
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        window.location.href = '/login'
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:bg-red-950/30 hover:text-red-400 transition-all border border-transparent hover:border-red-900/30"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Log out
                </button>
            </div>
        </div>
    )
}
