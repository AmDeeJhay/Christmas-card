import React from 'react'

export type ToastType = 'info' | 'success' | 'error'

const colors: Record<ToastType, string> = {
    info: 'bg-slate-800 text-white',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
}

export default function Toast({ message, type = 'info' }: { message: string; type?: ToastType }) {
    return (
        <div className={`fixed right-4 top-6 z-50 max-w-xs p-3 rounded shadow-lg ${colors[type]}`}>
            <div className="text-sm">{message}</div>
        </div>
    )
}
