import type { Metadata } from "next";
import React from "react";

interface LayoutProps {
  params: { username: string;};
}
const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN || "https://digitalxmas-card.vercel.app";

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { username } = params;

  return {
    title: `🎄 A Christmas wish!`,
    description: `A special holiday message for ${username}. Click to open your card.`,
    openGraph: {
      title: `🎄 You’ve received a Christmas wish!`,
      description: `A heartfelt holiday message for ${username}.`,
      url: `${DOMAIN}/message/${username}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `🎄 You’ve received a Christmas wish!`,
      description: `A heartfelt holiday message for ${username}.`,
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
