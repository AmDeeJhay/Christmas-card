"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MessageSheet from "./MessageSheet";

const frames = [
  "/images/envelope.png", 
  "/images/step2.png",
  "/images/step3.png", 
  "/images/step4.png", 
  "/images/step5.png", 
];

const FRAME_DURATION = 600; 
const FADE_DURATION = 0.6; 

const EnvelopeSequence = ({ message }: { message: string }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < frames.length) {
      const t = setTimeout(() => setIndex((i) => i + 1), FRAME_DURATION);
      return () => clearTimeout(t);
    }
  }, [index]);

  const showSheet = index >= frames.length;

  return (
    <>
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="relative w-64 h-40 sm:h-48 md:h-56">
          {frames.map((src, i) => (
            <motion.img
              key={src}
              src={src}
              alt={`envelope-frame-${i}`}
              className="absolute inset-0 w-full h-full object-contain select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === i ? 1 : 0 }}
              transition={{
                duration: FADE_DURATION,
                ease: "easeInOut",
              }}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {showSheet && <MessageSheet message={message} />}
    </>
  );
};

export default EnvelopeSequence;
