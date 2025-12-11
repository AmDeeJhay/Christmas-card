import type { Card } from '../types/card'

export async function saveCard(card: Card) {
  // card.videoUrl is expected to be a data URL here
  try {
    localStorage.setItem(`card:${card.id}`, JSON.stringify(card))
    const indexRaw = localStorage.getItem('cardsIndex')
    const index = indexRaw ? JSON.parse(indexRaw) : []
    index.push(card.id)
    localStorage.setItem('cardsIndex', JSON.stringify(index))
    return true
  } catch (e) {
    console.error('Failed to save card', e)
    return false
  }
}

export function getCard(id: string): Card | null {
  const raw = localStorage.getItem(`card:${id}`)
  if (!raw) return null
  return JSON.parse(raw)
}
