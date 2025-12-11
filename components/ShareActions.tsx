"use client"
import React from 'react'

type Props = { url: string }

export default function ShareActions({ url }: Props) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied')
    } catch (e) {
      alert('Copy failed')
    }
  }

  const onWhatsApp = () => {
    const text = encodeURIComponent(`Check my Christmas card: ${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const onNativeShare = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: 'Christmas Card', text: 'A little Christmas greeting', url })
      } catch {}
    } else {
      alert('Share not supported on this device')
    }
  }

  return (
    <div className="flex gap-3">
      <button onClick={onCopy} className="px-3 py-1 bg-slate-700 rounded">Copy Link</button>
      <button onClick={onWhatsApp} className="px-3 py-1 bg-green-600 rounded">WhatsApp</button>
      <button onClick={onNativeShare} className="px-3 py-1 bg-blue-600 rounded">Share</button>
    </div>
  )
}
