"use client";

import React, { useState } from "react";

const OverviewPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const messageLink = "holigram/message/dora_etim/bhvgjkbadfyuqgejeuguywvhjc";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  return (
    <div className="h-screen w-full bg-[#220000] relative overflow-hidden flex flex-col items-center">
      {/* Main content area - constrained to viewport, centered */}
      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-start mt-3 px-6 pt-3 pb-4 relative">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-semibold text-center mt-3 mb-1 text-[#FFC758]" style={{ fontFamily: "'Mountains of Christmas', cursive" }}>
          Your Message Has
          <br />
          Been Sent!!
        </h1>

        {/* Info box */}
        <div className="w-full border border-dashed border-green-600 bg-[#09A50E]/20 rounded-lg px-4 py-2 text-center text-[#09A50E] text-[10px] mb-4 z-30">
          Your festive greeting is on its way… and someone very special is about to feel the Christmas magic
        </div>

        {/* Santa container: image + decorative spiral + absolute copy pill */}
        <div className=" w-full flex justify-center items-center mb-18 h-[260px] sm:h-[320px]">
          <img src="/images/santa-chariot.png" alt="Santa Sleigh" className="absolute left-1/2 transform -translate-x-1/2 -bottom-20 h-auto z-10 object-contain pointer-events-none" />

          {/* Decorative spiral overlay (positioned over lower-right of sleigh) */}
          <img src="/images/spiral.svg" alt="Spiral" className="absolute right-10 bottom-36 w-30 h-auto z-20 pointer-events-none" />

          {/* Overlay between sleigh legs and copy pill */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-32 w-[92%] bg-[#220000]/98 pointer-events-none"
            style={{ zIndex: 15 }}
          />
        </div>

        
        <div className="absolute left-55 transform -translate-x-1/2 bottom-27 z-30 flex items-center gap-2 max-w-full">
          <div className="flex-1 bg-white rounded-full px-4 py-1 shadow-lg text-[12px] text-[#FF0000] truncate">{messageLink}</div>
          <button onClick={handleCopy} className="mr-12 bg-[#F5C000] text-black px-4 py-1 rounded-full text-xs font-medium">{copied ? 'Copied!' : 'Copy'}</button>
        </div>

        {/* small helper label */}
        {/* <p className="text-xs text-white/70 mb-2">Click to copy message link</p> */}

        {/* CTAs - stacked and sized to match mock */}
        <div className="w-full flex flex-col gap-2 mt-4 -mb-5 z-20">
          <button className="w-full bg-white text-gray-900 rounded-full py-3 text-base font-medium shadow-lg active:scale-95 transition"
          >Send Another Message
          </button>
          <button className="w-full border-[1.5px] border-white text-white rounded-full py-3 text-sm active:scale-95 transition"
          >Back to Home
          </button>
        </div>
      </main>

      {/* Footer (anchored at bottom, small) */}
      <footer className="h-12 w-full flex-shrink-0 flex items-center justify-center text-center text-sm text-white/70">powered by Applift</footer>
    </div>
  );
};

export default OverviewPage;