"use client";
import { useEffect, useState, useRef } from "react";
import { registerNewIO } from "../lib/intersectionObserverHelper";
import { useRouter } from "next/navigation";
import { hasLocationBeenVisited } from "../lib/storageHelpers";
import { gsap } from "gsap";
export default function StickyHeader({
  post,
  currentSlug,
  contentSlug,
  focusOnPin,
  isAdded = false,
}) {
  const router = useRouter();
  const io = useRef();

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
      className="sticky -top-1 bg-white z-30 dark:text-black "
    >
      <div
        className={`flex flex-row gap-2 pt-12 pb-2 p-2 w-full items-center`}
        style={{
          backgroundSize: "cover",
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)), url('${post.cardImage}')`,
        }}
      >
        <div className="absolute w-full left-0 top-0 flex items-center justify-center">
          <button
            className="border-2 border-gray-800 w-4/5 font-bold text-black py-1 px-6  bg-lime-200  rounded-b-2xl drop-shadow-2xl cursor-pointer text-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              focusOnPin(post.slug, post);
            }}
          >
            Open in Map
          </button>
        </div>
        <div className="flex flex-col gap-2 pt-6 w-full">
          <div className="flex flex-row justify-between items-end">
            <div className="font-mono font-black px-2 text-lg">
              {post.locationTitle}
            </div>
            <div className="font-mono text-xs text-gray-700">
              {hasLocationBeenVisited(post.slug) ? "VISITED" : "UNVISITED"}
            </div>
          </div>
          <hr className="border-black w-full "></hr>
          <div className="font-mono text-xs flex flex-row justify-between px-2 text-gray-700 ">
            <div>{post.neighborhood}</div>
            <div>{`${post.latlon[0].toFixed(4)}, ${post.latlon[1].toFixed(
              4
            )}`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
