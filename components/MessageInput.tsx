"use client"
import React from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function MessageInput({ value, onChange }: Props) {
  const remaining = 150 - (value?.length || 0)

  return (
    <div>
      <label className="block text-sm font-medium">Message</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 150))}
        rows={4}
        className="w-full mt-2 p-3 rounded bg-slate-800 border border-slate-700 text-slate-100"
        placeholder="Write a short holiday message (150 characters)"
      />
      <div className="text-xs text-slate-400 mt-1 text-right">{remaining} characters remaining</div>
    </div>
  )
}
