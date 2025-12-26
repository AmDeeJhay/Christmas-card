"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PageTransition from "@/components/framer-motion/page-transition";
import OpenMessageButton from "@/components/OpenMessageButton";
import EnvelopeSequence from "@/components/framer-motion/envelope-reveal";

export default function Page() {
  const hookParams = useParams() as { user_id?: string } | undefined;
  const slug = hookParams?.user_id;

  const [opened, setOpened] = useState(false);
  const [messageData, setMessageData] = useState<any>(null);

  console.log('Message page rendered, slug=', slug, 'opened=', opened);

  // Check if message was already opened and cached
  useEffect(() => {
    if (slug) {
      try {
        const cached = localStorage.getItem(`message:${slug}`);
        if (cached) {
          const data = JSON.parse(cached);
          console.log('Found cached message:', data);
          setMessageData(data);
          // Optionally auto-open if cached
          // setOpened(true);
        }
      } catch (e) {
        console.warn('Could not load cached message', e);
      }
    }
  }, [slug]);

  const handleOpenMessage = (data: any) => {
    console.log('onOpen callback received data:', data);
    setMessageData(data);
    setOpened(true);
  };

  // Extract message text from various possible fields
  const messageText = messageData?.text || messageData?.message || "";
  const recipientName = messageData?.recipientFirstName 
    ? `${messageData.recipientFirstName} ${messageData.recipientLastName || ''}`.trim()
    : null;

  return (
    <PageTransition>
      <div className="relative h-full flex flex-col items-center justify-start overflow-hidden">
        {/* Background snow pattern */}
        <div className="absolute inset-0 z-10">
          <Image
            src="/images/snow-flakes.svg"
            alt="snow background"
            fill
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
            {opened 
              ? recipientName 
                ? `Dear ${recipientName}!` 
                : 'Your Message' 
              : 'You\'ve Got a Message!'}
          </h1>
          
          {!opened && (
            <>
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
              <OpenMessageButton
                slug={slug}
                onOpen={handleOpenMessage}
              />
            </>
          )}

          {opened && messageData && (
            <div className="w-full">
              {messageData.type === "video" && messageData.videoUrl ? (
                <div className="mb-6">
                  <video 
                    controls 
                    className="w-full max-w-2xl rounded-lg"
                    src={messageData.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <EnvelopeSequence message={messageText} />
              )}
            </div>
          )}

          {opened && !messageData && (
            <div className="text-white">
              <p>Loading message...</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-6 justify-self-end mt-auto text-sm text-[#FFFFFF] z-10">
          powered by Applift
        </footer>
      </div>
    </PageTransition>
  );
}