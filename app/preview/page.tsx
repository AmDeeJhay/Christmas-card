"use client"
import React, { useEffect, useState } from 'react'
import CardPreview from '../../components/CardPreview'
import { generateCardLink } from '../../lib/generateCardLink'
import { saveCard } from '../../lib/storage'
import { useRouter } from 'next/navigation'

export default function PreviewPage() {
  const [draft, setDraft] = useState<{ videoDataUrl: string; message: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem('cardDraft')
    if (raw) setDraft(JSON.parse(raw))
  }, [])

  const onGenerate = async () => {
    if (!draft) return
    const id = generateCardLink()
    await saveCard({ id, videoUrl: draft.videoDataUrl, message: draft.message })
    localStorage.removeItem('cardDraft')
    router.push(`/card/${id}`)
  }

  if (!draft) return <p className="text-slate-300">No draft found. Go back to create one.</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Preview</h2>
      <CardPreview videoUrl={draft.videoDataUrl} message={draft.message} />
      <div className="flex gap-2 justify-end">
        <button onClick={() => router.push('/create')} className="px-4 py-2 rounded border border-slate-600">Edit</button>
        <button onClick={onGenerate} className="bg-red-500 px-4 py-2 rounded">Generate Link</button>
      </div>
    </div>
  )
}
