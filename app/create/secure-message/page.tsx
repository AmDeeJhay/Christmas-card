"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SecureMessagePage: React.FC = () => {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [hint, setHint] = useState("");

  const handleNext = () => {
    const payload = {
      password: password || null,
      hint: hint || null,
    };

    try {
      localStorage.setItem("cardSecurity", JSON.stringify(payload));
      sessionStorage.setItem("cardSecurity", JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not persist secure message info", e);
    }

    router.push("/create/newsletter");
  };

  const handleSkip = () => {
    try {
      localStorage.setItem(
        "cardSecurity",
        JSON.stringify({ password: null, hint: null })
      );
    } catch (e) {
      console.warn("Could not persist skip state", e);
    }

    router.push("/create/newsletter");
  };

  const isNextEnabled = password.trim() !== '' || hint.trim() !== ''

  return (
    <div className="min-h-screen w-screen bg-[#220000] relative overflow-hidden flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 z-20 pt-16 pb-36">
        {/* Title */}
        <h1
          className="text-3xl text-center mb-4 text-yellow-400 drop-shadow-lg"
          style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        >
          Add a Little Extra
          <br />
          Magic to Your Message
        </h1>

        {/* Info Box */}
        <div className="w-full border border-dashed border-[#09A50E] bg-[#0D2900] rounded-lg px-4 py-3 text-center text-[#09A50E] text-xs mb-8">
          Protect your Christmas message with a password and add a short
          note if you'd like. These are optional—but they make your message
          feel even more personal.
        </div>

        {/* Password */}
        <div className="w-full mb-2">
          <label className="text-white text-xs mb-1 block pl-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password to lock this message..."
            className="block w-full rounded-full border-2 border-[#FF0F0F] bg-[#501F1F] px-4 py-3 text-white placeholder:text-[#804040] text-xs focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        {/* Hint */}
        <div className="w-full mb-8">
          <label className="text-white text-xs mb-1 block pl-1">
            Hint
          </label>
          <textarea
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            rows={4}
            placeholder="You can leave a hint, a greeting, or a sweet message preview."
            className="block w-full rounded-2xl border-2 border-[#FF0F0F] bg-[#501F1F] px-4 py-3 text-white placeholder:text-[#804040] text-xs focus:outline-none resize-none"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!isNextEnabled}
          aria-disabled={!isNextEnabled}
          className={`w-full rounded-full py-4 font-medium shadow-lg mb-4 transition ${isNextEnabled ? 'bg-white text-gray-900 active:scale-95' : 'bg-white/30 text-gray-400 cursor-not-allowed'}`}
        >
          Next
        </button>

        {/* Skip */}
        <button
          onClick={handleSkip}
          className="text-white/70 text-sm underline underline-offset-4"
        >
          Skip this step
        </button>
      </div>

      {/* Snow as a bottom background layer */}
      <div className="absolute left-0 right-0 bottom-0 h-40 z-10 pointer-events-none">
        <img
          src="/images/snow.svg"
          alt="Snow"
          className="w-full h-full object-bottom object-cover"
        />
      </div>

      {/* Footer overlaying the snow */}
      <footer className="absolute left-0 right-0 bottom-4 z-30 text-center text-sm text-[#0A0A0A]">
        powered by Applift
      </footer>
    </div>
  );
};

export default SecureMessagePage;
