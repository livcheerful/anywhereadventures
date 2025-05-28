"use client";
import { useEffect, useState, useRef } from "react";
import { registerNewIO } from "../lib/intersectionObserverHelper";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
export default function ContentHeader({
  post,
  currentSlug,
  contentSlug,
  zoomToMainMap,
  setMyLocationSlugs,
  setPaneOpen,
  k = 0,
  isAdded = false,
  scrollRef,
}) {
  const router = useRouter();
  const io = useRef();

  const [largeState, setLargeState] = useState(true);

  function kickOffAnimations() {
    if (!isAdded) {
      // Grab the active button
      function randomHaze() {
        let deg = gsap.utils.random(25, 115);
        let deg2 = gsap.utils.random(218, 320);
        // gsap.to(".active", {
        //   duration: 1,
        //   "--degree": `${deg}deg`,
        //   "--degree2": `${deg2}deg`,
        //   "--color":
        //     "rgb(random(0,155,100), random(1,255,0), random(155,0,1), 0.5)",
        //   "--color2":
        //     "rgb(random(0,155,100), random(1,255,0), random(155,0,1), 0.56)",
        //   ease: "none",
        //   yoyo: true,
        //   onComplete: randomHaze,
        // });
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
    io.current = registerNewIO([headerElem], undefined, (e) => {
      if (e[0].isIntersecting) {
        setLargeState(true);
      } else {
        setLargeState(false);
      }
    });
  }, [contentSlug]);

  return (
    <div
      id={`header-${contentSlug}`}
      className="sticky -top-1  bg-white z-30 dark:text-black"
    >
      <div
        className={`flex flex-row gap-2 pt-16 pb-4 p-2 w-full items-center`}
        style={{
          backgroundSize: "cover",
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)), url('${post.cardImage}')`,
        }}
      >
        <div className="absolute w-full left-0 top-0 flex items-center justify-center">
          <button
            className="border-2 border-gray-800 w-4/5 font-bold text-black py-2 px-6  bg-emerald-200  rounded-b-2xl drop-shadow-2xl cursor-pointer text-center"
            onClick={() => {
              setPaneOpen(false);
              zoomToMainMap(
                [post.latlon[1], post.latlon[0]],
                post.zoom,
                !isAdded
              );
            }}
          >
            Open in Map
          </button>
        </div>
        <div className="flex flex-col gap-3 pt-4 w-full">
          <h2 className=" font-bold text-2xl">{post?.title}</h2>
        </div>
      </div>
    </div>
  );
}
