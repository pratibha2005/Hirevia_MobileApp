"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => { setLoading(false); router.push("/dashboard") }, 1000)
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Create Company</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Company Name" required disabled={loading} />
                <Input type="email" placeholder="Email" required disabled={loading} />
                <Input type="password" placeholder="Password" required disabled={loading} />
                <Button className="w-full" type="submit" disabled={loading}>Register</Button>
            </form>
            <div className="text-center text-sm">
                <Link href="/login" className="font-medium text-blue-600">Sign In</Link>
            </div>
        </div>
    )
}
