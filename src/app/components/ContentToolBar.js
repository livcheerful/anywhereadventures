"use client";
import Navbar from "../components/Navbar";
import {
  getAllSlugs,
  numberOfPages,
  isAdded,
  localStorageKey,
  add as addToStorage,
  remove as removeFromStorage,
} from "../lib/storageHelpers";
import { updateRoute } from "../lib/routeHelpers";
import { useRouter } from "next/navigation";
import { makeConfetti } from "../lib/animationHelpers";
import { useEffect, useState } from "react";
export default function ContentToolBar({
  post,
  paneOpen,
  setPaneOpen,
  exploringContent,
  setExploringContent,
  currentSlug,
  setCurrentSlug,
  setMyLocationSlugs,
  mainMap,
  viewAsGrid,
  setViewAsGrid,
  setShowingWelcomeScreen,
}) {
  const router = useRouter();

  const noSavedLocations = !exploringContent && getAllSlugs().length == 0;
  const [shouldShowAddToMapButton, setShouldShowAddToMapButton] = useState(
    exploringContent && currentSlug != "discover"
  );
  const [focusOnMapSwitcher, setFocusOnMapSwitcher] = useState(false);

  useEffect(() => {
    setShouldShowAddToMapButton(exploringContent && currentSlug != "discover");
  });

  const [isLocAdded, setIsLocAdded] = useState(
    isAdded(localStorageKey, currentSlug)
  );

  const toolTipText = () => {
    return (
      <div className="flex flex-row gap-2">
        <div>{`YOUR LOCATIONS:`}</div>
        <div>{Object.keys(getAllSlugs()).length} saved</div>
        <div>{numberOfPages() || 0} visited</div>
      </div>
    );
  };
  return (
    <div
      className="md:w-limiter relative bg-lime-200 h-8 p-2 text-xs font-bold flex flex-row gap-2  border-t-gray-800 border-t-2  dark:text-black"
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
      {toolTipText()}
      {/* <div
        className="w-14 h-14 bg-emerald-800 absolute rounded-full -top-4 left-2 cursor-pointer flex flex-col items-center justify-center drop-shadow-xl"
        onClick={() => {
          setExploringContent(!exploringContent);
          setPaneOpen(true);
          if (exploringContent) {
            updateRoute("/");
            setCurrentSlug("");
          } else {
            // router.push("/discover");
            updateRoute("/discover");
            setCurrentSlug("discover");
          }
        }}
      >
        <svg
          className={` stroke-white stroke-[3] w-1/3 h-1/3 transition-transform ${
            exploringContent ? "rotate-45" : "rotate-0"
          }`}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={`m12 2 l0 20 m-10 -10 l20 0`}></path>
        </svg>
      </div> */}

      {shouldShowAddToMapButton && (
        <div
          className="absolute bg-emerald-500 p-3 rounded-lg bottom-10 right-0 cursor-pointer"
          onClick={(e) => {
            if (!isLocAdded) {
              addToStorage(currentSlug, post);
            } else {
              removeFromStorage(currentSlug);
            }

            if (!isLocAdded)
              makeConfetti(
                e.target.parentElement,
                e.clientX,
                e.clientY,
                15,
                "⭐️"
              );
            setIsLocAdded(!isLocAdded);
          }}
        >
          {isLocAdded ? "Remove" : "Add to my map"}
        </div>
      )}

      <div className="absolute right-0 top-10 w-20 h-20 flex flex-col items-end gap-3">
        {exploringContent && currentSlug != "discover" && (
          <div
            className="relative bg-emerald-800 p-3 py-2 right-0  rounded-l-lg drop-shadow-md w-fit cursor-pointer text-sm text-white font-bold"
            onClick={() => {
              //   router.replace("/discover");
              updateRoute("/discover");
              setCurrentSlug("discover");
            }}
          >
            Back
          </div>
        )}

        {/* {!exploringContent && currentSlug == "" && (
          <div
            className=" bg-emerald-800 p-3 py-2 right-0  rounded-l-lg drop-shadow-md w-fit cursor-pointer text-sm text-white font-bold "
            onClick={() => {
              setViewAsGrid(!viewAsGrid);
            }}
          >
            {viewAsGrid ? "Feed" : "Grid"}
          </div>
        )} */}
      </div>
    </div>
  );
}
