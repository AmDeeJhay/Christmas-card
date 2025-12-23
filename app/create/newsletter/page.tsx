"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const NewsletterPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    const payload = {
      notifyEmail: email || null,
    };

    try {
      localStorage.setItem("cardNotification", JSON.stringify(payload));
      sessionStorage.setItem("cardNotification", JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not persist notification email", e);
    }

    router.push("/create/overview");
  };

  const handleSkip = () => {
    try {
      localStorage.setItem(
        "cardNotification",
        JSON.stringify({ notifyEmail: null })
      );
    } catch (e) {
      console.warn("Could not persist skip notification", e);
    }

    router.push("/create/overview");
  };

  return (
    <div className="min-h-full w-screen bg-[#220000] relative overflow-hidden flex flex-col">
      {/* Garland */}
      <div className="w-full relative h-32 flex-shrink-0">
        <img
          src="/images/Garland.svg"
          alt="Garland"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center px-6 z-10">
        {/* Bells */}
        <div className="mt-2 mb-6">
          <img
            src="/images/bells.png"
            alt="Christmas Bells"
            className="w-40 h-auto mx-auto"
          />
        </div>

        {/* Title */}
        <h1
          className="text-2xl text-center mb-8 text-yellow-400 drop-shadow-lg max-w-xs leading-snug"
          style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        >
          Get notified when someone
          <br />
          views your message
        </h1>

        {/* Email Input */}
        <div className="w-full mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="block w-full rounded-full border-2 border-[#FF0F0F] bg-[#501F1F] px-5 py-3 text-white placeholder:text-[#804040] text-xs focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-white text-gray-900 rounded-full py-4 font-medium transition mb-4 focus:outline-none hover:shadow-[0_8px_24px_rgba(243,9,9,0.25)] focus:shadow-[0_10px_28px_rgba(243,9,9,0.30)] active:shadow-[0_6px_18px_rgba(243,9,9,0.40)] active:scale-95"
        >
          Submit
        </button>

        {/* Skip */}
        <button
          onClick={handleSkip}
          className="w-full border-[1.5px] hover:bg-white hover:text-[#0A0A0A] border-white text-white rounded-full py-3 text-sm transition focus:outline-none hover:shadow-[0_8px_24px_rgba(243,9,9,0.25)] focus:shadow-[0_10px_28px_rgba(243,9,9,0.30)] active:shadow-[0_6px_18px_rgba(243,9,9,0.40)] active:scale-95"
        >
          Skip for now
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-white/70 py-6">
        powered by Applift
      </footer>
    </div>
  );
};

export default NewsletterPage;
