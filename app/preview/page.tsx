"use client"
import React, { useEffect, useState } from 'react'
import CardPreview from '../../components/CardPreview'
import { generateCardLink } from '../../lib/generateCardLink'
import { saveCard } from '../../lib/storage'
import { useRouter } from 'next/navigation'

type Draft = { videoDataUrl: string; message: string }

export default function PreviewPage() {
  const [draft, setDraft] = useState<Draft | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cardDraft') || sessionStorage.getItem('cardDraft')
      if (raw) {
        const parsed = JSON.parse(raw) as Draft
        // basic validation
        if (parsed && typeof parsed.videoDataUrl === 'string') setDraft(parsed)
      }
    } catch (e) {
      console.warn('Failed to read draft', e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const onGenerate = async () => {
    if (!draft) return
    const id = generateCardLink()
    await saveCard({ id, videoUrl: draft.videoDataUrl, message: draft.message })
    try {
      localStorage.removeItem('cardDraft')
      sessionStorage.removeItem('cardDraft')
    } catch {}
    // navigate to the single public card page which reads the latest saved card
    router.push('/card')
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><p className="text-white">Loading...</p></div>
  if (!draft) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-slate-300 mb-4">No draft found. Go back to create one.</p>
        <button onClick={() => router.push('/create')} className="px-4 py-2 bg-red-500 text-white rounded">Create a card</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('/images/snow-flakes.png')] bg-cover bg-center">
      <div className="w-full max-w-2xl">
        <CardPreview videoUrl={draft.videoDataUrl} message={draft.message} />

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => router.push('/create')}
            className="px-4 py-2 rounded border border-slate-600"
          >
            Edit
          </button>
          <button
            onClick={onGenerate}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Generate Link
          </button>
        </div>
      </div>
    </div>
  )
}
