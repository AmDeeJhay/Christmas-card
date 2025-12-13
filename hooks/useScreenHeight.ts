"use client";
import { useEffect } from "react";

const useAppHeight = (): void => {
  useEffect(() => {
    const setAppHeight = (): void => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);

    return () => {
      window.removeEventListener("resize", setAppHeight);
    };
  }, []);
};

export default useAppHeight;
