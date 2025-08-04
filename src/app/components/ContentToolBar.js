"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getHomeLocation } from "../lib/storageHelpers";
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
      <div className="h-2 p-2  bg-lime-200 w-full rounded-t-lg"></div>
      {
        <div className="absolute w-full gap-2 left-0 flex flex-row justify-start pl-2 h-10 items-stretch cursor-default ">
          <button
            onClick={(e) => {
              setShowingMenu(!showingMenu);
            }}
            className={`bg-lime-200 text-black flex flex-col items-stretch justify-center overflow-clip border-b-2 border-l-2 border-r-2 border-gray-800 rounded-b-xl text-center text-xs drop-shadow-2xl `}
          >
            <svg
              viewBox="0 0 100 100"
              id="menu-icon"
              className="fill-gray-800 w-6 h-6 grow border-b-2 border-gray-800"
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
            <div
              className="h-3 bg-lime-800 w-full grow-0"
              style={{ fontSize: "8px" }}
            ></div>
          </button>
          <div className="flex flex-col justify-center  bg-lime-800 overflow-clip w-2/5 border-2 border-t-0 border-gray-800 rounded-b-2xl text-center">
            <div className="flex flex-row items-stretch justify-center grow border-b-2 border-gray-800">
              <a
                className={`flex flex-col justify-center bg-lime-400 basis-1 grow text-xs text-gray-800 cursor-pointer`}
                href="/journal"
              >
                OPEN
              </a>
              <a
                className="flex flex-col justify-center grow basis-1 bg-lime-200 cursor-pointer text-gray-800"
                href={`/camera?locationId=${post.slug}`}
              >
                LOG VISIT
              </a>
            </div>
            <div
              className="h-3 grow-0 text-lime-500/90 flex flex-col items-center justify-center font-stretch-extra-expanded w-full"
              style={{ fontSize: "8px" }}
            >
              TRAVEL LOG
            </div>
          </div>

          <div className="flex flex-col justify-center w-2/5 font-bold text-black overflow-clip border-2 border-gray-800 border-t-0 bg-yellow-800 rounded-b-2xl drop-shadow-2xl cursor-default text-center text-xs">
            <div className="flex flex-row items-stretch justify-center grow border-b-2 border-gray-800 ">
              <button
                className="bg-yellow-500 basis-1 grow "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPaneOpen(false);

                  setViewingPin(undefined);

                  const homeLoc = getHomeLocation();
                  const homeLocationData = savedLocationToObj(homeLoc);
                  mainMap.flyTo(
                    homeLocationData.center,
                    homeLocationData.zoom,
                    false
                  );
                }}
              >
                OPEN
              </button>
              <button
                className="grow basis-6 bg-yellow-300 "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPaneOpen(false);
                  focusOnPin(post.slug, post);
                }}
              >
                VIEW SITE
              </button>
            </div>
            <div
              className="h-3 grow-0 text-yellow-500/80 flex flex-col items-center justify-center font-stretch-extra-expanded w-full"
              style={{ fontSize: "8px" }}
            >
              MAP
            </div>
          </div>
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
