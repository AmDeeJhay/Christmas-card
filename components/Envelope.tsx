"use client"
import React from 'react'
import Image from 'next/image'

type Props = {
  sealImage?: string
}

export default function Envelope({ sealImage = '/images/santa-seal.png' }: Props) {
  return (
    <div className="relative w-full aspect-[3/2] bg-gradient-to-br from-[#ff9999] to-[#ff7777] rounded-lg overflow-hidden shadow-lg">
      {/* Envelope flap lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <line x1="0%" y1="0%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <line x1="100%" y1="0%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <line x1="50%" y1="50%" x2="0%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="50%" y1="50%" x2="100%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </svg>

      {/* Seal in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-24 h-24">
          <Image
            src={sealImage}
            alt="Santa seal"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
