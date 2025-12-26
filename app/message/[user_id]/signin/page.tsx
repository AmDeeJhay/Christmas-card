"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageTransition from "@/components/framer-motion/page-transition";
import { openMessage } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();
  const params = useParams() as { user_id?: string };
  const slug = params?.user_id;

  // Immediately fetch/open the message and redirect to the message view
  useEffect(() => {
    if (!slug) return;

    let mounted = true;
    (async () => {
      try {
        const messageData = await openMessage(slug);
        console.log('openMessage response for', slug, messageData);
        try { localStorage.setItem(`message:${slug}`, JSON.stringify(messageData)); } catch (e) { }
        if (!mounted) return;
        router.push('/message');
      } catch (e) {
        alert('Message not found');
      }
    })();

    return () => { mounted = false };
  }, [slug, router]);

  return (
    <PageTransition>
      <div className="relative h-full flex items-center justify-center">
        <div className="text-white">Opening message…</div>
      </div>
    </PageTransition>
  );
}
