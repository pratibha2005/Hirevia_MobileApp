"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "@/lib/apiClient"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.message || 'Login failed.')
            } else if (data.user.role !== 'HR') {
                setError('This portal is for HR users only. Applicants should use the mobile app.')
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
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Sign In</h1>
                <p className="text-[var(--muted-foreground)] text-sm tracking-wide">
                    Access the HR Web Portal to manage recruitment.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                    <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Email</label>
                        <Input type="email" placeholder="you@company.com" required disabled={loading}
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">Password</label>
                            <Link href="#" className="text-xs font-semibold text-[var(--primary)] hover:underline">Forgot password?</Link>
                        </div>
                        <Input type="password" placeholder="••••••••" required disabled={loading}
                            value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <Button className="w-full mt-2" size="lg" type="submit" disabled={loading}>
                    {loading ? "Authenticating..." : "Sign In"}
                </Button>
            </form>

            <div className="pt-6 border-t border-[var(--border)] text-center">
                <p className="text-sm font-medium text-[var(--muted-foreground)]">
                    New to Hirevia?{' '}
                    <Link href="/register" className="text-[var(--primary)] font-semibold hover:underline transition-colors">
                        Register your Company
                    </Link>
                </p>
            </div>
        </div>
    )
}
