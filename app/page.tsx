"use client"
import Link from 'next/link'
import React from 'react'

export default function HomePage() {
  return (
    <main className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold">Christmas Video Card</h1>
        <p className="mt-2 text-slate-300">Create a short video card and share a festive message.</p>
      </header>

      <section className="bg-slate-800/50 rounded-lg p-6 flex flex-col gap-4 items-center">
        <img src="/logo.svg" alt="logo" className="w-24 h-24 object-contain" />
        <p className="text-center max-w-xl">Record or upload a short (max 45s) video, add a message (150 chars), preview it, then generate a shareable link.</p>
        <Link href="/create" className="mt-2 inline-block bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg">Create a Card</Link>
      </section>
    </main>
  )
}
