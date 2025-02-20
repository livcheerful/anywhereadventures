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

export default function ContentPane({ slug, post, mainMap }) {
  const router = useRouter();
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [paneOpen, setPaneOpen] = useState(!!post || currentSlug == "discover");
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
      <div className="h-full">
        <div className="w-full text-2xl font-bold fixed  z-10">
          <div
            className="bg-lime-200 h-8 p-2 text-xs font-bold"
            onClick={() => {
              setPaneOpen(true);
            }}
          >{`YOUR LOCATIONS:`}</div>
        </div>
        <div className="w-full h-full flex overflow-y-scroll pt-10">
          {exploringContent && (
            <div className="w-full flex gap-2 flex-col">
              <div
                className="p-2 bg-blue-200 rounded-lg"
                onClick={() => {
                  // router.replace("/", undefined, { shallow: true });
                  setCurrentSlug(updateRoute("/"));
                  setExploringContent(false);
                }}
              >
                Back to my saved locations
              </div>
              <div className="p-2 rounded-md bg-emerald-200">
                View on map. This button will show all locations on the map to
                explore that way. myabe it shouldn't be a button, and show just
                show on the map?
              </div>
              Seattle Locations:
              <div className="w-full flex flex-row gap-2 overflow-x-auto px-3 py-4">
                {seattleLocs.map((l, k) => {
                  return (
                    <div
                      onClick={() => {
                        router.replace(`/${l.slug}`);
                      }}
                      key={k}
                      className="shrink-0 h-[12rem] w-[17rem] bg-cover text-lg font-extrabold cursor-pointer bg-slate-200 drop-shadow-md rounded-lg p-3"
                      style={{
                        backgroundImage: `url(${l.cardImage})`,
                      }}
                    >
                      {l.title}
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
            className={`pt-2 w-full ${
              paneOpen && currentSlug && currentSlug != "discover"
                ? "visible"
                : "hidden"
            }`}
          >
            <div
              className="bg-emerald-500 p-4 w-fit cursor-pointer"
              onClick={() => {
                router.replace("/discover");
                mainMap.removeAllTempLayers();
              }}
            >
              Back
            </div>
            <ContentHeader
              post={post}
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
        className="w-16 h-16 bg-emerald-700 absolute rounded-full -top-8 right-2 cursor-pointer  z-20"
        onClick={() => {
          setPaneOpen(true);
          setExploringContent(true);
          router.push("/discover");
        }}
      ></div>
      {paneOpen && (
        <div
          className="w-10 h-10 absolute -top-0 right-20 bg-emerald-700 text-white  z-20"
          onClick={() => {
            setPaneOpen(false);
          }}
        >
          Close
        </div>
      )}
    </div>
  );
}
