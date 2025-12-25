"use client"
import React, { useState } from 'react'
import { sendMagicLink } from '../lib/api'
import Toast from './Toast'

export default function MagicLinkModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type?: any } | null>(null)

    if (!open) return null

    const handleSend = async () => {
        if (!email) return setToast({ msg: 'Please enter your email', type: 'error' })
        setLoading(true)
        try {
            await sendMagicLink(email, name || '');
            setToast({ msg: 'Magic link sent. Check your email.', type: 'success' })
            setTimeout(() => {
                setLoading(false)
                onClose()
            }, 1200)
        } catch (e) {
            console.error(e)
            setToast({ msg: 'Failed to send magic link', type: 'error' })
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Sign in to continue</h3>
                <p className="text-sm text-slate-600 mb-4">We need to send a magic link to your email to create the message.</p>
                <input className="w-full mb-2 p-2 border rounded" placeholder="Full name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="w-full mb-4 p-2 border rounded" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="flex gap-2 justify-end">
                    <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
                    <button onClick={handleSend} disabled={loading} className="px-3 py-2 rounded bg-red-600 text-white">{loading ? 'Sending…' : 'Send Magic Link'}</button>
                </div>
            </div>
            {toast && <Toast message={toast.msg} type={toast.type} />}
        </div>
    )
}
