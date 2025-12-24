"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/framer-motion/page-transition";

export default function RecordingPage() {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const router = useRouter();
  const isOpening = stage > 0;

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1000);
    const t2 = setTimeout(() => setStage(2), 2300);
    // Navigate after animation completes (add a small delay for smooth transition)
    const t3 = setTimeout(() => {
      router.push("/recording/watch-video");
    }, 3500); // 3.5 seconds total (2.3s + 1.2s buffer)

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router]);

  return (
    <PageTransition>
      <div className="relative min-h-screen flex flex-col items-center overflow-hidden bg-[#1a0000]">
        {/* Snow background */}
        <div className="absolute inset-0 z-10">
          <Image
            src="/images/snow-flakes.svg"
            alt="Snow background"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
        </div>

        {/* Tree top */}
        <div className="relative w-full h-36 z-20">
          <Image
            src="/images/xmas-tree-top.png"
            alt="Christmas tree"
            fill
            priority
            sizes="100vw"
            className="object-contain object-top"
          />
        </div>

        {/* Main content */}
        <motion.main
          suppressHydrationWarning
          layout
          transition={{ layout: { duration: 0.8, ease: "easeInOut" } }}
          className="relative z-20 flex flex-col items-center text-center px-6 max-w-2xl mt-12"
        >
          {/* Hint box (only before opening) */}
          <AnimatePresence>
            {!isOpening && (
              <motion.div
                key="hint-box"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full border border-dashed border-[#F78000] bg-[#3D2201] rounded-[10px] py-1 mb-6"
              >
                <p className="text-[9px] text-[#F78000]">
                  Someone thought of you… and left a <br />
                  Christmas message just for your heart.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.8, ease: "easeInOut" } }}
            className="mb-8"
          >
            <AnimatePresence mode="wait">
              {!isOpening ? (
                <motion.h1
                  key="title-initial"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl text-[#FFC758]"
                >
                  Recorded With Love, <br /> Wrapped in joy
                </motion.h1>
              ) : (
                <motion.h1
                  key="title-opening"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl text-[#FFC758]"
                >
                  Opening your message
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Gift box */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.8, ease: "easeInOut" } }}
            className="relative w-56 h-56 md:w-64 md:h-64"
          >
            <AnimatePresence mode="sync">
              {stage === 0 && (
                <motion.div
                  key="box-closed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/gift-box.png"
                    alt="Gift box closed"
                    fill
                    sizes="225px"
                    className="object-contain"
                  />
                </motion.div>
              )}

              {stage === 1 && (
                <motion.div
                  key="box-open"
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/gift-box-fully-open.png"
                    alt="Gift box fully open"
                    fill
                    sizes="370px"
                    className="object-contain"
                  />
                </motion.div>
              )}

              {stage === 2 && (
                <motion.div
                  key="box-lid-aside"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/gift-box-semi-open.png"
                    alt="Gift box lid aside"
                    fill
                    sizes="370px"
                    className="object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Loading indicator */}
          <AnimatePresence>
            {stage === 2 && (
              <motion.div
                key="loading-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-[#FFC758] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#FFC758] rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-[#FFC758] rounded-full animate-pulse delay-300"></div>
                </div>
                <p className="text-sm text-[#FFC758] mt-2">
                  Loading your message...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        {/* Footer */}
        <footer className="relative z-20 py-6 mt-auto text-xs text-gray-300">
          powered by Applift
        </footer>
      </div>
    </PageTransition>
  );
}
