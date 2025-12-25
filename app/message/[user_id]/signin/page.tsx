"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PageTransition from "@/components/framer-motion/page-transition";
import { openMessage } from "@/lib/api";

export default function SignInPage() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams() as { user_id?: string };
  const slug = params?.user_id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;

    setLoading(true);
    try {
      const messageData = await openMessage(slug);

      localStorage.setItem(`message:${slug}`, JSON.stringify(messageData));
      router.push(`/message`);
    } catch (error) {
      alert("Message not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative h-full flex flex-col items-center justify-center overflow-hidden">
        {/* Tree banner at the top */}
        <div className="w-full relative h-36 z-10">
          <Image
            src="/images/xmas-tree-top.png"
            alt="Christmas tree"
            fill
            className="object-cover object-bottom"
            priority
          />
        </div>

        {/* Main content */}
        <main className="flex flex-col items-center text-center px-6 max-w-2xl z-10 w-full">
          {/* Inputs */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full mb-4"
          >
            <div className="flex flex-col items-start w-full">
              <label className="text-white text-xs mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border border-[#FF0F0F] bg-[#501F1F] px-4 py-3 text-white placeholder:text-[#804040] placeholder:text-[11px] focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col items-start w-full">
              <label className="text-white text-xs mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-full border border-[#FF0F0F] bg-[#501F1F] px-4 py-3 text-white placeholder:text-[#804040] placeholder:text-[11px] focus:outline-none"
                required
              />
            </div>

            {/* No password required to open messages anymore */}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-white border transition-class border-white text-black font-medium rounded-full py-4 px-6 w-full md:w-auto hover:bg-transparent hover:text-white hover:border-white transition-colors text-sm md:text-base disabled:opacity-50"
            >
              {loading ? "Opening..." : "Open My Message"}
            </button>
          </form>

          {/* Hint removed */}
        </main>

        {/* Footer */}
        <footer className="py-6 justify-self-end mt-auto text-sm text-[#FFFFFF]">
          powered by Applift
        </footer>
      </div>
    </PageTransition>
  );
}
