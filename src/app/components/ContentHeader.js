"use client";
import { useEffect, useState, useRef } from "react";
import { Map, Marker } from "maplibre-gl";
import { registerNewIO } from "../lib/intersectionObserverHelper";
import { useRouter } from "next/navigation";
import {
  add as addToStorage,
  getAllSlugs,
  remove as removeFromStorage,
} from "../lib/storageHelpers";
import { unvisitedMapColor } from "../lib/constants";
import { gsap } from "gsap";
import { makeNewMarker } from "./Map";
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
      className="-top-1  bg-white z-30 dark:text-black"
    >
      <div
        className={`flex flex-row gap-2 pt-16 pb-4 p-2 `}
        style={{
          backgroundSize: "cover",
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)), url('${post.cardImage}')`,
        }}
      >
        <div className="flex flex-col gap-3 pt-4">
          <div className=" font-bold text-2xl">{post?.title}</div>
        </div>

        {/* <div
          className={`${
            isAdded
              ? "font-normal bg-white text-slate-400 border-slate-200 border-2"
              : " font-semibold"
          } active my-3 p-1 rounded-xl text-center cursor-pointer `}
          style={{
            background: isAdded
              ? "#ffffff"
              : " linear-gradient( var(--degree2),     var(--color2),     var(--color)   )",
          }}
          onClick={() => {
            if (!isAdded) {
              addToStorage(post.slug, post);
              setMyLocationSlugs(getAllSlugs());
            } else {
              removeFromStorage(post.slug);
              setMyLocationSlugs(getAllSlugs());
            }

            setPaneOpen(false);
            zoomToMainMap(post.latlon, post.zoom, !isAdded);
          }}
        >
          {isAdded ? "Remove" : "Add to my map"}
        </div>

        <div
          className="p-1 my-3 rounded-xl font-semibold text-center bg-slate-200 cursor-pointer"
          onClick={() => {
            router.replace(
              `/camera?locationId=${post.slug}&refSlug=${currentSlug}&type=${
                post.cameraType || "kodak"
              }&frame=${post.frameImage}&place=${post.imagePlacement}&size=${
                post.imageDimensions
              }`
            );
          }}
        >
          LOG VISIT
        </div> */}
      </div>
    </div>
  );
}
