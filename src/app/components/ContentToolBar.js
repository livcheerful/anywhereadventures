"use client";
import { getAllSlugs, getNumberOfStamps } from "../lib/storageHelpers";
import { updateRoute } from "../lib/routeHelpers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function ContentToolBar({
  setPaneOpen,
  exploringContent,
  setExploringContent,
  currentSlug,
  setCurrentSlug,
  mainMap,
  viewAsGrid,
  setViewAsGrid,
}) {
  const router = useRouter();

  const noSavedLocations = !exploringContent && getAllSlugs().length == 0;

  const toolTipText = () => {
    if (!exploringContent) {
      return (
        <div className="flex flex-row gap-2 pl-16">
          <div>{`YOUR LOCATIONS:`}</div>
          <div>{Object.keys(getAllSlugs()).length} saved</div>
          <div>{getNumberOfStamps() || 0} visited</div>
        </div>
      );
    } else if (exploringContent && currentSlug == "discover") {
      return (
        <div className="flex flex-row gap-2 pl-16">
          Find places to add to your map
        </div>
      );
    }
  };
  return (
    <div
      className="md:w-limiter relative bg-lime-200 h-8 p-2 text-xs font-bold flex flex-row gap-2  border-t-slate-800 border-t-2"
      onClick={() => {
        setPaneOpen(true);
      }}
    >
      {toolTipText()}
      <div
        className={` ${
          noSavedLocations && "animate-ping"
        } w-14 h-14 bg-emerald-300 absolute rounded-full -top-4 left-2 `}
      ></div>
      <div
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
      </div>

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
        {!exploringContent && currentSlug == "" && (
          <div
            className=" bg-emerald-800 p-3 py-2 right-0  rounded-l-lg drop-shadow-md w-fit cursor-pointer text-sm text-white font-bold"
            onClick={() => {
              setViewAsGrid(!viewAsGrid);
            }}
          >
            {viewAsGrid ? "Feed" : "Grid"}
          </div>
        )}
      </div>
    </div>
  );
}
