"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CardPreview from '../../../../components/CardPreview'
import ShareActions from '../../../../components/ShareActions'

export default function PublicCardPage() {
  const params = useParams() as { id?: string }
  const id = params?.id
  const [card, setCard] = useState<{ id: string; videoUrl: string; message: string } | null>(null)

  useEffect(() => {
    if (!id) return
    const raw = localStorage.getItem(`card:${id}`)
    if (raw) setCard(JSON.parse(raw))
  }, [id])

  if (!card) return <p className="text-slate-300">Card not found.</p>

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `/card/${id}`

  return (
    <div className="space-y-6">
      <CardPreview videoUrl={card.videoUrl} message={card.message} />
      <ShareActions url={shareUrl} />
    </div>
  )
}
