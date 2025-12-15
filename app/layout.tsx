"use client";

import "./globals.css";
import React from "react";
import Head from "next/head";
import useAppHeight from "../hooks/useScreenHeight";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAppHeight();

  return (
    <html lang="en">
      <Head>
        <title>Holigram - for Christmas</title>
        <meta
          name="description"
          content="Create and share small Christmas video cards, contents of joy and love"
        />
        <meta property="og:title" content="Holigram - for Christmas" />
        <meta
          property="og:description"
          content="Create and share small Christmas video cards, contents of joy and love"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />{" "}
        {/* optional social preview */}
      </Head>
      <body className="bg-linear-to-b from-slate-900 via-slate-700 to-slate-900 text-slate-100 min-h-screen">
        <div className="app">{children}</div>
      </body>
    </html>
  );
}
