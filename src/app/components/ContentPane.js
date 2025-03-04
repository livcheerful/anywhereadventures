"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PostContent from "./PostContent";
import { Map, Marker } from "maplibre-gl";
import { seattleLocs } from "../lib/MdxQueries";
import RiverFeed from "./RiverFeed";
import ContentHeader from "./ContentHeader";
import { updateRoute } from "../lib/routeHelpers";
import { getAllSlugs, getAll, isAdded } from "../lib/storageHelpers";

export default function ContentPane({
  slug,
  post,
  mainMap,
  paneOpen,
  setPaneOpen,
}) {
  const router = useRouter();
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [exploringContent, setExploringContent] = useState(
    currentSlug == "discover"
  );
  const [myLocationSlugs, setMyLocationSlugs] = useState(getAllSlugs());
  useEffect(() => {
    const myLocations = getAll();
    const arrayed = Object.keys(myLocations).map((slug) => {
      return { slug: slug, ...myLocations[slug] };
    });
    mainMap?.updatePins(arrayed);
  }, [mainMap, myLocationSlugs]);

  useEffect(() => {
    if (paneOpen) {
      // mainMap?.removeAllTempLayers();
    }
  }, [paneOpen]);

  useEffect(() => {
    setExploringContent(currentSlug == "discover");
  }, [currentSlug]);

  function zoomToMainMap(coords, zoom, setTempPin = false) {
    setPaneOpen(false);
    mainMap.map.flyTo({
      center: coords,
      zoom: zoom || 8,
      speed: 0.4,
    });
    if (setTempPin) {
      const tempPinOnMainMap = new Marker({
        color: "#FFFFFF",
      }).setLngLat(coords);
      const l = mainMap.addTemporaryLayer(tempPinOnMainMap);
    }
  }

  return (
    <div
      className={`w-full ${
        paneOpen ? "h-4/5 " : "h-16"
      } bg-white fixed self-end  shadow-t-lg  flex flex-col transition-[height] ease-linear`}
      id="pane"
    >
      <script src="https://cdn.jsdelivr.net/gh/MarketingPipeline/Markdown-Tag/markdown-tag.js"></script>

      <div className="h-full">
        <div className="w-full text-2xl font-bold fixed  z-10">
          <div
            className="bg-lime-200 h-8 p-2 text-xs font-bold flex flex-row gap-2"
            onClick={() => {
              setPaneOpen(true);
            }}
          >
            <div>{`YOUR LOCATIONS:`}</div>
            <div>{Object.keys(getAll()).length} saved</div>
            <div>0 visited</div>
          </div>
        </div>
        <div className="w-full h-full flex overflow-y-scroll pt-10">
          {exploringContent && (
            <div className="w-full flex gap-2 flex-col overflow-x-hidden">
              <div
                className="right-0 bg-emerald-800 p-3 py-2 fixed z-50 rounded-l-lg drop-shadow-md w-fit cursor-pointer text-sm text-white font-bold"
                onClick={() => {
                  // router.replace("/", undefined, { shallow: true });
                  setCurrentSlug(updateRoute("/"));
                  setExploringContent(false);
                }}
              >
                Back
              </div>
              {/* <div className="p-2 rounded-md bg-emerald-200">
                View on map. This button will show all locations on the map to
                explore that way. myabe it shouldn't be a button, and show just
                show on the map?
              </div> */}
              <div className="text-2xl p-3 font-bold ">Seattle Stories:</div>
              {/* <div className="w-full flex flex-row gap-2 overflow-x-auto px-3 py-4"> */}
              <div className=" flex flex-col p-2 gap-3 ">
                {seattleLocs.map((l, k) => {
                  return (
                    <div
                      onClick={() => {
                        router.replace(`/${l.slug}`);
                      }}
                      key={k}
                      className="shrink-0 w-full h-[13rem] bg-cover text-lg font-extrabold cursor-pointer bg-slate-200 drop-shadow-md rounded-lg flex flex-col items-end"
                      style={{
                        backgroundImage: `url(${l.cardImage})`,
                      }}
                    >
                      <div className="bg-white/80 w-full p-3 ">{l.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {!exploringContent && !currentSlug && (
            <RiverFeed
              zoomToMainMap={zoomToMainMap}
              setCurrentSlug={setCurrentSlug}
              myLocationSlugs={myLocationSlugs}
              setMyLocationSlugs={setMyLocationSlugs}
              setPaneOpen={setPaneOpen}
            />
          )}

          <div
            className={` w-full ${
              paneOpen && currentSlug && currentSlug != "discover"
                ? "visible"
                : "hidden"
            }`}
          >
            <div
              className="right-0 bg-emerald-800 p-3 py-2 fixed z-50 rounded-l-lg drop-shadow-md w-fit cursor-pointer text-sm text-white font-bold"
              onClick={() => {
                router.replace("/discover");
                mainMap.removeAllTempLayers();
              }}
            >
              Back
            </div>
            <ContentHeader
              post={post}
              currentSlug={currentSlug}
              zoomToMainMap={zoomToMainMap}
              setMyLocationSlugs={setMyLocationSlugs}
              isAdded={isAdded(currentSlug)}
              setPaneOpen={setPaneOpen}
            />
            {post && <PostContent post={post} />}
          </div>
        </div>
      </div>
      <div
        className="w-14 h-14 bg-emerald-800 absolute rounded-full -top-5 right-2 cursor-pointer z-20 flex flex-col items-center justify-center drop-shadow-xl"
        onClick={() => {
          setPaneOpen(true);
          setExploringContent(true);
          router.push("/discover");
        }}
      >
        <svg
          className="stroke-white stroke-[3] w-1/3 h-1/3 z-40"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={`m12 2 l0 20 m-10 -10 l20 0`}></path>
        </svg>
      </div>
      {/* {paneOpen && (
        <div
          className="w-10 h-10 absolute -top-0 right-20 bg-emerald-700 text-white  z-20"
          onClick={() => {
            setPaneOpen(false);
          }}
        >
          Close
        </div>
      )} */}
    </div>
  );
}
