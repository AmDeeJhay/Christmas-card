import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";


const MessageSheet = ({ message }:{message:string}) => {
  return (
    <motion.div
      className="sheet-modal flex flex-col items-center justify-center h-full w-full bg-center bg-cover"
      style={{
        backgroundImage: "url('/images/message-bg.jpg')",
        backgroundColor: "rgba(255,255,255,0.6)",
        backgroundBlendMode: "overlay", 
      }}
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="sheet-content h-full pt-40">
        <h2 className="text-[#594646] great-vibes flex flex-col items-center justify-center h-full w-full whitespace-pre-line">
          {message}
        </h2>

        <div className=" pt-24 flex flex-col items-center justify-center w-full px-4">
          <Link
            href={"/"}
            className="bg-black border transition-class border-black text-white hover:text-black font-medium rounded-full py-4 px-6 w-full md:w-auto hover:bg-transparent transition-colors text-sm md:text-base"
            style={{
              boxShadow: "0 -4px 50px #ff2b2b58, 0 4px 50px #ff2b2b58",
            }}
          >
            {" "}
            Back Home
          </Link>

          <footer className="pt-4 pb-8 justify-self-end text-sm text-[#220000]">
            powered by Applift
          </footer>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageSheet;
