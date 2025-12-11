"use client"
import React from 'react'

type Props = {
  videoUrl: string
  message: string
}

export default function CardPreview({ videoUrl, message }: Props) {
  return (
    <div className="rounded-lg overflow-hidden bg-[url('/christmas-bg.png')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/60" />
      <div className="relative p-6">
        <div className="aspect-video bg-black rounded overflow-hidden">
          <video src={videoUrl} controls className="w-full h-full object-cover" />
        </div>
        <div className="mt-4 p-4 bg-slate-800/40 rounded">
          <p className="text-lg">{message}</p>
        </div>
      </div>
    </div>
  )
}
