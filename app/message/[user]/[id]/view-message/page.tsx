import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/framer-motion/page-transition";
import Envelope from "@/components/framer-motion/envelope-reveal";

export default function ViewPage() {
  return (
    <PageTransition>
      <div className="relative h-full flex flex-col items-center justify-start overflow-hidden">
        {/* Background snow pattern */}
        <div className="absolute inset-0 z-10 ">
          <Image
            src="/images/snow flakes-bg.png"
            alt="snow background"
            fill
            objectFit="cover"
            objectPosition="center"
            className="object-cover opacity-30"
            priority
          />
        </div>

        {/* Tree banner at the top */}
        <div className="w-full relative h-36 z-[1000]">
          <Image
            src="/images/xmas-tree-top.png"
            alt="Christmas tree"
            fill
            layout="fill"
            objectFit="contain"
            objectPosition="top"
            priority
          />
        </div>

        {/* Main content */}
        <main className="flex flex-col items-center text-center px-6 max-w-2xl z-10">
          <h1 className="text-4xl md:text-5xl font-normal text-[#FFC758] mb-4">
            Opening your message
          </h1>

          {/* Envelope image */}
          {/* <div className="relative cursor-pointer w-48 h-32 md:w-64 md:h-44 mb-6">
            <Image
              src="/images/envelope.png"
              alt="Envelope"
              fill
              className="object-contain"
            />
          </div> */}
          <Envelope
            message="Hey Dora
            This little digital note comes with a sprinkle of holiday magic just for you. 🌟

May your Christmas be filled with laughter louder than the office printer, treats sweeter than our coffee breaks, and all the joy your heart can hold. 🎅❄️

P.S. Working with you this year has been the best gift of all… just saying. 😉

Merry Christmas & Happy New Year!” 🎉💌"
          />
        </main>

        {/* Footer */}
        <footer className="py-6 justify-self-end mt-auto text-sm text-[#FFFFFF]">
          powered by Applift
        </footer>
      </div>
    </PageTransition>
  );
}
