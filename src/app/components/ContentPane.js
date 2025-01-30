"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PostContent from "./PostContent";
import { Map } from "maplibre-gl";

export default function ContentPane({ slug, post }) {
  const router = useRouter();
  const [paneOpen, setPaneOpen] = useState(!!post || slug == "discover");
  const [exploringContent, setExploringContent] = useState(slug == "discover");

  const [allPosts, setAllPosts] = useState([]);
  useEffect(() => {
    console.log("Make a mpa");
    let map = new Map({
      container: "mini-map",
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      zoom: 13,
      center: [-122.341077, 47.619161],
      interactive: false,
      attributionControl: false,
    });
  }, []);
  return (
    <div
      className={`w-full ${
        paneOpen ? "h-full " : "h-16"
      } bg-white fixed self-end  shadow-t-lg cursor-pointer flex flex-col transition-[height] ease-linear`}
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
              Find content here
              <div className="w-full flex flex-row gap-2 overflow-x-scroll px-3 ">
                <div
                  onClick={() => {
                    router.push(`/${"sinking-ship"}`);
                  }}
                  key={0}
                  className="shrink-0 h-[12rem] w-[17rem] bg-emerald-50"
                >
                  Sinking Ship
                </div>
                {/* {allPosts.map((p, i) => {
                  console.log(p);
                  return (
                  );
                })} */}
              </div>
            </div>
          )}

          <div
            className={`pt-10 ${
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
                  console.log("Map clicked");
                  setPaneOpen(false);
                }}
              ></div>
              <div className="flex flex-col">
                <div className=" font-bold text-2xl">{post?.title}</div>
                <div
                  className={`bg-slate-200 p-1 rounded-xl font-semibold text-center ${"bg-green-600"}`}
                >
                  Add to Map
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
          className="w-16 h-16 absolute -top-0 right-20 bg-emerald-700 text-white"
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
