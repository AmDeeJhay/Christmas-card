"use client"

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image';

const CreatePage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // const [email, setEmail] = useState('')
  const router = useRouter()
  const params = useParams()

  const handleSubmit = () => {
    if (!isFormValid) return;
    const payload = { firstName, lastName }
    try {
      localStorage.setItem('cardEncryption', JSON.stringify(payload))
      sessionStorage.setItem('cardEncryption', JSON.stringify(payload))
    } catch (e) {
      console.warn('Could not persist encryption info', e)
    }
    const id = params?.id || 'lock'
    router.push(`/create/${id}/message`)
  };

  const isFormValid = firstName.trim() !== '' && lastName.trim() !== '';

  return (
    <div className="min-h-screen h-full w-full bg-linear-to-b relative overflow-hidden flex flex-col px-0 pb-6">
      {/* Christmas garland decoration at top */}
      <div className="w-full relative h-32 top-0 ">
        <Image
          src="/images/Garland.svg"
          alt="Garland"
          fill
          className="w-full h-full object-cover object-bottom"
          priority
        />
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-xl w-full mx-auto flex flex-col items-center justify-center py-8 z-10 px-6">
        {/* Title */}
        <h1
          className="text-4xl md:text-5xl text-center mb-12 text-yellow-400 drop-shadow-lg"
          style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        >
          Santa this
          <br />
          message is to
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
              placeholder="Recipient's first name"
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
              placeholder="Recipient's last name"
              className="block w-full rounded-full border-2 border-red-600 bg-red-900/40 px-4 py-3 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Email */}
          {/* <div className="w-full">
            <label className="text-white text-xs mb-1 block text-left pl-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Recipient email"
              className="block w-full rounded-full border-2 border-red-600 bg-red-900/40 px-4 py-3 text-white placeholder:text-red-300/50 placeholder:text-xs focus:outline-none focus:border-red-500 transition-colors"
            />
          </div> */}

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            // aria-disabled={!isFormValid} 
            type="button"
            className={`w-full font-medium rounded-full py-4 px-6 mt-6 transition-all duration-200 ${isFormValid
                ? "bg-white text-gray-900 hover:shadow-[0_8px_24px_rgba(243,9,9,0.25)] focus:outline-none focus:shadow-[0_10px_28px_rgba(243,9,9,0.30)] active:shadow-[0_6px_18px_rgba(243,9,9,0.40)] active:scale-95"
                : "bg-white/30 text-gray-400 cursor-not-allowed"
              }`}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-white/70 z-10 shrink-0">
        powered by Applift
      </footer>

      {/* Falling snow effect */}
    </div>
  );
};

export default CreatePage;