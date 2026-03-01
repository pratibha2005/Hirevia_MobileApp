// "use client"

// import * as React from "react"
// import { useRouter } from "next/navigation"
// import { API_BASE_URL } from "@/lib/apiClient"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

// type StoredUser = {
//     id: string
//     name: string
//     email: string
//     role: "HR" | "APPLICANT"
//     companyId?: string
//     companyName?: string
//     profileImage?: string
// }

// export default function EditProfilePage() {
//     const router = useRouter()
//     const [name, setName] = React.useState("")
//     const [profileImage, setProfileImage] = React.useState<string>("")
//     const [saving, setSaving] = React.useState(false)
//     const [loading, setLoading] = React.useState(true)
//     const [error, setError] = React.useState("")
//     const [success, setSuccess] = React.useState("")

//     React.useEffect(() => {
//         const token = localStorage.getItem("token")
//         const userStr = localStorage.getItem("user")

//         if (!token || !userStr) {
//             router.push("/login")
//             return
//         }

//         try {
//             const user: StoredUser = JSON.parse(userStr)
//             setName(user.name || "")
//             setProfileImage(user.profileImage || "")
//         } catch {
//             router.push("/login")
//             return
//         }

//         const loadProfile = async () => {
//             try {
//                 const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 })
//                 const data = await res.json()

//                 if (!res.ok) {
//                     setLoading(false)
//                     return
//                 }

//                 const updatedUser: StoredUser = data.user
//                 setName(updatedUser.name || "")
//                 setProfileImage(updatedUser.profileImage || "")
//                 localStorage.setItem("user", JSON.stringify(updatedUser))
//                 window.dispatchEvent(new Event("user-updated"))
//             } catch {
//                 // Keep local cache if profile fetch fails
//             } finally {
//                 setLoading(false)
//             }
//         }

//         loadProfile()
//     }, [router])

//     const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0]
//         if (!file) return

//         if (!file.type.startsWith("image/")) {
//             setError("Please select a valid image file.")
//             return
//         }

//         const reader = new FileReader()
//         reader.onloadend = () => {
//             const result = reader.result
//             if (typeof result === "string") {
//                 setProfileImage(result)
//                 setError("")
//             }
//         }
//         reader.readAsDataURL(file)
//     }

//     const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault()
//         setError("")
//         setSuccess("")

//         const token = localStorage.getItem("token")
//         if (!token) {
//             router.push("/login")
//             return
//         }

//         setSaving(true)
//         try {
//             const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                     name,
//                     profileImage,
//                 }),
//             })

//             const data = await res.json()
//             if (!res.ok) {
//                 setError(data.message || "Failed to save profile.")
//                 return
//             }

//             localStorage.setItem("user", JSON.stringify(data.user))
//             window.dispatchEvent(new Event("user-updated"))
//             setSuccess("Profile updated successfully.")
//         } catch {
//             setError("Could not reach the server. Make sure backend is running.")
//         } finally {
//             setSaving(false)
//         }
//     }

//     if (loading) {
//         return (
//             <div className="subtle-glass rounded-xl p-6">
//                 <p className="text-sm text-[var(--muted-foreground)]">Loading profile...</p>
//             </div>
//         )
//     }

//     return (
//         <div className="max-w-2xl">
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Profile</h1>
//                 <p className="text-sm text-[var(--muted-foreground)] mt-1">Update your name and profile image.</p>
//             </div>

//             <form onSubmit={handleSave} className="subtle-glass rounded-xl p-6 space-y-5">
//                 <div className="space-y-1.5">
//                     <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Name</label>
//                     <Input
//                         value={name}
//                         onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
//                         placeholder="Enter your name"
//                         required
//                         maxLength={80}
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <label className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase">Profile Image</label>
//                     <Input type="file" accept="image/*" onChange={handleImageSelect} />
//                     {profileImage && (
//                         <img
//                             src={profileImage}
//                             alt="Profile preview"
//                             className="w-20 h-20 rounded-lg object-cover border border-[var(--border)]"
//                         />
//                     )}
//                 </div>

//                 {error && (
//                     <div className="p-3 rounded-md bg-red-950/30 border border-red-900/50">
//                         <p className="text-sm text-red-400 font-medium">{error}</p>
//                     </div>
//                 )}

//                 {success && (
//                     <div className="p-3 rounded-md bg-emerald-950/30 border border-emerald-900/50">
//                         <p className="text-sm text-emerald-400 font-medium">{success}</p>
//                     </div>
//                 )}

//                 <Button type="submit" disabled={saving} className="h-11 px-6">
//                     {saving ? "Saving..." : "Save"}
//                 </Button>
//             </form>
//         </div>
//     )
// }





"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/apiClient"

type StoredUser = {
    id: string
    name: string
    email: string
    role: "HR" | "APPLICANT"
    companyId?: string
    companyName?: string
    profileImage?: string
}

