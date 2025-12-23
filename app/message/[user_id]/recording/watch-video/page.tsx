"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Pause, Reply } from "lucide-react";
import { PlayIcon } from "@/components/svgs";

function WatchVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulate video duration (in seconds)
  const videoDuration = 30; // 30 seconds
  const progressStep = 100 / videoDuration; // Percentage per second

  const handlePlayClick = () => {
    setIsPlaying(true);
    setIsComplete(false);
    startProgress();
  };

  const handlePauseClick = () => {
    setIsPlaying(false);
    stopProgress();
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setIsComplete(false);
    stopProgress();
  };

  const handleReplyClick = () => {
    // Handle reply functionality here
    console.log("Reply to message clicked");
    // You could navigate to a reply page, open a modal, etc.
  };

  const startProgress = () => {
    stopProgress(); // Clear any existing interval

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          stopProgress();
          setIsPlaying(false);
          setIsComplete(true);
          return 100;
        }
        return prev + progressStep;
      });
    }, 1000); // Update every second
  };

  const stopProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => stopProgress();
  }, []);

  // Handle completion when progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && isPlaying) {
      setIsPlaying(false);
      setIsComplete(true);
      stopProgress();
    }
  }, [progress, isPlaying]);

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Main image container */}
      <div className="relative">
        {/* Border/Frame image */}
        <div className="absolute inset-0 z-10">
          <Image
            src="/images/border-xmas-tree.png"
            width={500}
            height={500}
            alt="christmas card"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Video placeholder image */}
        <div className="relative z-0">
          <Image
            src="/images/video-placeholder.png"
            width={500}
            height={500}
            alt="video recording"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-2 bg-gray-800/50 overflow-hidden rounded-b-lg">
          <div
            className="h-full bg-red-500 transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Initial overlay - shown when video hasn't started */}
        {!isPlaying && progress === 0 && !isComplete && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
            {/* Semi-transparent backdrop */}
            <div className="absolute inset-0 bg-black/60 rounded-lg"></div>

            {/* Content */}
            <div className="relative z-30 mt-10">
              <div className="mb-4 flex justify-center">
                <button onClick={handlePlayClick} aria-label="Play video">
                  <PlayIcon />
                </button>
              </div>

              <h1 className="text-xl md:text-2xl text-[#FFC758] font-bold mb-5">
                Tap play and enjoy your <br /> holiday message
              </h1>
              <p className="text-xs md:text-base opacity-90">
                Sent with love, laughter, and a bit of <br /> Christmas magic.
              </p>
            </div>
          </div>
        )}

        {/* Paused overlay - shown when video is paused but not complete */}
        {!isPlaying && progress > 0 && progress < 100 && !isComplete && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
            {/* Semi-transparent backdrop */}
            <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>

            {/* Content */}
            <div className="relative z-30">
              <div className="mb-4 flex flex-col items-center space-y-4">
                <button onClick={handlePlayClick} aria-label="Resume video">
                  <PlayIcon />
                </button>
                <button
                  onClick={handleReset}
                  className="text-sm px-3 py-1 bg-gray-800/70 hover:bg-gray-700/70 rounded"
                  aria-label="Replay video"
                >
                  Replay
                </button>
              </div>

              <h1 className="text-xl md:text-2xl font-bold mb-2">
                Video Paused
              </h1>
              <p className="text-sm md:text-base opacity-90">
                Click play to continue
              </p>
              <div className="mt-2 text-sm">
                Progress: {Math.round(progress)}%
              </div>
            </div>
          </div>
        )}

        {/* Completion overlay - shown when video is complete */}
        {isComplete && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
            {/* Festive gradient backdrop */}
            <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>

            {/* Content */}
            <div className="relative z-30 mt-32">
              <div className="mb-6">
                <div className="flex items-center justify-center">
                  <Image
                    src="/images/candy-cane.png"
                    width={170}
                    height={170}
                    alt="candy cane"
                  />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-3 text-[#FFC758]">
                  Message Complete!
                </h1>
                <p className="text-gray-300 text-xs opacity-95 mb-6">
                  Hope this brought a smile to your heart. Your Christmas
                  message is now saved and can be watched anytime.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleReplyClick}
                  className="px-6 py-2 bg-white text-black rounded-full flex items-center justify-center space-x-2 transition-all hover:scale-105"
                  aria-label="Reply to message"
                >
                  <span className="font-medium text-xs">Reply to Message</span>
                </button>
                <button
                  onClick={handleReplyClick}
                  className="px-6 py-2 bg-transparent text-white rounded-full flex border border-white items-center justify-center space-x-2 transition-all hover:scale-105"
                  aria-label="Reply to message"
                >
                  <span className="font-medium text-xs">Save / Download</span>
                </button>
              </div>

              <p className="mt-6 text-xs opacity-80">Back to Home</p>
            </div>
          </div>
        )}

        {/* Pause button overlay - shown only when playing */}
        {isPlaying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <button
              onClick={handlePauseClick}
              className="p-4 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label="Pause video"
            >
              <Pause className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchVideo;
