"use client"

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image';

const PasswordLockPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('')
  const router = useRouter()
  const params = useParams()

  const handleSubmit = () => {
    const payload = { firstName, lastName, email }
    try {
      localStorage.setItem('cardEncryption', JSON.stringify(payload))
      sessionStorage.setItem('cardEncryption', JSON.stringify(payload))
    } catch (e) {
      console.warn('Could not persist encryption info', e)
    }
    const id = params?.id || 'lock'
    router.push(`/create/${id}/message`)
  };

  const isFormValid = firstName.trim() !== '' && lastName.trim() !== '' && email.trim() !== ''

  return (
    <div className="min-h-screen w-screen -mt-9 bg-gradient-to-b relative overflow-hidden flex flex-col px-0">
      {/* Christmas garland decoration at top */}
      <div className="w-full relative h-32 top-5 flex-shrink-0">
        <img
          src="/images/Garland.svg"
          alt="Garland"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 z-10 px-6">
        {/* Title */}
        <h1 
          className="text-4xl md:text-5xl text-center mb-12 text-yellow-400 drop-shadow-lg"
          style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        >
          Santa this<br />message is to
        </h1>

        {/* Form */}
        <div className="w-full max-w-none space-y-4">
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
              className="block w-full rounded-full border-2 border-red-600 bg-red-900/40 px-4 py-3 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
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
              className="block w-full rounded-full border-2 border-red-600 bg-red-900/40 px-4 py-3 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
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
              className="block w-full rounded-full border-2 border-red-600 bg-red-900/40 px-4 py-3 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            aria-disabled={!isFormValid}
            className={`w-full font-medium rounded-full py-4 px-6 mt-6 transition-all duration-200 shadow-lg ${isFormValid ? 'bg-white text-gray-900 hover:bg-gray-100 active:scale-95' : 'bg-white/30 text-gray-400 cursor-not-allowed'}`}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm -mt-3 text-white/70 z-10 flex-shrink-0">
        powered by Applift
      </footer>

      {/* Falling snow effect */}
    </div>
  );
};

export default PasswordLockPage;