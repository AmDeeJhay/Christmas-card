"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageTransition from "@/components/framer-motion/page-transition";

export default function SignInPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const slug = params?.id;

  // Immediately redirect to the message view (signin removed)
  useEffect(() => {
    if (!slug) return;
    // Directly open the text view for the message
    router.push(`/message/${slug}/text`);
  }, [slug, router]);

  return (
    <PageTransition>
      <div className="relative h-full flex items-center justify-center">
        <div className="text-white">Opening message…</div>
      </div>
    </PageTransition>
  );
}
