import { div } from "framer-motion/client";
import type { Metadata } from "next";
import React from "react";

interface LayoutProps {
  params: { username: string; cardId: string };
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { username, cardId } = params;

  return {
    title: `🎄 You’ve received a Christmas wish!`,
    description: `${username} has sent you a special holiday message. Click to open your card.`,
    openGraph: {
      title: `🎄 You’ve received a Christmas wish!`,
      description: `${username} has sent you a heartfelt holiday message.`,
      url: `https://app.com/message/${username}/${cardId}`,
      images: [
        {
          url: `https://app.com/api/og-image/${cardId}`, // dynamic preview image
          width: 1200,
          height: 630,
          alt: "Digital Christmas Card",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `🎄 You’ve received a Christmas wish!`,
      description: `${username} has sent you a heartfelt holiday message.`,
      images: [`https://app.com/api/og-image/${cardId}`],
    },
  };
}

export default function RootLayout({ children }:{children:React.ReactNode}) {
    return (
        <div className="w-full h-full">
            {children}
        </div>
    )
}
