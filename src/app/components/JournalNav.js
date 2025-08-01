"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { getAllLCItems } from "../lib/storageHelpers";
import LOCItem from "./mdx/LOCItem";

export default function JournalNav({
  showToc,
  setShowToc,
  showSavedItems,
  setShowSavedItems,
}) {
  const [savedLcItems, setSavedLcItems] = useState(undefined);
  const menuAnimTl = useRef();
  const savedItemsRef = useRef();
  const savedItemsAnim = useRef();

  useEffect(() => {
    const allItemsObj = getAllLCItems();
    const asArray = Object.keys(allItemsObj).map((k) => {
      return allItemsObj[k];
    });
    setSavedLcItems(asArray);

    const tl = gsap.timeline({ paused: true });

    tl.to(
      "#line1",
      {
        y: 15,
        rotate: 45,
        transformOrigin: "50% 50%",
        duration: 0.3,
      },
      0
    );

    tl.to(
      "#line3",
      {
        y: -15,
        x: 0,
        rotate: -45,
        transformOrigin: "50% 50%",
        duration: 0.3,
      },
      0
    );

    tl.to(
      "#line2",
      {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "50% 50%",
        duration: 0.3,
      },
      0
    );
    menuAnimTl.current = tl;

    if (!savedItemsRef.current) return;
    savedItemsAnim.current = gsap.timeline({ paused: true });

    savedItemsAnim.current.fromTo(
      savedItemsRef.current,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.4,
        ease: "power2.out",
        onReverseComplete: () => {
          savedItemsRef.current.style.visibility = "hidden";
        },
        onStart: () => {
          savedItemsRef.current.style.visibility = "visible";
        },
      }
    );
  }, []);

  useEffect(() => {
    showMenuAnim(showToc);
  }, [showToc]);

  useEffect(() => {
    if (!savedItemsAnim.current) return;
    if (showSavedItems) {
      savedItemsAnim.current.play();
    } else {
      savedItemsAnim.current.reverse();
    }
  }, [showSavedItems]);

  function showMenuAnim(shouldShow) {
    const tl = menuAnimTl.current;
    shouldShow ? tl.play() : tl.reverse();
  }

  return (
    <div className="absolute bottom-0 h-14 overflow-clip z-10 w-full md:w-limiter">
      <div className="absolute bottom-0 flex flex-row justify-between gap-20 pr-5 p-2 w-full md:w-limiter h-10 bg-lime-200 border-t-black border-2 z-10">
        <a className="grow" href="/">
          <div className="text-sm font-black text-gray-800 underline">
            BACK TO MAP
          </div>
        </a>
        <button
          onClick={() => {
            setShowSavedItems(!showSavedItems);
            setShowToc(false);
          }}
          className="text-sm font-black text-gray-800"
        >
          <div className="underline">SAVED ITEMS</div>
        </button>
        <button
          onClick={(e) => {
            setShowToc(!showToc);
            setShowSavedItems(false);
          }}
          className="absolute flex flex-col items-center z-40 w-16 h-16 border-2 border-black drop-shadow-sm -bottom-3 rounded-full bg-teal-400 left-1/2 -translate-x-1/2"
        >
          <svg viewBox="0 0 100 100" id="menu-icon" className="fill-white">
            <rect
              className="line"
              id="line1"
              x="20"
              y="30"
              width="60"
              height="8"
              rx="5"
            />
            <rect
              className="line"
              id="line2"
              x="20"
              y="45"
              width="60"
              height="8"
              rx="5"
            />
            <rect
              className="line"
              id="line3"
              x="20"
              y="60"
              width="60"
              height="8"
              rx="5"
            />
          </svg>
        </button>
      </div>

      <div
        className="fixed bg-white bottom-10 w-full md:w-limiter left-0 z-0"
        ref={savedItemsRef}
        style={{ visibility: "hidden" }}
      >
        <div className="sticky text-xs font-bold p-1 px-2 border-y-2 border-black flex flex-row justify-between bg-lime-200 w-full">
          <div>SAVED ITEMS</div>
          <button
            className="w-4 h-4"
            onClick={() => {
              setShowSavedItems(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
            </svg>
          </button>
        </div>
        <div className="flex flex-row w-full h-72 overflow-y-clip overflow-x-auto snap-x snap-mandatory ">
          {savedLcItems?.map((item, i) => {
            return (
              <div
                className="h-full w-fit p-2 shrink-0 grow snap-start"
                key={i}
              >
                <div className="relative w-fit h-full">
                  <div className="absolute w-full justify-between flex flex-row gap-2 px-1">
                    <a
                      className="flex flex-col items-center justify-center   decoration-black bg-lime-300 font-mono text-xs font-bold text-black p-1 border-2 border-gray-900 drop-shadow-sm rounded-b-lg"
                      href={`/${item.fromSlug}`}
                    >
                      <div>back to story</div>
                    </a>
                    <a
                      className="flex flex-col items-center justify-center  underline decoration-white bg-emerald-700 font-mono text-xs font-bold text-white p-1 border-2 border-gray-900 drop-shadow-sm rounded-b-lg"
                      href={item.link}
                    >
                      <div>source</div>
                    </a>
                  </div>
                  <img src={item.image} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
