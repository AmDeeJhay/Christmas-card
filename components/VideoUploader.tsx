"use client"
import React, { useCallback, useRef, useState } from 'react'
import { validateFileType } from '../lib'

type Props = {
  onChange: (dataUrl: string | null) => void
}

export default function VideoUploader({ onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = useCallback((file?: File) => {
    setError(null)
    if (!file) return
    if (!validateFileType(file)) return setError('Invalid file type. Use MP4 or MOV.')
    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  return (
    <div className="p-4 bg-slate-800/40 rounded-lg">
      <label className="block">
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400">
          <p>Drag & drop MP4/MOV here, or click to browse</p>
          <p className="text-sm text-slate-400 mt-2">Max 45s recommended</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files?.[0])}
          className="hidden"
        />
      </label>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  )
}
