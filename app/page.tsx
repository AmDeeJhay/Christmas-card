"use client";
import Link from "next/link";


export default function HomePage() {
  return (
    <main className="relative h-full w-full flex flex-col">
      {/* Background image container */}
      <div className="absolute inset-0 md:max-w-xl md:rounded-3xl md:m-4 md:mx-auto flex justify-center items-center z-0">
        <div
          className="w-full h-full bg-top bg-cover md:max-w-5xl md:rounded-3xl md:mx-auto"
          style={{ backgroundImage: "url('/images/santa-home.png')" }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-[#220000] via-[#22000000] to-transparent z-10" />

      {/* Content at bottom */}
      <div className="relative flex z-100 flex-col gap-4 h-full w-full justify-end items-center">
        {/* Title */}
        <h1 className="text-[#FFC758] text-3xl md:text-5xl font-bold drop-shadow-lg text-center mb-4">
          Holigram
        </h1>

        {/* Buttons */}
        <div className="px-6 pb-10 md:px-12 md:pb-10 flex flex-col gap-4 w-full max-w-md">
          {/* Primary button */}
          <button className="bg-white border border-white flex items-center justify-center text-center text-[#000000] font-normal rounded-full py-4 px-6 w-full hover:border-white hover:bg-transparent hover:text-white transition-class text-sm md:text-base">
            Send a Message
          </button>

          {/* Secondary button */}
          <Link
            href={"message/user/883838"}
            className="bg-transparent border flex items-center justify-center text-center border-white text-white font-normal rounded-full py-4 px-6 w-full hover:bg-white hover:text-[#220000] transition-class text-sm md:text-base"
          >
            Check for a Message
          </Link>
        </div>
      </div>
    </main>
  );
}
