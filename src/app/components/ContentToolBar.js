"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function ContentToolBar({
  post,
  paneOpen,
  setPaneOpen,
  focusOnPin,
  showingMenu,
  setShowingMenu,
}) {
  const [focusOnMapSwitcher, setFocusOnMapSwitcher] = useState(false);
  return (
    <div
      className="md:w-limiter rounded-t-lg relative bg-lime-200 h-2 p-2 text-xs font-bold flex flex-row gap-2 border-t-gray-800 border-t-2  dark:text-black"
      onClick={() => {
        setPaneOpen(true);
      }}
    >
      {paneOpen && (
        <div className="absolute w-full gap-2 left-0 top-4 flex justify-start pl-2 items-stretch">
          <button
            onClick={(e) => {
              setShowingMenu(!showingMenu);
            }}
            className={`${
              paneOpen ? " bg-lime-200" : ""
            }  flex flex-col justify-center px-2 border-b-2 border-l-2 border-r-2 border-gray-800 rounded-b-2xl text-center text-sm`}
          >
            <div> Menu</div>
          </button>
          <a
            href="/journal"
            className={`${
              paneOpen ? " bg-lime-200" : ""
            }  flex flex-col justify-center px-2 border-b-2 border-l-2 border-r-2 border-gray-800 rounded-b-2xl text-center text-sm`}
          >
            <div>
              <div>Travel Log</div>
            </div>
          </a>

          <div className="flex flex-row justify-center gap-2 border-b-2 border-l-2 border-r-2 border-gray-800 w-3/5 font-bold text-black py-1 px-6  bg-lime-200  rounded-b-2xl drop-shadow-2xl cursor-pointer text-center text-sm">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPaneOpen(false);
              }}
            >
              🗺️
            </button>
            <div>|</div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                focusOnPin(post.slug, post);
              }}
            >
              Open in Map
            </button>
          </div>
        </div>
      )}
      <div
        className={`absolute -top-10 left-0 w-full bg-white h-10 flex flex-col justify-center pointer-events-none ${
          focusOnMapSwitcher ? "opacity-100" : "opacity-0"
        }`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (focusOnMapSwitcher) {
            if (e.code == "Enter") {
              setPaneOpen(!paneOpen);
            }
          }
        }}
        onFocus={(e) => {
          setFocusOnMapSwitcher(true);
        }}
        onBlur={() => {
          setFocusOnMapSwitcher(false);
        }}
      >
        <div className="w-full text-center font-mono">
          {paneOpen ? "Open my map" : "Open reading pane"}
        </div>
      </div>
    </div>
  );
}
