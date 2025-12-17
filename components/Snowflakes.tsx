"use client"
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  src?: string // path to SVG in public folder (default: /images/snow-flakes.svg)
  tintColor?: string // color to tint white flakes (applied via blend/mix)
  opacity?: number
  className?: string
}

export default function Snowflakes({ src = '/images/snow-flakes.svg', tintColor = '#ff4d4d', opacity = 0.6, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(src)
        if (!res.ok) return
        const svgText = await res.text()
        if (cancelled) return
        if (containerRef.current) {
          containerRef.current.innerHTML = svgText
          // Apply mix-blend-mode and opacity to the injected svg
          const svgEl = containerRef.current.querySelector('svg') as SVGElement | null
          if (svgEl) {
            svgEl.setAttribute('preserveAspectRatio', 'xMidYMid slice')
            svgEl.style.width = '100%'
            svgEl.style.height = '100%'
            svgEl.style.opacity = String(opacity)
            svgEl.style.mixBlendMode = 'screen'
          }
          // Add a tint overlay layer using CSS blend: we'll insert a child overlay div
          const overlay = document.createElement('div')
          overlay.style.position = 'absolute'
          overlay.style.inset = '0'
          overlay.style.backgroundColor = tintColor
          overlay.style.mixBlendMode = 'multiply'
          overlay.style.pointerEvents = 'none'
          overlay.style.opacity = '1'
          containerRef.current.appendChild(overlay)
        }
        setLoaded(true)
      } catch (e) {
        console.warn('Failed to load SVG', e)
      }
    }
    load()
    return () => { cancelled = true }
  }, [src, tintColor, opacity])

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
      aria-hidden
    />
  )
}
