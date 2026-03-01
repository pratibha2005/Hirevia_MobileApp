"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '@/lib/apiClient'
import { ChevronLeft, ChevronRight, CalendarDays, Plus, Trash2 } from 'lucide-react'

type TabKey = 'all' | 'availability'

interface Interview {
    _id: string
    title: string
    candidateName: string
    candidateEmail: string
    jobTitle?: string
    interviewDate: string
    startTime: string
    endTime: string
    mode: string
    notes?: string
}

interface Slot {
    startTime: string
    endTime: string
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 11 }, (_, index) => index + 8)

const pad = (value: number) => String(value).padStart(2, '0')
const toIsoDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const fromIsoDate = (value: string) => new Date(`${value}T00:00:00`)

const getWeekStart = (date: Date) => {
    const next = new Date(date)
    next.setHours(0, 0, 0, 0)
    next.setDate(next.getDate() - next.getDay())
    return next
}

const getWeekDays = (start: Date) =>
    Array.from({ length: 7 }, (_, index) => {
        const next = new Date(start)
        next.setDate(start.getDate() + index)
        return next
    })

const initialForm = {
    title: 'Interview Round 1',
    candidateName: '',
    candidateEmail: '',
    jobTitle: '',
    interviewDate: toIsoDate(new Date()),
    startTime: '10:00',
    endTime: '10:30',
    mode: 'Google Meet',
    notes: ''
}

