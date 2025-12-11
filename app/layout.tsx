import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Christmas Video Card',
  description: 'Create and share small Christmas video cards',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-slate-900 via-slate-700 to-slate-900 text-slate-100 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  )
}
