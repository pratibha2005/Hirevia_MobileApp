"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "@/lib/apiClient"

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [companyName, setCompanyName] = React.useState('')
    const [companyEmailDomain, setCompanyEmailDomain] = React.useState('')
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register/hr`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, companyName, companyEmailDomain }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.message || 'Registration failed.')
            } else {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                router.push('/dashboard')
            }
        } catch {
            setError('Could not reach the server. Make sure the backend is running.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Register Company</h1>
                <p className="text-[var(--muted-foreground)] text-sm font-medium">
                    Create your HR account to start hiring on Hirevia.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Your Full Name</label>
                    <Input placeholder="Jane Smith" required disabled={loading}
                        value={name} onChange={e => setName(e.target.value)}
                        className="h-12 bg-[var(--surface)] border-[var(--border)] focus:bg-[var(--background)] transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Company Name</label>
                        <Input placeholder="Acme Corp" required disabled={loading}
                            value={companyName} onChange={e => setCompanyName(e.target.value)}
                            className="h-12 bg-[var(--surface)] border-[var(--border)] focus:bg-[var(--background)] transition-colors" />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Email Domain</label>
                        <Input placeholder="acme.com" required disabled={loading}
                            value={companyEmailDomain} onChange={e => setCompanyEmailDomain(e.target.value)}
                            className="h-12 bg-[var(--surface)] border-[var(--border)] focus:bg-[var(--background)] transition-colors" />
                    </div>
                </div>
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Work Email</label>
                    <Input type="email" placeholder="jane@company.com" required disabled={loading}
                        value={email} onChange={e => setEmail(e.target.value)}
                        className="h-12 bg-[var(--surface)] border-[var(--border)] focus:bg-[var(--background)] transition-colors" />
                </div>
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Password</label>
                    <Input type="password" placeholder="••••••••" required disabled={loading}
                        value={password} onChange={e => setPassword(e.target.value)}
                        className="h-12 bg-[var(--surface)] border-[var(--border)] focus:bg-[var(--background)] transition-colors" />
                </div>

                {error && (
                    <div className="p-3 rounded-md bg-red-950/30 border border-red-900/50">
                        <p className="text-sm text-red-400 font-medium">{error}</p>
                    </div>
                )}

                <Button className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all mt-2" type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                </Button>
            </form>

            <div className="pt-6 border-t border-[var(--border)] mt-6">
                <p className="text-sm font-medium text-[var(--muted-foreground)]">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--primary)] font-bold hover:underline transition-colors">Sign In</Link>
                </p>
            </div>
        </div>
    )
}
