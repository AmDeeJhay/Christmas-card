"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageSheet from "./MessageSheet";

const Envelope = ({ message }: { message: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    // Start opening
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 800); // wait a bit before opening

    const sheetTimer = setTimeout(() => {
      setShowSheet(true);
    }, 2000); // show sheet after envelope has opened

    return () => {
      clearTimeout(openTimer);
      clearTimeout(sheetTimer);
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-center h-full w-full">
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.img
              key="closed-envelope"
              src="/images/envelope.png"
              alt="Closed Envelope"
              className="w-64 h-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}

          {isOpen && !showSheet && (
            <motion.img
              key="open-envelope"
              src="/images/envelop-open.png"
              alt="Open Envelope"
              className="w-64 h-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </div>

      {showSheet && <MessageSheet message={message} />}
    </>
  );
};

export default Envelope;
