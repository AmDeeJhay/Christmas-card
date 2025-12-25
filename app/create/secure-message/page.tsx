"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SecureMessagePage: React.FC = () => {
  const router = useRouter();

  const handleNext = () => {
    try {
      localStorage.setItem("cardSecurity", JSON.stringify(null));
      sessionStorage.setItem("cardSecurity", JSON.stringify(null));
    } catch (e) {
      console.warn("Could not persist secure message info", e);
    }

    router.push("/create/newsletter");
  };

  const isNextEnabled = true;

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
          Password protection has been removed — continue to finalize your message.
        </div>

        <div className="w-full mb-6 text-sm text-white/80">
          Password protection has been removed. Messages will not be locked.
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-full rounded-full py-4 font-medium shadow-lg mb-4 transition bg-white text-gray-900 active:scale-95"
        >
          Continue
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
