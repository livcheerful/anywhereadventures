"use client";
import { useEffect, useState, useRef } from "react";
import { registerNewIO } from "../lib/intersectionObserverHelper";
import { useRouter } from "next/navigation";
import { hasLocationBeenVisited } from "../lib/storageHelpers";
import { gsap } from "gsap";
export default function StickyHeader({
  post,
  contentSlug,
  mainMap,
  setPaneOpen,
  isAdded = false,
}) {
  const router = useRouter();
  const io = useRef();
  const startY = useRef();

  function kickOffAnimations() {
    if (!isAdded) {
      // Grab the active button
      function randomHaze() {
        let deg = gsap.utils.random(25, 115);
        let deg2 = gsap.utils.random(218, 320);
      }
      randomHaze();
    }
  }

  useEffect(() => {
    kickOffAnimations();
  }, []);

  useEffect(() => {
    if (!contentSlug) return;
    if (io.current) return; // Already had an observor registered. Go away!
    const headerElem = document.getElementById(`header-${contentSlug}`);
    const pane = document.getElementById("content-pane");
    io.current = registerNewIO([headerElem], undefined, (e) => {});
  }, [contentSlug]);

  return (
    <div
      id={`header-${contentSlug}`}
      className="sticky top-0 bg-white z-30 dark:text-black "
      onTouchStart={(e) => {
        startY.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY.current;
        console.log("DeltaY");
        if (deltaY > 30) {
          setPaneOpen(false);
        }
        if (deltaY < -30) {
          setPaneOpen(true);
        }
      }}
    >
      <div
        className={`flex flex-row gap-2 pt-9 pb-2  w-full items-center`}
        style={{
          backgroundSize: "cover",
          backgroundImage: `linear-gradient(
  to bottom,
  rgba(255, 255, 255, 0) 0%,
  rgba(255, 255, 255, 1) 40%
), url('${post.cardImage}')`,
        }}
      >
        <div className="flex flex-col pt-3 md:pt-6 w-full">
          <div className="flex flex-row justify-between items-baseline px-2">
            <div className="font-mono font-black text-lg italic">
              {post.locationTitle}
            </div>
            <div className="font-mono text-xs text-gray-700 flex flex-row gap-2 items-baseline">
              {hasLocationBeenVisited(post.slug) ? "VISITED" : "UNVISITED"}
            </div>
          </div>
          <hr className="border-black w-full "></hr>
        </div>
      </div>
    </div>
  );
}
