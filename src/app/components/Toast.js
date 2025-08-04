"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Toast({ message }) {
  const toastRef = useRef();
  useEffect(() => {
    gsap.fromTo(
      toastRef.current,
      { yPercent: 100, opacity: 0.2 },
      { yPercent: 0, duration: 0.4, opacity: 1 }
    );
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
