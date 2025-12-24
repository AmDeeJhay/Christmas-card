"use client";

import "./globals.css";
import React from "react";
import Head from "next/head";
import useAppHeight from "../hooks/useScreenHeight";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://digitalxmas-card.vercel.app';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAppHeight();

  return (
    <html lang="en">
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Holigram - Create & Share Christmas Video Cards</title>
        <meta
          name="description"
          content="Create and share heartfelt Christmas video cards filled with joy and love. Send personalized holiday messages to your loved ones with Holigram."
        />
        <meta
          name="keywords"
          content="Christmas, video cards, holiday messages, share joy, love, personalized gifts, Holigram"
        />
        <meta name="author" content="Applift" />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`${DOMAIN}`}
        />{" "}
        {/* Set via NEXT_PUBLIC_DOMAIN env var */}
        {/* Open Graph Tags for Social Media Sharing */}
        <meta
          property="og:title"
          content="Holigram - Create & Share Christmas Video Cards"
        />
        <meta
          property="og:description"
          content="Create and share heartfelt Christmas video cards filled with joy and love. Send personalized holiday messages to your loved ones."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${DOMAIN}`}
        />{" "}
        {/* Set via NEXT_PUBLIC_DOMAIN env var */}
        <meta
          property="og:image"
          content={`${DOMAIN}/og-image.png`}
        />{" "}
        {/* Full URL for better sharing */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Holigram Christmas Video Cards"
        />
        <meta property="og:site_name" content="Holigram" />
        <meta property="og:locale" content="en_US" />
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@holigram" />{" "}
        {/* Replace with your Twitter handle */}
        <meta name="twitter:creator" content="@holigram" />
        <meta
          name="twitter:title"
          content="Holigram - Create & Share Christmas Video Cards"
        />
        <meta
          name="twitter:description"
          content="Create and share heartfelt Christmas video cards filled with joy and love."
        />
        <meta
          name="twitter:image"
          content={`${DOMAIN}/og-image.png`}
        />
        {/* Favicon and Icons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1e293b" />{" "}
        {/* Matches your background gradient start */}
        {/* Additional SEO and Performance */}
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Holigram",
              description:
                "Create and share Christmas video cards filled with joy and love.",
              url: DOMAIN,
              applicationCategory: "EntertainmentApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "Applift",
              },
            }),
          }}
        />
      </Head>
      <body className="bg-linear-to-b from-slate-900 via-slate-700 to-slate-900 text-slate-100 min-h-screen">
        <div className="app">{children}</div>
      </body>
    </html>
  );
}
