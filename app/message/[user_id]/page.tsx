import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/framer-motion/page-transition";

export default function Page() {
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
          <main className="flex flex-col items-center h-full text-center px-6 max-w-2xl z-10">
            <h1 className="text-4xl md:text-5xl font-normal text-[#FFC758] mb-4">
              You’ve Got a Message!
            </h1>
            <p className="text-base text-[#FFFFFF] mb-6">
              Someone special has sent you a note or video. Click below to open
              and see your holiday surprise!
            </p>

            {/* Envelope image */}
            <div className="relative cursor-pointer w-48 h-32 md:w-64 md:h-44 mb-6">
              <Image
                src="/images/envelope.png"
                alt="Envelope"
                fill
                className="object-contain"
              />
            </div>

            {/* Button */}
            <Link
              href={"/message/user/signin"}
              className="bg-white transition-class border mt-auto border-white text-black font-medium rounded-full py-4 px-6 w-full hover:bg-transparent hover:text-white hover:border-white transition-colors text-sm md:text-base"
              style={{
                boxShadow: "0 -4px 50px #ff2b2b58, 0 4px 50px #ff2b2b58",
              }}
            >
              Open My Message
            </Link>
          </main>

          {/* Footer */}
          <footer className="py-6 justify-self-end mt-auto text-sm text-[#FFFFFF]">
            powered by Applift
          </footer>
        </div>
      </PageTransition>
    );
}
