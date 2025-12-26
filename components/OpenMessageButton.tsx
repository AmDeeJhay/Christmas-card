"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { openMessage } from "@/lib/api";

type Props = {
  slug?: string;
  onOpen?: (data: any) => void;
};

export default function OpenMessageButton({ slug, onOpen }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!slug) {
      setError('No message ID provided');
      return;
    }

    setLoading(true);
    setError(null);
    
    console.log('🔓 Opening message with slug:', slug);

    try {
      const data = await openMessage(slug);
      console.log('✅ Message data received:', data);

      // Cache the message data
      try {
        localStorage.setItem(`message:${slug}`, JSON.stringify(data));
      } catch (e) {
        console.warn('Could not cache message', e);
      }

      if (!data) {
        setError('Message not found');
        return;
      }

      // Call the onOpen callback if provided
      if (typeof onOpen === 'function') {
        console.log('Calling onOpen callback with data');
        onOpen(data);
        return;
      }

      // Fallback: navigate to the message display route
      router.push(`/message/${slug}/text`);
    } catch (e: any) {
      console.error('❌ Failed to open message:', e);
      
      const status = e?.response?.status;
      let errorMessage = 'Failed to open message';

      if (status === 404) {
        errorMessage = 'Message not found. Please check the link.';
      } else if (status === 401 || status === 403) {
        errorMessage = 'You are not authorized to view this message.';
      } else if (status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (e?.message) {
        errorMessage = e.message;
      } else if (e?.response?.data?.message) {
        errorMessage = e.response.data.message;
      }

      setError(errorMessage);
      
      // Show alert as well for user feedback
      alert(errorMessage + (status ? ` (Error ${status})` : ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={loading || !slug}
        className={`bg-white transition-class border mt-auto border-white font-medium rounded-full py-4 px-6 w-full hover:bg-transparent hover:text-white hover:border-white transition-colors text-sm md:text-base ${
          loading || !slug 
            ? 'opacity-50 cursor-not-allowed text-gray-400' 
            : 'text-black'
        }`}
        style={{ boxShadow: "0 -4px 50px #ff2b2b58, 0 4px 50px #ff2b2b58" }}
      >
        {loading ? "Opening..." : "Open My Message"}
      </button>
      
      {error && (
        <p className="text-red-400 text-sm mt-2 text-center">
          {error}
        </p>
      )}
      
      {!slug && (
        <p className="text-yellow-400 text-xs mt-2 text-center">
          Invalid message link
        </p>
      )}
    </div>
  );
}