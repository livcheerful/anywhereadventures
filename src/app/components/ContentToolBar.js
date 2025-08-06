"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getHomeLocation,
  getNumNewTravelLogPages,
} from "../lib/storageHelpers";
import { savedLocationToObj } from "../lib/locationHelpers";
export default function ContentToolBar({
  post,
  paneOpen,
  setPaneOpen,
  focusOnPin,
  showingMenu,
  setShowingMenu,
  setViewingPin,
  mainMap,
}) {
  const [focusOnMapSwitcher, setFocusOnMapSwitcher] = useState(false);
  return (
    <div
      className="md:w-limiter rounded-t-lg relative text-xs font-bold flex flex-row gap-2 border-t-gray-800 border-t-2 dark:text-black"
      onClick={() => {
        setPaneOpen(true);
      }}
    >
      <div className="h-2 p-2 w-full rounded-t-lg"></div>
      {
        <div className="absolute w-full gap-2 h-10 left-0 flex flex-row justify-start pl-2  items-stretch cursor-default ">
          <button
            onClick={(e) => {
              setShowingMenu(!showingMenu);
            }}
            className={`bg-lime-200 text-black flex flex-col items-stretch justify-center overflow-clip border-b-2 border-l-2 border-r-2 border-gray-800 rounded-b-xl text-center text-xs drop-shadow-2xl `}
          >
            <svg
              viewBox="0 0 100 100"
              id="menu-icon"
              className="fill-gray-800 w-6 h-6 grow"
            >
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
          <a
            className="relative w-1/5 pb-1 flex flex-col justify-end items-center text-green-100 bg-green-800 border-2 border-t-0 border-gray-800 rounded-b-2xl text-center"
            href={`/journal?id=${post.slug}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className=" overflow-clip ">
              <div style={{ fontSize: "30px" }}>📒</div>
              <div style={{ fontSize: "8px" }}>TRAVEL LOG</div>
            </div>
            {getNumNewTravelLogPages() > 0 ? (
              <div className="bg-red-600 text-white font-bold absolute -right-2 -bottom-2 rounded-full w-6 h-6 flex flex-col items-center justify-center">
                {getNumNewTravelLogPages()}
              </div>
            ) : (
              <></>
            )}
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault;
              setPaneOpen(false);
              const homeLocation = getHomeLocation();
              const homeLocationData = savedLocationToObj(homeLocation);
              setViewingPin(undefined);
              mainMap.flyTo(
                homeLocationData.center,
                homeLocationData.zoom,
                false
              );
            }}
            className="flex flex-col items-center justify-end w-2/3 font-bold text-yellow-900 overflow-clip border-2 border-gray-800 border-t-0 bg-yellow-300 rounded-b-2xl drop-shadow-2xl cursor-default text-center text-xs"
          >
            <div style={{ fontSize: "30px" }}>🗺️</div>
            <div style={{ fontSize: "10px" }}>BACK TO MAP</div>
          </button>
        </div>
      }
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
