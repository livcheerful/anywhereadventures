"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Toast({ message }) {
  const toastRef = useRef();
  useEffect(() => {
    gsap.fromTo(
      toastRef.current,
      { opacity: 0 },
      { duration: 0.4, opacity: 1 }
    );
  }, []);
  return (
    <div
      ref={toastRef}
      className="fixed text-white drop-shadow-2xl text-xs font-bold p-4 bottom-4 bg-lime-600 rounded-lg"
    >
      {message}
    </div>
  );
}
