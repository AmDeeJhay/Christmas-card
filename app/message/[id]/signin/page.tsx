"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageTransition from "@/components/framer-motion/page-transition";
import { openMessage } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const slug = params?.id;

  // Immediately fetch/open the message and redirect to the message view
  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    try {
      console.log('Opening message for slug:', slug, 'with name:', name, 'lastName:', lastName, 'password:', password);
      const messageData = await openMessage(slug, name, lastName, password);
      console.log('openMessage response:', messageData);
      localStorage.setItem(`message:${slug}`, JSON.stringify(messageData));
      localStorage.setItem(`messageText:${slug}`, messageData.text || '');
      localStorage.setItem(`messageVideo:${slug}`, messageData.video_url || '');
      if (!messageData.video_url) {
        router.push(`/message/${slug}/text`);
      } else {
        router.push(`/message/${slug}/recording`);
      }
    } catch (error) {
      console.error('openMessage error:', error);
      alert("Message not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative h-full flex items-center justify-center">
        <div className="text-white">Opening message…</div>
      </div>
    </PageTransition>
  );
}
