"use client"
import { useEffect, useRef, useState } from 'react'

export default function useVideoRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [recording, setRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [seconds, setSeconds] = useState(0)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!('MediaRecorder' in window)) setIsSupported(false)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      chunksRef.current = []
      const mr = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
      mediaRecorderRef.current = mr
      mr.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const b = new Blob(chunksRef.current, { type: 'video/webm' })
        setRecordedBlob(b)
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      setRecording(true)
      setSeconds(0)
      timerRef.current = window.setInterval(() => {
        setSeconds(s => {
          const ns = s + 1
          if (ns >= 45) stop()
          return ns
        })
      }, 1000)
    } catch {
      setIsSupported(false)
    }
  }

  const stop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setRecording(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  return { isSupported, start, stop, recording, recordedBlob, seconds }
}
