"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getSettings } from "../lib/storageHelpers";

export default function Toast({ message }) {
  const toastRef = useRef();

  useEffect(() => {
    const reduceAnims = getSettings().reduceAnims;
    if (reduceAnims) {
      toastRef.current.style.opacity = 1;
      toastRef.current.style.transform = "translateY(0%)";
    } else {
      gsap.fromTo(
        toastRef.current,
        { yPercent: 100, opacity: 0.2 },
        { yPercent: 0, duration: 0.4, opacity: 1 }
      );
    }
  }, []);
  return (
    <div
      ref={toastRef}
      className="fixed z-[100] text-white drop-shadow-2xl text-xs font-bold p-4 bottom-4 bg-emerald-700 rounded-lg"
    >
      {message}
    </div>
  );
}
