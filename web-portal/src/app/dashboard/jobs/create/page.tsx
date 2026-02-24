"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { API_BASE_URL } from '@/lib/apiClient'

export default function CreateJobPage() {
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [workModel, setWorkModel] = useState('Remote')
    const [salary, setSalary] = useState('')
    const [noticePeriod, setNoticePeriod] = useState('Immediate')
    const [currentCTCRequired, setCurrentCTCRequired] = useState(false)
    const [relocationRequired, setRelocationRequired] = useState(false)
    const [skillsInput, setSkillsInput] = useState('')
    const [questions, setQuestions] = useState([{ id: 1, text: '', type: 'Text' }])
    const [maxApplications, setMaxApplications] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const addQuestion = () => {
        setQuestions([...questions, { id: Date.now(), text: '', type: 'Text' }])
    }

    const removeQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.id !== id))
    }

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const token = localStorage.getItem('token')
        if (!token) { router.push('/login'); return }

        const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean)
        const screeningQuestions = questions.map(q => q.text).filter(Boolean)
        const fullLocation = workModel === 'Remote' ? 'Remote' : location ? `${location} (${workModel})` : workModel

        try {
            const res = await fetch(`${API_BASE_URL}/api/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title, description, location: fullLocation, salary,
                    type: 'Full-time', skills, screeningQuestions,
                    maxApplications: maxApplications ? Number(maxApplications) : undefined,
                    currentCTCRequired, relocationRequired,
                    noticePeriodRequired: noticePeriod !== 'Immediate',
                }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.message || 'Failed to create job.') }
            else { router.push('/dashboard/jobs') }
        } catch { setError('Could not reach the server.') }
        finally { setLoading(false) }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-lg border border-[var(--border)] bg-[var(--muted)]" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Post a New Job</h1>
                    <p className="text-[var(--muted-foreground)]">Create a professional listing to attract top talent.</p>
                </div>
            </div>

            <form onSubmit={handlePublish} className="space-y-8">
                {/* Section 1: Job Details */}
                <div className="subtle-glass p-8 rounded-xl space-y-6">
                    <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">1</div>
                        <h2 className="text-lg font-semibold text-[var(--foreground)]">Job Details</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Job Title</label>
                            <Input placeholder="e.g. Senior Frontend Engineer" required value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Description</label>
                            <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                                placeholder="Describe the role, responsibilities, and what you're looking for..."
                                required
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 flex flex-col">
                                <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Location</label>
                                <Input placeholder="e.g. San Francisco, CA" value={location} onChange={e => setLocation(e.target.value)} />
                            </div>
                            <div className="space-y-1.5 flex flex-col">
                                <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Work Model</label>
                                <select className="flex h-11 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" value={workModel} onChange={e => setWorkModel(e.target.value)}>
                                    <option>Remote</option>
                                    <option>Hybrid</option>
                                    <option>On-site</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Skills / Tags (comma-separated)</label>
                            <Input placeholder="e.g. React, TypeScript, Node.js" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Section 2: Compensation & Requirements */}
                <div className="subtle-glass p-8 rounded-xl space-y-6">
                    <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">2</div>
                        <h2 className="text-lg font-semibold text-[var(--foreground)]">Compensation & Requirements</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Salary / CTC Range</label>
                            <Input placeholder="e.g. ₹15-25 LPA or $120k-$160k" value={salary} onChange={e => setSalary(e.target.value)} />
                        </div>
                        <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Notice Period</label>
                            <select className="flex h-11 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" value={noticePeriod} onChange={e => setNoticePeriod(e.target.value)}>
                                <option>Immediate</option>
                                <option>15 Days</option>
                                <option>30 Days</option>
                                <option>60+ Days</option>
                            </select>
                        </div>

                        <div className="col-span-2 flex items-center gap-8 pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded accent-[var(--primary)]" checked={currentCTCRequired} onChange={e => setCurrentCTCRequired(e.target.checked)} />
                                <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">Current CTC Required</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded accent-[var(--primary)]" checked={relocationRequired} onChange={e => setRelocationRequired(e.target.checked)} />
                                <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">Relocation Required</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Section 3: Screening Questions Builder */}
                <div className="subtle-glass p-8 rounded-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">3</div>
                            <h2 className="text-lg font-semibold text-[var(--foreground)]">Screening Questions</h2>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addQuestion} className="gap-2 text-[var(--primary)] border-[var(--primary)]/20 hover:bg-[var(--primary)] hover:text-white">
                            <Plus className="w-4 h-4" /> Add Question
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {questions.length === 0 ? (
                            <div className="text-center py-8 text-[var(--muted-foreground)] border-2 border-dashed border-[var(--border)] rounded-lg">
                                No screening questions added. Click the button above to add one.
                            </div>
                        ) : (
                            questions.map((q, index) => (
                                <div key={q.id} className="flex gap-4 items-start p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)] relative group transition-all hover:border-[var(--primary)]/30">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Question {index + 1}</span>
                                            <select
                                                className="text-sm bg-transparent border-none text-[var(--primary)] font-semibold cursor-pointer outline-none focus:ring-0"
                                                value={q.type}
                                                onChange={(e) => {
                                                    const newQs = [...questions]
                                                    newQs[index].type = e.target.value
                                                    setQuestions(newQs)
                                                }}
                                            >
                                                <option>Text (Short Answer)</option>
                                                <option>Paragraph (Long Answer)</option>
                                                <option>Yes/No</option>
                                            </select>
                                        </div>
                                        <Input
                                            placeholder="Type your question here..."
                                            value={q.text}
                                            onChange={(e) => {
                                                const newQs = [...questions]
                                                newQs[index].text = e.target.value
                                                setQuestions(newQs)
                                            }}
                                            className=""
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(q.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors pt-8 px-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Section 4: Settings & Publish */}
                <div className="subtle-glass p-8 rounded-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">4</div>
                            <h2 className="text-lg font-semibold text-[var(--foreground)]">Application Settings</h2>
                        </div>
                    </div>

                    <div className="space-y-1.5 flex flex-col max-w-xs">
                        <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Max Applications Allowed</label>
                        <Input type="number" placeholder="Leave empty for no limit" min="1"
                            value={maxApplications} onChange={e => setMaxApplications(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-end pt-4 pb-20">
                    <div className="flex items-center gap-4">
                        {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
                        <Button type="submit" size="lg" disabled={loading} className="gap-2 px-8 shadow-md hover:shadow-lg">
                            {loading ? "Publishing..." : <><CheckCircle2 className="w-5 h-5" /> Publish Job</>}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
