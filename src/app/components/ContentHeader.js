"use client";
import { useEffect, useState } from "react";
import { Map, Marker } from "maplibre-gl";
import {
  add as addToStorage,
  getAllSlugs,
  remove as removeFromStorage,
} from "../lib/storageHelpers";
export default function ContentHeader({
  post,
  zoomToMainMap,
  setMyLocationSlugs,
  setPaneOpen,
  k = 0,
  isAdded = false,
}) {
  useEffect(() => {
    let miniMap = new Map({
      container: `mini-map-${k}`,
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

  return (
    <div className="flex flex-row gap-2 p-4 ">
      <div
        className={`w-[8rem] h-[10rem] bg-slate-400 `}
        id={`mini-map-${k}`}
        onClick={() => {
          zoomToMainMap([post.latlon[1], post.latlon[0]], post.zoom, !isAdded);
        }}
      ></div>
      <div className="flex flex-col  gap-3 flex-grow">
        <div className=" font-bold text-2xl">{post?.title}</div>
        <div
          className={`bg-slate-200 p-1 rounded-xl font-semibold text-center cursor-pointer ${"bg-green-600"}`}
          onClick={() => {
            if (!isAdded) {
              addToStorage(post.slug, post);
              setMyLocationSlugs(getAllSlugs());
            } else {
              removeFromStorage(post.slug);
              setMyLocationSlugs(getAllSlugs());
            }

            setPaneOpen(false);
            zoomToMainMap(
              [post.latlon[1], post.latlon[0]],
              post.zoom,
              !isAdded
            );
          }}
        >
          {isAdded ? "Remove" : "Add to Map"}
        </div>

        <div
          className="p-1 rounded-xl font-semibold text-center bg-slate-200 cursor-pointer"
          onClick={() => {
            router.replace(`/camera?refSlug=${currentSlug}`);
          }}
        >
          Take a photo
        </div>
      </div>
    </div>
  );
}
