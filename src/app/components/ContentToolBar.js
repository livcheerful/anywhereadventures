"use client";

import gsap from "gsap";
import { useEffect, useState, useRef } from "react";
import { getSettings } from "../lib/storageHelpers";
import { useNotifications } from "../lib/NotificationsContext";

export default function ContentToolBar({
  post,
  paneOpen,
  setPaneOpen,
  showingMenu,
  setShowingMenu,
  setShowLoadingTransition,
}) {
  const menuAnimRef = useRef();
  const [focusOnMapSwitcher, setFocusOnMapSwitcher] = useState(false);
  const [reduceAnims, setReduceAnims] = useState(false);
  const { notifications } = useNotifications(); // <-- use context

  return (
    <div
      className="md:w-limiter rounded-t-lg relative text-xs font-bold flex flex-row gap-2 border-t-gray-800 border-t-2 dark:text-black"
      onClick={() => setPaneOpen(true)}
    >
      <div className="h-2 p-2 w-full rounded-t-lg"></div>

      <div className="absolute w-full gap-2 h-10 left-0 flex flex-row justify-between pl-2 items-stretch cursor-default">
        <div className="w-3/4 gap-2 flex flex-row">
          <button
            aria-label="Open Menu"
            onClick={() => setShowingMenu(!showingMenu)}
            className="p-2 bg-lime-200 active:bg-lime-300 text-black flex flex-col items-stretch justify-center overflow-clip border-b-2 border-l-2 border-r-2 border-gray-800 rounded-b-xl text-center text-xs drop-shadow-2xl fill-black"
          >
            <svg
              className="w-5 h-5 fill-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z" />
            </svg>
          </button>

          {!showingMenu && (
            <a
              className="relative w-1/2 pb-1 flex flex-col justify-end items-center text-green-100 bg-green-800 active:bg-green-900 border-2 border-t-0 border-gray-800 rounded-b-2xl text-center"
              href="/journal"
              onClick={(e) => {
                e.stopPropagation();
                setShowLoadingTransition(true);
              }}
            >
              <div className="overflow-clip">
                <div style={{ fontSize: "30px" }}>📒</div>
                <div style={{ fontSize: "8px" }}>TRAVEL LOG</div>
              </div>

              {notifications.length > 0 && (
                <div className="bg-red-600 border-2 drop-shadow-lg border-gray-800 text-white font-bold absolute -right-2 -bottom-2 rounded-full w-6 h-6 flex items-center justify-center">
                  {notifications.length}
                </div>
              )}
            </a>
          )}
        </div>

        {paneOpen && !showingMenu && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setPaneOpen(false);
            }}
            style={{ alignSelf: "end" }}
            className="bg-white/80 w-8 h-8 p-2 flex items-center justify-center text-black border-gray-900 mt-1 mr-1 rounded-full z-20"
          >
            <img src="/x.svg" alt="Close" />
          </button>
        )}
      </div>

      <div
        className={`absolute -top-10 left-0 w-full bg-white h-10 flex flex-col justify-center pointer-events-none ${
          focusOnMapSwitcher ? "opacity-100" : "opacity-0"
        }`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (focusOnMapSwitcher && e.code === "Enter") {
            setPaneOpen(!paneOpen);
          }
        }}
        onFocus={() => setFocusOnMapSwitcher(true)}
        onBlur={() => setFocusOnMapSwitcher(false)}
      >
        <div className="w-full text-center font-mono">
          {paneOpen ? "Open my map" : "Open reading pane"}
        </div>
      </div>
    </div>
  );
}
