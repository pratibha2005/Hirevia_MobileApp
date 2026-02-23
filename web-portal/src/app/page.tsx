import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-8">
            <main className="max-w-3xl text-center space-y-8">
                <h1 className="text-5xl font-extrabold tracking-tight">Welcome to <span className="text-blue-600">Hirevia</span></h1>
                <div className="flex gap-4 justify-center mt-10">
                    <Link href="/login"><Button size="lg" className="w-full font-semibold px-8">Login</Button></Link>
                    <Link href="/register"><Button size="lg" variant="outline" className="w-full font-semibold px-8">Register</Button></Link>
                </div>
            </main>
        </div>
    );
}
