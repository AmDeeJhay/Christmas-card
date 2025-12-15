import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/framer-motion/page-transition";

export default function SignInPage() {
  return (
    <PageTransition>
      <div className="relative h-full flex flex-col items-center justify-center overflow-hidden">
        {/* Tree banner at the top */}
        <div className="w-full relative h-36 z-10">
          <Image
            src="/images/xmas-tree-top.png"
            alt="Christmas tree"
            fill
            className="object-contain object-top"
            priority
          />
        </div>

        {/* Main content */}
        <main className="flex flex-col items-center text-center px-6 max-w-2xl z-10 w-full">
          {/* Inputs */}
          <form className="flex flex-col gap-4 w-full mb-4">
            <div className="flex flex-col items-start w-full">
              <label className="text-white text-xs mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-full border border-[#FF0F0F] bg-[#501F1F] px-4 py-3 text-white placeholder:text-[#804040] placeholder:text-[11px] focus:outline-none"
              />
            </div>

            <div className="flex flex-col items-start w-full">
              <label className="text-white text-xs mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="w-full rounded-full border border-[#FF0F0F] bg-[#501F1F] px-4 py-3 text-white placeholder:text-[#804040] placeholder:text-[11px] focus:outline-none"
              />
            </div>

            <div className="flex flex-col items-start w-full">
              <label className="text-white text-xs mb-1">Password</label>
              <input
                type="text"
                placeholder="Enter your code"
                className="w-full rounded-full border border-[#FF0F0F] bg-[#501F1F] px-4 py-3 text-white placeholder:text-[#804040] placeholder:text-[11px] focus:outline-none"
              />
            </div>
          </form>

          {/* Hint Box */}
          <div className="w-full border border-dashed border-[#F78000] rounded-[10px] p-3 mb-6">
            <p className="text-[9px] text-[#F78000] text-left">
              Hint: The day you almost killed me with work call and didn’t check
              on my mental health. It was a Wednesday we ended up talking for
              about 45 mins, you know what we talked about
            </p>
          </div>

          {/* Button */}
          <Link
            href={"/message/user/883838/view-message"}
            className="bg-white border transition-class border-white text-black font-medium rounded-full py-3 px-6 w-full md:w-auto hover:bg-transparent hover:text-white hover:border-white transition-colors text-sm md:text-base"
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