export default function InterviewsPage() {
    const [tab, setTab] = useState<TabKey>('availability')
    const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))
    const [interviews, setInterviews] = useState<Interview[]>([])
    const [availability, setAvailability] = useState<Record<number, Slot[]>>({})
    const [form, setForm] = useState(initialForm)
    const [loadingInterviews, setLoadingInterviews] = useState(true)
    const [loadingAvailability, setLoadingAvailability] = useState(true)
    const [savingInterview, setSavingInterview] = useState(false)
    const [savingAvailability, setSavingAvailability] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])
    const weekStartIso = toIsoDate(weekStart)
    const weekEndIso = toIsoDate(weekDays[6])

    const weekLabel = `${weekStart.toLocaleDateString()} - ${weekDays[6].toLocaleDateString()}`

    const fetchInterviews = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        setLoadingInterviews(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/interviews?weekStart=${weekStartIso}&weekEnd=${weekEndIso}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                setInterviews(data.interviews || [])
            }
        } catch {
            setError('Could not load interviews')
        } finally {
            setLoadingInterviews(false)
        }
    }

    const fetchAvailability = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        setLoadingAvailability(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/interviews/availability`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                const mapped: Record<number, Slot[]> = {}
                for (const day of (data.availability?.days || [])) {
                    mapped[day.dayOfWeek] = day.slots || []
                }
                setAvailability(mapped)
            }
        } catch {
            setError('Could not load availability')
        } finally {
            setLoadingAvailability(false)
        }
    }

    useEffect(() => {
        fetchInterviews()
    }, [weekStartIso, weekEndIso])

    useEffect(() => {
        fetchAvailability()
    }, [])

    const addAvailabilitySlot = (dayOfWeek: number) => {
        setAvailability(prev => ({
            ...prev,
            [dayOfWeek]: [...(prev[dayOfWeek] || []), { startTime: '09:00', endTime: '17:00' }]
        }))
    }

    const removeAvailabilitySlot = (dayOfWeek: number, index: number) => {
        setAvailability(prev => ({
            ...prev,
            [dayOfWeek]: (prev[dayOfWeek] || []).filter((_, slotIndex) => slotIndex !== index)
        }))
    }

    const updateAvailabilitySlot = (dayOfWeek: number, index: number, key: keyof Slot, value: string) => {
        setAvailability(prev => ({
            ...prev,
            [dayOfWeek]: (prev[dayOfWeek] || []).map((slot, slotIndex) =>
                slotIndex === index ? { ...slot, [key]: value } : slot
            )
        }))
    }

    const saveAvailability = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        setSavingAvailability(true)
        setMessage('')
        setError('')

        try {
            const days = Object.keys(availability)
                .map(Number)
                .sort((a, b) => a - b)
                .map(dayOfWeek => ({ dayOfWeek, slots: availability[dayOfWeek] || [] }))

            const res = await fetch(`${API_BASE_URL}/api/interviews/availability`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ days })
            })

            const data = await res.json()
            if (!data.success) {
                setError(data.message || 'Could not save availability')
                return
            }

            setMessage('Availability saved successfully')
        } catch {
            setError('Could not save availability')
        } finally {
            setSavingAvailability(false)
        }
    }

    const createInterview = async (event: React.FormEvent) => {
        event.preventDefault()
        const token = localStorage.getItem('token')
        if (!token) {
            setError('Session expired. Please login again.')
            return
        }

        setSavingInterview(true)
        setMessage('')
        setError('')

        try {
            const res = await fetch(`${API_BASE_URL}/api/interviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            })

            const data = await res.json().catch(() => null)

            if (!res.ok) {
                setError(data?.message || `Failed to schedule interview (${res.status})`)
                return
            }

            if (!data.success) {
                setError(data.message || 'Could not schedule interview')
                return
            }

            setMessage(data.message || 'Interview scheduled and email sent to candidate')
            setForm(prev => ({ ...prev, candidateName: '', candidateEmail: '', notes: '' }))

            if (form.interviewDate < weekStartIso || form.interviewDate > weekEndIso) {
                setWeekStart(getWeekStart(fromIsoDate(form.interviewDate)))
            } else {
                fetchInterviews()
            }
        } catch {
            setError(`Could not schedule interview. Verify backend is running at ${API_BASE_URL}`)
        } finally {
            setSavingInterview(false)
        }
    }

    const interviewsForCell = (dayIso: string, hour: number) =>
        interviews.filter(interview => interview.interviewDate === dayIso && Number(interview.startTime.slice(0, 2)) === hour)

    const useSlotInForm = (dateIso: string, startHour: number) => {
        setForm(prev => ({
            ...prev,
            interviewDate: dateIso,
            startTime: `${pad(startHour)}:00`,
            endTime: `${pad(Math.min(startHour + 1, 23))}:00`
        }))
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Interviews</h1>
                    <p className="text-[var(--muted-foreground)]">Schedule interviews in a calendar style view and manage weekly availability.</p>
                </div>

                <div className="inline-flex bg-[var(--muted)] border border-[var(--border)] rounded-lg p-1">
                    <button
                        onClick={() => setTab('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'all' ? 'bg-[var(--surface)] text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}
                    >
                        All interviews
                    </button>
                    <button
                        onClick={() => setTab('availability')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'availability' ? 'bg-[var(--surface)] text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}
                    >
                        Interview availability
                    </button>
                </div>
            </div>

            {message && <div className="text-sm text-emerald-400 bg-emerald-900/20 border border-emerald-700/40 px-4 py-2 rounded-md">{message}</div>}
            {error && <div className="text-sm text-red-400 bg-red-900/20 border border-red-700/40 px-4 py-2 rounded-md">{error}</div>}

            {tab === 'all' ? (
                <div className="subtle-glass rounded-xl border border-[var(--border)] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] font-semibold text-[var(--foreground)]">Upcoming interviews</div>
                    <div className="divide-y divide-[var(--border)]">
                        {loadingInterviews ? (
                            <div className="px-5 py-10 text-center text-[var(--muted-foreground)]">Loading interviews...</div>
                        ) : interviews.length === 0 ? (
                            <div className="px-5 py-10 text-center text-[var(--muted-foreground)]">No interviews in this week. Open interview availability tab and schedule one.</div>
                        ) : (
                            interviews.map(interview => (
                                <div key={interview._id} className="px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div>
                                        <div className="font-semibold text-[var(--foreground)]">{interview.title}</div>
                                        <div className="text-sm text-[var(--muted-foreground)] mt-1">
                                            {interview.candidateName} ({interview.candidateEmail})
                                        </div>
                                        {interview.jobTitle && <div className="text-xs text-[var(--muted-foreground)] mt-1">Job: {interview.jobTitle}</div>}
                                    </div>
                                    <div className="text-sm text-right">
                                        <div className="font-medium text-[var(--foreground)]">{new Date(`${interview.interviewDate}T00:00:00`).toLocaleDateString()}</div>
                                        <div className="text-[var(--muted-foreground)]">{interview.startTime} - {interview.endTime}</div>
                                        <div className="text-xs text-[var(--muted-foreground)] mt-1">{interview.mode}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-4 space-y-6">
                        <div className="subtle-glass rounded-xl border border-[var(--border)] p-5 space-y-4">
                            <h2 className="text-xl font-semibold text-[var(--foreground)]">Connect your calendar</h2>
                            <p className="text-[var(--muted-foreground)] text-sm">Sync is optional. You can still schedule interviews from this page.</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="bg-blue-700 hover:bg-blue-600 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors">Connect calendar</button>
                                <button className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">Learn more</button>
                            </div>
                        </div>

                        <div className="subtle-glass rounded-xl border border-[var(--border)] p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-[var(--foreground)]">Regular availability</h3>
                                <button
                                    onClick={saveAvailability}
                                    disabled={savingAvailability}
                                    className="text-xs px-3 py-1.5 rounded-md bg-[var(--primary)] text-white disabled:opacity-60"
                                >
                                    {savingAvailability ? 'Saving...' : 'Save'}
                                </button>
                            </div>

                            {loadingAvailability ? (
                                <p className="text-sm text-[var(--muted-foreground)]">Loading availability...</p>
                            ) : (
                                <div className="space-y-4">
                                    {DAY_NAMES.map((dayName, dayIndex) => (
                                        <div key={dayName} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-[var(--foreground)]">{dayName}</span>
                                                <button
                                                    onClick={() => addAvailabilitySlot(dayIndex)}
                                                    className="text-xs inline-flex items-center gap-1 text-[var(--primary)]"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add slot
                                                </button>
                                            </div>
                                            {(availability[dayIndex] || []).length === 0 ? (
                                                <p className="text-sm text-[var(--muted-foreground)]">Unavailable</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {(availability[dayIndex] || []).map((slot, slotIndex) => (
                                                        <div key={`${dayIndex}-${slotIndex}`} className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                                                            <input
                                                                type="time"
                                                                value={slot.startTime}
                                                                onChange={event => updateAvailabilitySlot(dayIndex, slotIndex, 'startTime', event.target.value)}
                                                                className="border border-[var(--border)] bg-[var(--surface)] px-2 py-1 rounded-md text-sm"
                                                            />
                                                            <span className="text-xs text-[var(--muted-foreground)]">to</span>
                                                            <input
                                                                type="time"
                                                                value={slot.endTime}
                                                                onChange={event => updateAvailabilitySlot(dayIndex, slotIndex, 'endTime', event.target.value)}
                                                                className="border border-[var(--border)] bg-[var(--surface)] px-2 py-1 rounded-md text-sm"
                                                            />
                                                            <button onClick={() => removeAvailabilitySlot(dayIndex, slotIndex)} className="text-red-400">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form onSubmit={createInterview} className="subtle-glass rounded-xl border border-[var(--border)] p-5 space-y-3">
                            <h3 className="text-lg font-semibold text-[var(--foreground)]">Schedule interview</h3>
                            <input className="w-full border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm" placeholder="Interview title" value={form.title} onChange={event => setForm(prev => ({ ...prev, title: event.target.value }))} required />
                            <input className="w-full border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm" placeholder="Candidate name" value={form.candidateName} onChange={event => setForm(prev => ({ ...prev, candidateName: event.target.value }))} required />
                            <input className="w-full border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm" type="email" placeholder="Candidate email" value={form.candidateEmail} onChange={event => setForm(prev => ({ ...prev, candidateEmail: event.target.value }))} required />
                            <input className="w-full border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm" placeholder="Job title (optional)" value={form.jobTitle} onChange={event => setForm(prev => ({ ...prev, jobTitle: event.target.value }))} />
                            <div className="grid grid-cols-3 gap-2">
                                <input className="border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm" type="date" value={form.interviewDate} onChange={event => setForm(prev => ({ ...prev, interviewDate: event.target.value }))} required />
                                <input className="border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm" type="time" value={form.startTime} onChange={event => setForm(prev => ({ ...prev, startTime: event.target.value }))} required />
                                <input className="border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm" type="time" value={form.endTime} onChange={event => setForm(prev => ({ ...prev, endTime: event.target.value }))} required />
                            </div>
                            <select className="w-full border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm" value={form.mode} onChange={event => setForm(prev => ({ ...prev, mode: event.target.value }))}>
                                <option>Google Meet</option>
                                <option>Zoom</option>
                                <option>Phone</option>
                                <option>In-person</option>
                            </select>
                            <textarea className="w-full border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm min-h-20" placeholder="Notes (optional)" value={form.notes} onChange={event => setForm(prev => ({ ...prev, notes: event.target.value }))} />
                            <button type="submit" disabled={savingInterview} className="w-full bg-[var(--primary)] text-white rounded-lg py-2 text-sm font-medium disabled:opacity-60">
                                {savingInterview ? 'Scheduling...' : 'Schedule interview'}
                            </button>
                        </form>
                    </div>

                    <div className="xl:col-span-8 subtle-glass rounded-xl border border-[var(--border)] overflow-hidden">
                        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                            <div className="inline-flex items-center rounded-lg overflow-hidden border border-[var(--border)]">
                                <button onClick={() => setWeekStart(prev => { const next = new Date(prev); next.setDate(prev.getDate() - 7); return next })} className="px-3 py-2 hover:bg-[var(--muted)]">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => setWeekStart(prev => { const next = new Date(prev); next.setDate(prev.getDate() + 7); return next })} className="px-3 py-2 border-l border-[var(--border)] hover:bg-[var(--muted)]">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-lg font-semibold text-[var(--foreground)]">{weekLabel}</div>
                        </div>

                        <div className="overflow-auto">
                            <div className="grid" style={{ gridTemplateColumns: '72px repeat(7, minmax(120px, 1fr))' }}>
                                <div className="border-b border-r border-[var(--border)] p-2" />
                                {weekDays.map(day => (
                                    <div key={toIsoDate(day)} className="border-b border-r border-[var(--border)] p-2 text-center">
                                        <div className="text-xs text-[var(--muted-foreground)] uppercase">{DAY_NAMES[day.getDay()]}</div>
                                        <div className="text-2xl font-bold text-[var(--foreground)] mt-1">{day.getDate()}</div>
                                    </div>
                                ))}

                                {HOURS.map(hour => (
                                    <React.Fragment key={hour}>
                                        <div className="border-b border-r border-[var(--border)] p-2 text-sm text-[var(--muted-foreground)]">{hour}:00</div>
                                        {weekDays.map(day => {
                                            const dayIso = toIsoDate(day)
                                            const cellInterviews = interviewsForCell(dayIso, hour)

                                            return (
                                                <button
                                                    key={`${dayIso}-${hour}`}
                                                    onClick={() => useSlotInForm(dayIso, hour)}
                                                    className="border-b border-r border-[var(--border)] p-1.5 min-h-[56px] text-left hover:bg-[var(--muted)]/60 transition-colors"
                                                >
                                                    <div className="space-y-1">
                                                        {cellInterviews.slice(0, 2).map(interview => (
                                                            <div key={interview._id} className="text-[11px] px-1.5 py-1 rounded bg-primary-ch/15 border border-primary-ch/30 text-[var(--foreground)] flex items-start gap-1">
                                                                <CalendarDays className="w-3 h-3 mt-0.5 shrink-0" />
                                                                <span className="truncate">{interview.startTime} {interview.candidateName}</span>
                                                            </div>
                                                        ))}
                                                        {cellInterviews.length > 2 && (
                                                            <div className="text-[10px] text-[var(--muted-foreground)]">+{cellInterviews.length - 2} more</div>
                                                        )}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
