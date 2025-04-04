"use client";
import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import { categoryInfo } from "../content/meta";
import { seattleLocs, seattleByCategory } from "../lib/MdxQueries";
import { updateRoute } from "../lib/routeHelpers";
import { add as addToStorage } from "../lib/storageHelpers";
import { registerNewIO } from "../lib/intersectionObserverHelper";
import { makeNewMarker } from "../components/Map";
import {
  unvisitedMapColor,
  unopinionatedMapColor,
  excitingMapColor,
} from "../lib/constants";
export default function DiscoverFeed({
  zoomToMainMap,
  setCurrentSlug,
  currentSlug,
  exploringContent,
  mainMap,
}) {
  function getPostsByCategory(category) {
    for (let i = 0; i < seattleByCategory.length; i++) {
      if (seattleByCategory[i].tag == category)
        return seattleByCategory[i].posts;
    }
  }

  function getPostBySlug(slug) {
    for (let i = 0; i < seattleLocs.length; i++) {
      if (seattleLocs[i].slug == slug) return seattleLocs[i];
    }
  }
  const [expandedCategories, setExpandedCateogires] = useState(new Map());
  const router = useRouter();
  const ioRef = useRef();

  // Register Intersection Observer
  useEffect(() => {
    console.log("tryig to register an intersection observer");
    if (!mainMap) return;
    if (ioRef.current) {
      if (!currentSlug || currentSlug == "") {
        // Unregister IO
        console.log("Need to unregister");
      }
      return;
    }
    if (!exploringContent) return;

    // For individual cards, highlight pin
    ioRef.current = registerNewIO(
      document.getElementsByClassName("ind-card"),
      document.getElementById("#explorePane"),
      (entries) => {
        for (let entryIdx = 0; entryIdx < entries.length; entries++) {
          const justScrolledInElem = entries[entryIdx].target;
          const cardSlug = justScrolledInElem.getAttribute("cardslug");
          if (
            entries[entryIdx].isIntersecting &&
            entries[entryIdx].intersectionRatio == 1
          ) {
            const postInView = getPostBySlug(cardSlug);

            const m = makeNewMarker(excitingMapColor, postInView, router, true);
            mainMap.addLayer(m, cardSlug);
          } else {
            mainMap.removeLayerGroup(cardSlug);
          }
        }
      }
    );

    // For each category, highlight pins
    registerNewIO(
      document.getElementsByClassName("category-row-header"),
      document.getElementById("#explorePane"),
      (entries) => {
        console.log("intersecting! hello");
        for (let entryIdx = 0; entryIdx < entries.length; entries++) {
          const justScrolledInElem = entries[entryIdx].target;
          const category = justScrolledInElem.getAttribute("categoryname");
          const catMetaInfo = categoryInfo[category];
          if (
            entries[entryIdx].isIntersecting &&
            entries[entryIdx].intersectionRatio == 1
          ) {
            const postsInView = getPostsByCategory(category);
            postsInView.forEach((p) => {
              const m = makeNewMarker(
                catMetaInfo?.pinColor || excitingMapColor,
                p,
                router,
                true
              );
              mainMap.addLayer(m, category);
            });
          } else {
            mainMap.removeLayerGroup(category);
          }
        }
      }
    );
  }, [mainMap, currentSlug]);
  return (
    <div className="w-full h-fit flex gap-2 flex-col  ">
      <div id="explorePane" className=" flex flex-col p-2 gap-3 ">
        {seattleByCategory.map((category, ck) => {
          const categoryMeta = categoryInfo[category.tag];
          return (
            <div className="category-row" key={ck}>
              <div
                className="text-xl font-bold pb-2 category-row-header"
                categoryname={category.tag}
              >
                {category.tag.toUpperCase()}
              </div>
              <div className="p-3">
                {categoryMeta && <div>{categoryMeta?.description}</div>}

                <div className="bg-emerald-400 text-white font-bold p-2 rounded-lg ">
                  Add all to map
                </div>
              </div>
              <div
                className={`flex flex-row overflow-x-auto gap-4 pt-6 pb-4 drop-shadow-lg`}
              >
                {category.posts.map((l, k) => {
                  return (
                    <div
                      onClick={() => {
                        // router.replace(`/${l.slug}`);
                        updateRoute(`/${l.slug}`);
                        setCurrentSlug(l.slug);
                        // Update map view to zoom to this
                        zoomToMainMap(l.latlon, l.zoom || 10);
                      }}
                      key={k}
                      className={`shrink-0 w-3/5  h-[10rem] bg-cover text-md font-extrabold cursor-pointer bg-slate-200 drop-shadow-md rounded-lg flex flex-col items-end`}
                      style={{
                        backgroundImage: `url(${l.cardImage})`,
                      }}
                    >
                      <div
                        className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-green-500 text-white flex flex-col items-center justify-center"
                        onClick={(e) => {
                          console.log(l);
                          e.stopPropagation();
                          addToStorage(l.slug, l);
                        }}
                      >
                        +
                      </div>
                      <div className="bg-white/80 w-full px-2 py-1 ">
                        {l.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="text-xl p-3 font-bold ">All Seattle Stories:</div>
        {seattleLocs.map((l, k) => {
          return (
            <div
              onClick={() => {
                router.replace(`/${l.slug}`);
              }}
              key={k}
              className="ind-card shrink-0 w-full h-[13rem] bg-cover text-lg font-extrabold cursor-pointer bg-slate-200 drop-shadow-md rounded-lg flex flex-col items-end"
              cardslug={l.slug}
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
  );
}
