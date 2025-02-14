"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PostContent from "./PostContent";
import { Map, Marker } from "maplibre-gl";
import { seattleLocs } from "../lib/MdxQueries";

export default function ContentPane({ slug, post, mainMap }) {
  const router = useRouter();
  const [paneOpen, setPaneOpen] = useState(!!post || slug == "discover");
  const [exploringContent, setExploringContent] = useState(slug == "discover");

  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    console.log("This is my post:");
    console.log(post);
    let miniMap = new Map({
      container: "mini-map",
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      zoom: post?.zoom || 8,
      center: post
        ? [post.latlon[1], post.latlon[0]]
        : [-122.341077, 47.619161],

      interactive: false,
      attributionControl: false,
    });
    if (post) {
      const pin = new Marker()
        .setLngLat([post.latlon[1], post.latlon[0]])
        .addTo(miniMap);
    }
  }, []);
  useEffect(() => {}, [mainMap]);

  useEffect(() => {
    if (!paneOpen) {
    }
  }, [paneOpen]);

  function zoomToMainMap() {
    console.log("Map clicked");
    setPaneOpen(false);
    mainMap.map.flyTo({
      center: [post.latlon[1], post.latlon[0]],
      zoom: post.zoom,
      speed: 0.4,
    });
    const tempPinOnMainMap = new Marker().setLngLat([
      post.latlon[1],
      post.latlon[0],
    ]);
    mainMap.addTemporaryLayer(tempPinOnMainMap);
  }

  return (
    <div
      className={`w-full ${
        paneOpen ? "h-full " : "h-16"
      } bg-white fixed self-end  shadow-t-lg  flex flex-col transition-[height] ease-linear`}
      id="pane"
    >
      <div className="h-full">
        <div className="w-full text-2xl font-bold fixed ">
          <div
            className="bg-lime-200 h-8 p-2 text-xs font-bold"
            onClick={() => {
              setPaneOpen(true);
            }}
          >{`YOUR LOCATIONS:`}</div>
        </div>
        <div className="w-full h-full flex overflow-y-scroll pt-10">
          {exploringContent && (
            <div className="w-full">
              <div
                onClick={() => {
                  router.push("/");
                }}
              >
                Back to my saved locations
              </div>
              Seattle Locations:
              <div className="w-full flex flex-row gap-2 overflow-x-scroll px-3 ">
                {seattleLocs.map((l, k) => {
                  console.log(l);
                  return (
                    <div
                      onClick={() => {
                        router.push(`/${l.slug}`);
                      }}
                      key={k}
                      className="shrink-0 h-[12rem] w-[17rem] bg-emerald-50"
                    >
                      {l.title}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div
            className={`pt-2 w-full ${
              paneOpen && slug && slug != "discover" ? "visible" : "hidden"
            }`}
          >
            <div
              className="bg-emerald-500 p-4 w-fit cursor-pointer"
              onClick={() => {
                router.push("/discover");
              }}
            >
              Back
            </div>
            <div className="flex flex-row gap-2 p-4 ">
              <div
                className={`w-[8rem] h-[10rem] bg-slate-400 `}
                id="mini-map"
                onClick={() => {
                  zoomToMainMap();
                }}
              ></div>
              <div className="flex flex-col  gap-3">
                <div className=" font-bold text-2xl">{post?.title}</div>
                <div
                  className={`bg-slate-200 p-1 rounded-xl font-semibold text-center ${"bg-green-600"}`}
                  onClick={() => {
                    console.log("we're gonna add this place to our map, yeah?");
                  }}
                >
                  Add to Map
                </div>

                <div
                  className="p-1 rounded-xl font-semibold text-center bg-slate-200"
                  onClick={() => {
                    router.push(`/camera?refSlug=${slug}`);
                  }}
                >
                  Take a photo
                </div>
              </div>
            </div>

            {post && <PostContent post={post} />}
          </div>
        </div>
      </div>
      <div
        className="w-16 h-16 bg-emerald-700 absolute rounded-full -top-8 right-2 cursor-pointer"
        onClick={() => {
          setPaneOpen(true);
          setExploringContent(true);
          router.push("/discover");
        }}
      ></div>
      {paneOpen && (
        <div
          className="w-10 h-10 absolute -top-0 right-20 bg-emerald-700 text-white"
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
