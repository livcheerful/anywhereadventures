"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function ContentToolBar({ post, paneOpen, setPaneOpen }) {
  const [focusOnMapSwitcher, setFocusOnMapSwitcher] = useState(false);
  return (
    <div
      className="md:w-limiter rounded-t-lg relative bg-lime-200 h-2 p-2 text-xs font-bold flex flex-row gap-2 border-t-gray-800 border-t-2  dark:text-black"
      onClick={() => {
        setPaneOpen(true);
      }}
    >
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
