"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'

const PasswordLockPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = () => {
    const payload = { firstName, lastName, email }
    try {
      localStorage.setItem('cardEncryption', JSON.stringify(payload))
      sessionStorage.setItem('cardEncryption', JSON.stringify(payload))
    } catch (e) {
      console.warn('Could not persist encryption info', e)
    }
    router.push('/create/message')
  };

  return (
    <div className="min-h-screen bg-gradient-to-b relative overflow-hidden flex flex-col">
      {/* Christmas garland decoration at top */}
      <div className="w-full relative h-32 z-10 flex-shrink-0">
        <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
          {/* Green garland branches */}
          
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-8 z-10">
        {/* Title */}
        <h1 
          className="text-4xl md:text-5xl text-center mb-12 text-yellow-400 drop-shadow-lg"
          style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        >
          Santa this<br />message is to
        </h1>

        {/* Form */}
        <div className="w-full max-w-sm space-y-4">
          {/* First Name */}
          <div className="w-full">
            <label className="text-white text-xs mb-1 block text-left pl-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter a password to lock this message"
              className="w-full rounded-full border-2 border-red-600 bg-red-900/40 px-5 py-3.5 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Last Name */}
          <div className="w-full">
            <label className="text-white text-xs mb-1 block text-left pl-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter a password to lock this message"
              className="w-full rounded-full border-2 border-red-600 bg-red-900/40 px-5 py-3.5 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="w-full">
            <label className="text-white text-xs mb-1 block text-left pl-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Recipient email"
              className="w-full rounded-full border-2 border-red-600 bg-red-900/40 px-5 py-3.5 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-white text-gray-900 font-medium rounded-full py-4 px-6 hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-lg mt-6"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-white/70 z-10 flex-shrink-0">
        powered by Applift
      </footer>

      {/* Falling snow effect */}
    </div>
  );
};

export default PasswordLockPage;