"use client"
import React from 'react'
import useVideoRecorder from '../hooks/useVideoRecorder'

type Props = { onRecorded: (dataUrl: string) => void }

export default function VideoRecorder({ onRecorded }: Props) {
  const { start, stop, recording, recordedBlob, isSupported, seconds } = useVideoRecorder()

  React.useEffect(() => {
    if (recordedBlob) {
      const reader = new FileReader()
      reader.onload = () => onRecorded(reader.result as string)
      reader.readAsDataURL(recordedBlob)
    }
  }, [recordedBlob, onRecorded])

  if (!isSupported) return <p className="text-slate-400">Recording not supported in this browser.</p>

  return (
    <div className="p-4 bg-slate-800/40 rounded-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={start}
          disabled={recording}
          className="bg-red-500 px-3 py-1 rounded disabled:opacity-50"
        >
          Record
        </button>
        <button
          onClick={stop}
          disabled={!recording}
          className="bg-slate-600 px-3 py-1 rounded disabled:opacity-50"
        >
          Stop
        </button>
        <div className="text-sm text-slate-300">{recording ? `Recording • ${seconds}s` : 'Ready to record (45s max)'}</div>
      </div>
    </div>
  )
}