export default function EditProfilePage() {
    const router = useRouter()
    const [name, setName] = React.useState("")
    const [profileImage, setProfileImage] = React.useState<string>("")
    const [saving, setSaving] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState("")
    const [isDragging, setIsDragging] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        setMounted(true)
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")

        if (!token || !userStr) {
            router.push("/login")
            return
        }

        try {
            const user: StoredUser = JSON.parse(userStr)
            setName(user.name || "")
            setProfileImage(user.profileImage || "")
        } catch {
            router.push("/login")
            return
        }

        const loadProfile = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                if (!res.ok) { setLoading(false); return }
                const updatedUser: StoredUser = data.user
                setName(updatedUser.name || "")
                setProfileImage(updatedUser.profileImage || "")
                localStorage.setItem("user", JSON.stringify(updatedUser))
                window.dispatchEvent(new Event("user-updated"))
            } catch { } finally { setLoading(false) }
        }

        loadProfile()
    }, [router])

    const handleImageSelect = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.")
            return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                setProfileImage(reader.result)
                setError("")
            }
        }
        reader.readAsDataURL(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleImageSelect(file)
    }

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")
        setSuccess("")
        const token = localStorage.getItem("token")
        if (!token) { router.push("/login"); return }
        setSaving(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name, profileImage }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.message || "Failed to save profile."); return }
            localStorage.setItem("user", JSON.stringify(data.user))
            window.dispatchEvent(new Event("user-updated"))
            setSuccess("Profile updated successfully.")
        } catch {
            setError("Could not reach the server. Make sure backend is running.")
        } finally {
            setSaving(false)
        }
    }

    const getInitials = (n: string) => n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?"

    if (loading) {
        return (
            <>
                <style>{styles}</style>
                <div className="ep-root">
                    <div className="ep-loader">
                        <div className="ep-spinner" />
                        <span>Loading profile…</span>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <style>{styles}</style>
            <div className={`ep-root${mounted ? " ep-mounted" : ""}`}>

                {/* Ambient background orbs */}
                <div className="ep-orb ep-orb-1" />
                <div className="ep-orb ep-orb-2" />
                <div className="ep-orb ep-orb-3" />

                <div className="ep-container">

                    {/* Header */}
                    <div className="ep-header ">
                        <div className="ep-header-pill">PROFILE SETTINGS</div>
                        <h1 className="ep-title text-gray-900">Edit your profile</h1>
                        <p className="ep-subtitle">Update your personal information and avatar</p>
                    </div>

                    <form onSubmit={handleSave} className="ep-card">

                        {/* Avatar Section */}
                        <div className="ep-avatar-section">
                            <div className="ep-avatar-wrapper">
                                <div
                                    className={`ep-avatar-drop${isDragging ? " ep-drop-active" : ""}`}
                                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="ep-avatar-img" />
                                    ) : (
                                        <div className="ep-avatar-placeholder">
                                            <span className="ep-initials">{getInitials(name)}</span>
                                        </div>
                                    )}
                                    <div className="ep-avatar-overlay">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span>Upload photo</span>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f) }}
                                    className="ep-hidden-input"
                                />
                            </div>
                            <div className="ep-avatar-hints">
                                <p className="ep-hint-main">Click or drag & drop to upload</p>
                                <p className="ep-hint-sub">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        </div>

                        <div className="ep-divider" />

                        {/* Name Field */}
                        <div className="ep-field">
                            <label className="ep-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Full Name
                            </label>
                            <div className="ep-input-wrapper">
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    maxLength={80}
                                    className="ep-input"
                                />
                                <div className="ep-input-focus-bar" />
                            </div>
                            <span className="ep-char-count">{name.length}/80</span>
                        </div>

                        {/* Alerts */}
                        {error && (
                            <div className="ep-alert ep-alert-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="ep-alert ep-alert-success">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {success}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="ep-actions">
                            <button type="button" className="ep-btn-secondary" onClick={() => router.back()}>
                                Cancel
                            </button>
                            <button type="submit" disabled={saving} className="ep-btn-primary">
                                {saving ? (
                                    <>
                                        <div className="ep-btn-spinner" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                            <polyline points="17 21 17 13 7 13 7 21" />
                                            <polyline points="7 3 7 8 15 8" />
                                        </svg>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');

.ep-root {
    min-height: 100vh;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 40px 20px;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.6s ease;
}
.ep-root.ep-mounted { opacity: 1; }

/* Ambient orbs */
.ep-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
}
.ep-orb-1 {
    width: 500px; height: 500px;
    top: -150px; right: -100px;
    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
    animation: orbFloat1 12s ease-in-out infinite;
}
.ep-orb-2 {
    width: 400px; height: 400px;
    bottom: -100px; left: -80px;
    background: radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%);
    animation: orbFloat2 15s ease-in-out infinite;
}
.ep-orb-3 {
    width: 300px; height: 300px;
    top: 40%; left: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
    animation: orbFloat3 10s ease-in-out infinite;
}

@keyframes orbFloat1 {
    0%, 100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-30px, 30px) scale(1.1); }
}
@keyframes orbFloat2 {
    0%, 100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(40px, -20px) scale(0.9); }
}
@keyframes orbFloat3 {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.2); }
}

