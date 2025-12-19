"use client"
import React, { useState, useEffect } from 'react'
import VideoUploader from '../../../../components/VideoUploader'
import VideoRecorder from '../../../../components/VideoRecorder'
import MessageInput from '../../../../components/MessageInput'
import { useRouter, useParams } from 'next/navigation'

export default function CreateMessageDynamicPage() {
  const [videoDataUrl, setVideoDataUrl] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cardDraft') || sessionStorage.getItem('cardDraft')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.videoDataUrl) setVideoDataUrl(parsed.videoDataUrl)
        if (parsed?.message) setMessage(parsed.message)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const onContinue = () => {
    if (!videoDataUrl) return alert('Please add a video before continuing')
    const draft = { videoDataUrl, message }
    const serialized = JSON.stringify(draft)
    try {
      localStorage.setItem('cardDraft', serialized)
      sessionStorage.setItem('cardDraft', serialized)
    } catch (e) {
      console.warn('Could not persist draft to storage', e)
    }
    // navigate to preview; keep the same id in the url context
    router.push('/preview')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Create your message</h2>

      <div className="grid gap-4">
        <VideoUploader onChange={(d) => setVideoDataUrl(d)} />
        <div className="divider text-center text-slate-400">or</div>
        <VideoRecorder onRecorded={(d) => setVideoDataUrl(d)} />
      </div>

      <MessageInput value={message} onChange={setMessage} />

      <div className="flex justify-end">
        <button
          onClick={onContinue}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          Continue to Preview
        </button>
      </div>
    </div>
  )
}
