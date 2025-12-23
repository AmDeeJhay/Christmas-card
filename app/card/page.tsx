"use client"
import React, { useEffect, useState } from 'react'
import Envelope from '../../components/Envelope'
import CardPreview from '../../components/CardPreview'
import ShareActions from '../../components/ShareActions'
import { useRouter } from 'next/navigation'

type Card = { id: string; videoUrl: string; message: string }

export default function CardsIndexPage() {
  const [card, setCard] = useState<Card | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [opened, setOpened] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const idx = localStorage.getItem('cardsIndex')
      const index = idx ? JSON.parse(idx) as string[] : []
      const lastId = index.length ? index[index.length - 1] : null
      if (lastId) {
        const raw = localStorage.getItem(`card:${lastId}`)
        if (raw) setCard(JSON.parse(raw) as Card)
      }
    } catch (e) {
      console.warn('Failed to load card index', e)
    }
    setIsLoading(false)
  }, [])

  // Compute shareUrl for ShareActions
  const shareUrl = typeof window !== "undefined"
    ? window.location.href
    : ""

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-[#220000]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative bg-[#220000]"
    >
      {/* Snowflakes as an SVG background component. It's positioned absolutely so it
          fills the area; color/opacity can be changed via props. */}
      {/* Background layers: use the original SVG directly and apply a red tint overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/snow-flakes.svg"
          alt="snow background"
          className="w-full h-full object-cover"
          style={{ display: 'block' }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: '#220000', mixBlendMode: 'multiply', pointerEvents: 'none' }}
        />
      </div>

      <div className="w-full max-w-2xl relative z-20">
        {!opened ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-[#d4af37]">You've Got a Message</h2>
            <Envelope />
            <div className="flex justify-center">
              <button onClick={() => setOpened(true)} className="px-6 py-3 bg-red-500 text-white rounded-full">Open Message</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {card && <CardPreview videoUrl={card.videoUrl} message={card.message} />}
            <div className="flex justify-between items-center">
              <ShareActions url={shareUrl} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