.ep-container {
    width: 100%;
    max-width: 560px;
    position: relative;
    z-index: 1;
    animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Header */
.ep-header {
    text-align: center;
    margin-bottom: 32px;
}

.ep-header-pill {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #4338ca;
    background: #eef2ff;
    border: 1px solid #c7d2fe;
    border-radius: 100px;
    padding: 6px 14px;
    margin-bottom: 16px;
}

.ep-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 600;
    color: #111827;
    line-height: 1.15;
    letter-spacing: -0.5px;
    margin: 0 0 10px;
}

.ep-subtitle {
    font-size: 14px;
    color: #4b5563;
    font-weight: 400;
    margin: 0;
    letter-spacing: 0.01em;
}

/* Card */
.ep-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 40px;
    box-shadow:
        0 1px 2px rgba(15,23,42,0.06),
        0 10px 28px rgba(15,23,42,0.08);
}

/* Avatar Section */
.ep-avatar-section {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 4px;
}

.ep-avatar-wrapper { position: relative; flex-shrink: 0; }

.ep-avatar-drop {
    width: 96px;
    height: 96px;
    border-radius: 22px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 2px dashed #cbd5e1;
    transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
    background: #f9fafb;
}

.ep-avatar-drop:hover,
.ep-drop-active {
    border-color: #6366f1;
    transform: scale(1.03);
    box-shadow: 0 0 0 4px rgba(99,102,241,0.14), 0 8px 20px rgba(15,23,42,0.12);
}

.ep-avatar-img {
    width: 100%; height: 100%;
    object-fit: cover;
}

.ep-avatar-placeholder {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #eef2ff, #dbeafe);
}

.ep-initials {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 600;
    color: #1f2937;
    letter-spacing: 1px;
}

.ep-avatar-overlay {
    position: absolute;
    inset: 0;
    background: rgba(17,24,39,0.68);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: white;
    opacity: 0;
    transition: opacity 0.2s;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.05em;
}

.ep-avatar-drop:hover .ep-avatar-overlay { opacity: 1; }

.ep-hidden-input { display: none; }

.ep-avatar-hints {}
.ep-hint-main {
    font-size: 13px;
    font-weight: 700;
    color: #374151;
    margin: 0 0 4px;
}
.ep-hint-sub {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
}

/* Divider */
.ep-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 28px 0;
}

/* Field */
.ep-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
}

.ep-label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #4b5563;
}

.ep-input-wrapper { position: relative; }

.ep-input {
    width: 100%;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    padding: 14px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: #111827;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    box-sizing: border-box;
    caret-color: #4f46e5;
}

.ep-input::placeholder { color: #9ca3af; }

.ep-input:focus {
    border-color: #6366f1;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.14);
}

.ep-char-count {
    font-size: 11px;
    color: #6b7280;
    text-align: right;
    font-weight: 400;
}

.ep-input-focus-bar {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 0;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, #6366f1, #3b82f6);
    opacity: 0;
    transform: scaleX(0.6);
    transition: opacity 0.2s, transform 0.2s;
    transform-origin: center;
}

.ep-input:focus + .ep-input-focus-bar {
    opacity: 1;
    transform: scaleX(1);
}

/* Alerts */
.ep-alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 20px;
    animation: alertIn 0.3s cubic-bezier(0.16,1,0.3,1);
}

@keyframes alertIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
}

.ep-alert-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
}

.ep-alert-success {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #047857;
}

/* Actions */
.ep-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 8px;
}

.ep-btn-secondary {
    background: #ffffff;
    border: 1px solid #d1d5db;
    color: #374151;
    border-radius: 12px;
    padding: 12px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
}
.ep-btn-secondary:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    color: #111827;
}

.ep-btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    border: none;
    border-radius: 12px;
    padding: 12px 26px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.25s;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 16px rgba(139,92,246,0.35);
    position: relative;
    overflow: hidden;
}

.ep-btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
    opacity: 0;
    transition: opacity 0.2s;
}

.ep-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(99,102,241,0.35);
}
.ep-btn-primary:hover::before { opacity: 1; }

.ep-btn-primary:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}

.ep-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 16px rgba(139,92,246,0.2);
}

.ep-btn-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.45);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Loader */
.ep-loader {
    display: flex;
    align-items: center;
    gap: 14px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
}

.ep-spinner {
    width: 20px; height: 20px;
    border: 2px solid rgba(139,92,246,0.2);
    border-top-color: rgba(139,92,246,0.8);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* Responsive */
@media (max-width: 520px) {
    .ep-card { padding: 28px 24px; }
    .ep-title { font-size: 28px; }
    .ep-avatar-section { flex-direction: column; text-align: center; gap: 16px; }
    .ep-actions { flex-direction: column-reverse; }
    .ep-btn-secondary, .ep-btn-primary { width: 100%; justify-content: center; }
}
`