"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = () => {
    // basic validation
    if (!firstName.trim()) return alert('Please enter a first name')
    if (!lastName.trim()) return alert('Please enter a last name')
    if (!email.trim()) return alert('Please enter an email')

    const payload = { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() }
    try {
      localStorage.setItem('cardEncryption', JSON.stringify(payload))
      sessionStorage.setItem('cardEncryption', JSON.stringify(payload))
    } catch (e) {
      console.warn('Could not persist encryption info', e)
    }

    router.push('/create/message')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-950 relative overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 z-10">
        <h1 className="text-4xl md:text-5xl text-center mb-8 text-yellow-400 drop-shadow-lg" style={{ fontFamily: "'Mountains of Christmas', cursive" }}>
          Lock your message
        </h1>

        <div className="w-full max-w-sm space-y-4">
          <div>
            <label className="text-white text-xs mb-1 block text-left pl-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Recipient first name"
              className="w-full rounded-full border-2 border-red-600 bg-red-900/40 px-5 py-3.5 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-white text-xs mb-1 block text-left pl-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Recipient last name"
              className="w-full rounded-full border-2 border-red-600 bg-red-900/40 px-5 py-3.5 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-white text-xs mb-1 block text-left pl-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Recipient email"
              className="w-full rounded-full border-2 border-red-600 bg-red-900/40 px-5 py-3.5 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-white text-gray-900 font-medium rounded-full py-4 px-6 hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-lg mt-4"
          >
            Continue
          </button>
        </div>
      </div>

      <footer className="py-6 text-center text-sm text-white/70 z-10 flex-shrink-0">powered by Applift</footer>
    </div>
  )
}
