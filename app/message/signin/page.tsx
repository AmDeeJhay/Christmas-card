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
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams() as { id?: string };
  const slug = params?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !password) return;

    setLoading(true);
    try {
      const messageData = await openMessage(slug, password);
  
      localStorage.setItem(`message:${slug}`, JSON.stringify(messageData));
      router.push(`/message/user/${slug}/view-message`);
    } catch (error) {
      alert("Invalid password or message not found");
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

            <div className="flex flex-col items-start w-full">
              <label className="text-white text-xs mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border border-[#FF0F0F] bg-[#501F1F] px-4 py-3 text-white placeholder:text-[#804040] placeholder:text-[11px] focus:outline-none"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-white border transition-class border-white text-black font-medium rounded-full py-4 px-6 w-full md:w-auto hover:bg-transparent hover:text-white hover:border-white transition-colors text-sm md:text-base disabled:opacity-50"
            >
              {loading ? "Opening..." : "Open My Message"}
            </button>
          </form>

          {/* Hint Box */}
          <div className="w-full border border-dashed border-[#F78000] rounded-[10px] p-3 mb-6 bg-[#3D2201]">
            <p className="text-[9px] text-[#F78000] text-left">
              Hint: The day you almost killed me with work call and didn’t check
              on my mental health. It was a Wednesday we ended up talking for
              about 45 mins, you know what we talked about
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 justify-self-end mt-auto text-sm text-[#FFFFFF]">
          powered by Applift
        </footer>
      </div>
    </PageTransition>
  );
}
