"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { createTextMessage, createVideoMessage } from "../../../../lib/api";
import MagicLinkModal from "../../../../components/MagicLinkModal";
import Toast from "../../../../components/Toast";
import ErrorBoundary from "../../../../components/ErrorBoundary";

const MessagePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const [mode, setMode] = useState<"text" | "video">("text");
  const [message, setMessage] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [theme, setTheme] = useState<"crimson" | "evergreen" | "midnight">(
    "crimson"
  );

  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type?: any } | null>(null);

  // Load stored data from previous steps
  const [recipientData, setRecipientData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  // Legacy security data removed from flow; not used anymore

  useEffect(() => {
    // Load recipient data from localStorage
    try {
      const encryptionData = localStorage.getItem("cardEncryption") || sessionStorage.getItem("cardEncryption");
      if (encryptionData) {
        const parsed = JSON.parse(encryptionData);
        setRecipientData(parsed);
        console.log("Loaded recipient data:", parsed);
      } else {
        console.warn("No recipient data found in storage");
      }

      // Clear any stored legacy security data
      try {
        localStorage.removeItem("cardSecurity");
        sessionStorage.removeItem("cardSecurity");
      } catch (e) {
        console.warn("Could not clear legacy cardSecurity", e);
      }
    } catch (e) {
      console.error("Error loading stored data:", e);
    }
  }, []);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const handleSubmit = async () => {
    if (submitting) return;

    // Validate that we have recipient data
    if (!recipientData) {
      setToast({
        msg: 'Recipient information is missing. Please go back and fill it in.',
        type: 'error'
      });
      return;
    }

    setSubmitting(true);

    const payload = {
      mode,
      message,
      theme,
      videoFileName: videoFile?.name || null,
    };

    // save locally as a backup (session only)
    try {
      sessionStorage.setItem("cardMessage", JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not persist message info", e);
    }

    try {
      // Get or create senderId using UUID
      let senderId = localStorage.getItem("userId");
      if (!senderId) {
        // Generate UUID v4
        senderId = crypto.randomUUID();
        localStorage.setItem("userId", senderId);
        console.log("Created new senderId:", senderId);
      }

      if (mode === "text") {
        const data = {
          recipientFirstName: recipientData.firstName,
          recipientLastName: recipientData.lastName,
          text: message,
          theme,
          senderId: senderId,
        };

        console.log("Submitting text message:", data);
        const res = await createTextMessage(data);
        console.log("Text message created:", res);

        if (res?.slug) {
          try {
            sessionStorage.setItem("cardSlug", res.slug);
          } catch { }
          // Navigate to overview where the shareable link is shown
          router.push("/create/overview");
        }
      } else {
        if (!videoFile) {
          setToast({ msg: 'No video file selected', type: 'error' });
          setSubmitting(false);
          return;
        }

        const data = {
          recipientFirstName: recipientData.firstName,
          recipientLastName: recipientData.lastName,
          theme,
          file: videoFile,
          senderId: senderId,
        };

        console.log("Submitting video message");
        const res = await createVideoMessage(data);
        console.log("Video message created:", res);

        if (res?.slug) {
          try {
            sessionStorage.setItem("cardSlug", res.slug);
          } catch { }
          router.push("/create/overview");
        }
      }
    } catch (err: any) {
      console.error("Create message failed", err);

      const status = err?.response?.status;
      const isNetworkError = err?.message === 'Network Error' || !err?.response;

      if (status === 401) {
        setShowAuthModal(true);
        setToast({ msg: 'Authentication required. Please sign in.', type: 'error' });
      } else if (status === 502 || isNetworkError) {
        setToast({ msg: 'Server unavailable. Please try clicking submit again.', type: 'error' });
      } else if (status === 400) {
        setToast({ msg: err?.response?.data?.message || 'Invalid data. Please check all fields.', type: 'error' });
      } else {
        // Show the actual error message from the server if available
        const errorMsg = err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';
        setToast({ msg: errorMsg, type: 'error' });
      }

      // Crucial: Set submitting to false so the button becomes clickable again
      setSubmitting(false);
    }
  };

  const isValid = mode === 'text' ? message.trim().length > 0 : !!videoFile

  const ThemeButton = ({
    label,
    icon,
    active,
    onClick,
    iconSize = 32,
  }: {
    label: string;
    icon: string;
    active: boolean;
    onClick: () => void;
    iconSize?: number;
  }) => {
    const [pressed, setPressed] = React.useState(false)

    const baseInset = active ? 'inset 0 8px 18px rgba(0,0,0,0.6)' : 'inset 0 0 0 rgba(0,0,0,0)'
    const outerGlow = active ? '0 0 12px rgba(220,38,38,0.12)' : '0 0 0 rgba(0,0,0,0)'
    const pressedInset = pressed ? 'inset 0 14px 26px rgba(0,0,0,0.75)' : baseInset
    const boxShadow = `${pressedInset}, ${outerGlow}`

    const key = label.toLowerCase().includes('crimson')
      ? 'crimson'
      : label.toLowerCase().includes('evergreen')
        ? 'evergreen'
        : 'midnight'

    const borderByKey: Record<string, string> = {
      crimson: '#C40909',
      evergreen: '#00B83D',
      midnight: '#6C6C6C',
    }

    const bgByKeyStyle: Record<string, string | undefined> = {
      crimson: '#4C0000',
      evergreen: '#004700',
      midnight: '#000000',
    }

    const borderColor = borderByKey[key] || '#ffffff'
    const bgColor = bgByKeyStyle[key]

    return (
      <div className="flex flex-col items-center">
        <button
          onClick={onClick}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          aria-pressed={active}
          className={`relative flex items-center justify-center w-24 h-24 rounded-xl border transition-transform duration-150`}
          style={{ boxShadow, transition: 'box-shadow 180ms ease, transform 120ms', borderColor, background: bgColor }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <span
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: 28,
                height: 28,
                background: 'rgba(255, 255, 255, 0.87)',
                filter: 'blur(20px)',
                transform: pressed ? 'scale(1.18)' : 'scale(1)',
                transition: 'transform 140ms ease, opacity 140ms ease',
                zIndex: 0,
              }}
            />
            <img src={icon} alt="" className="relative z-10 object-contain" style={{ width: iconSize, height: iconSize, filter: 'brightness(1.25)', transition: 'filter 140ms ease' }} />
          </div>
        </button>
        <span className={`text-[10px] text-center whitespace-nowrap mt-2 max-w-[88px] text-white`}>{label}</span>
      </div>
    )
  }

  return (
    <div className="min-h-full w-screen bg-gradient-to-b relative overflow-hidden flex flex-col">
      <div className="w-full relative h-32 flex-shrink-0">
        <img
          src="/images/Garland.svg"
          alt="Garland"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col items-center px-6 z-10">
        {/* Show recipient info if loaded */}
        {/* {recipientData && (
          <div className="w-full bg-green-900/30 border border-green-600 rounded-lg px-4 py-2 mt-4">
            <p className="text-green-400 text-xs">
              To: {recipientData.firstName} {recipientData.lastName}
            </p>
          </div>
        )} */}

        {/* Warning if no recipient data */}
        {/* {!recipientData && (
          <div className="w-full bg-yellow-900/30 border border-yellow-600 rounded-lg px-4 py-2 mt-4">
            <p className="text-yellow-400 text-xs">
              ⚠️ No recipient data found. Please go back and fill in recipient information.
            </p>
          </div>
        )} */}

        <div
          className={`w-full rounded-2xl border-2 ${mode === "text"
            ? "border-[#FF0F0F]"
            : "border-dashed border-[#FF0F0F]"
            } bg-[#501F1F] p-4 mt-6`}
        >
          {mode === "text" ? (
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows={7}
              className="w-full bg-transparent text-white placeholder:text-red-300/50 text-sm focus:outline-none resize-none"
            />
          ) : (
            <label className="flex flex-col items-center justify-center gap-3 py-10 cursor-pointer">
              <Image src="/images/upload.svg" alt="Upload Icon" width={48} height={48} className="text-[#804040]" />
              <p className="text-xs text-[#804040] items-center text-center max-w-xs">
                {videoFile ? (
                  <span className="text-white font-medium">{videoFile.name}</span>
                ) : (
                  <>MP4, MOV, or WebM • Up <br /> to 2 minutes</>
                )}
              </p>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
              <span className="bg-[#FF0F0F] text-white px-6 py-2 rounded-full text-sm">
                {videoFile ? 'Change file' : 'Browse files'}
              </span>
            </label>
          )}
        </div>

        <div className="flex w-full bg-red-950/60 rounded-full p-1.5 mt-4">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 py-2 rounded-full text-sm transition ${mode === "text"
              ? "bg-red-700 text-white"
              : "text-red-300"
              }`}
          >
            Text
          </button>
          <button
            onClick={() => setMode("video")}
            className={`flex-1 py-2 rounded-full text-sm transition ${mode === "video"
              ? "bg-red-700 text-white"
              : "text-red-300"
              }`}
          >
            Video
          </button>
        </div>

        <div className="flex gap-4 mt-6">
          <ThemeButton
            label="Crimson Christmas"
            active={theme === "crimson"}
            icon="/images/santa-head.svg"
            onClick={() => setTheme("crimson")}
            iconSize={52}
          />
          <ThemeButton
            label="Evergreen Magic"
            active={theme === "evergreen"}
            icon="/images/snow-scooter.svg"
            onClick={() => setTheme("evergreen")}
            iconSize={52}
          />
          <ThemeButton
            label="Midnight Noel"
            active={theme === "midnight"}
            icon="/images/midnight-noel.svg"
            onClick={() => setTheme("midnight")}
            iconSize={48}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting || !recipientData}
          aria-disabled={!isValid || submitting || !recipientData}
          className={`w-full rounded-full py-4 mt-8 font-medium shadow-lg transition ${isValid && !submitting && recipientData ? 'bg-white text-gray-900 active:scale-95' : 'bg-white/30 text-gray-400 cursor-not-allowed'}`}
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>

      <footer className="text-center text-sm text-white/70 py-4">
        powered by Applift
      </footer>

      {toast && <Toast message={toast.msg} type={toast.type} />}
      <MagicLinkModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

const Wrapped = () => (
  <ErrorBoundary>
    <MessagePage />
  </ErrorBoundary>
);

export default Wrapped;