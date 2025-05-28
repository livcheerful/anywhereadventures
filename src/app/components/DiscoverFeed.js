"use client";
import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import { categoryInfo } from "../content/meta";
import { updateRoute } from "../lib/routeHelpers";
import {
  add as addToStorage,
  getAllSlugs,
  remove as removeFromStorage,
} from "../lib/storageHelpers";
import { registerNewIO } from "../lib/intersectionObserverHelper";
import { makeNewMarker } from "../components/Map";
import { makeConfetti } from "../lib/animationHelpers";
export default function DiscoverFeed({
  zoomToMainMap,
  setCurrentSlug,
  currentSlug,
  exploringContent,
  chosenLocation,
  mainMap,
  myLocationSlugs,
  setMyLocationSlugs,
}) {
  function getPostsByCategory(category) {
    const byCat = chosenLocation.byCategory;
    for (let i = 0; i < byCat.length; i++) {
      if (byCat[i].tag == category) return byCat[i].posts;
    }
  }

  function getPostBySlug(slug) {
    const locs = chosenLocation.locs;
    for (let i = 0; i < locs.length; i++) {
      if (locs[i].slug == slug) return locs[i];
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

            const m = makeNewMarker("#ff70f1", postInView, router, true);
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
                catMetaInfo?.pinColor || "#ff70f1",
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

  function areAllCategorySlugsSaved(category) {
    let doWeHave = true;
    category.posts.forEach((post) => {
      const doesItHave = myLocationSlugs.find((s) => {
        return s == post.slug;
      });
      if (!doesItHave) {
        doWeHave = false;
      }
    });

    return doWeHave;
  }
  return (
    <div className="w-full h-fit flex gap-2 flex-col  dark:text-black">
      <div id="explorePane" className=" flex flex-col p-2 gap-3 ">
        {chosenLocation.byCategory &&
          chosenLocation.byCategory.map((category, ck) => {
            const categoryMeta = categoryInfo[category.tag];
            return (
              <div className="category-row pb-3" key={ck}>
                <div
                  className="text-xl font-bold pb-2 category-row-header"
                  categoryname={category.tag}
                >
                  {categoryMeta?.title || category.tag}
                </div>
                <div className="text-sm italic">
                  {categoryMeta && <div>{categoryMeta?.description}</div>}
                </div>
                <div
                  className={`flex flex-row overflow-x-auto gap-4 pt-6 pb-4 drop-shadow-lg`}
                >
                  <div
                    className={`${
                      areAllCategorySlugsSaved(category)
                        ? "bg-slate-200 fill-slate-400 text-slate-400 transition-colors"
                        : "bg-green-500 text-white fill-white transition-colors"
                    }  font-bold p-2 rounded-lg cursor-pointer shrink-0 w-12 flex flex-col justify-center`}
                    onClick={(e) => {
                      category.posts.forEach((p) => {
                        addToStorage(p.slug, p);
                      });
                      setMyLocationSlugs(getAllSlugs());
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                    </svg>
                    <div className=" text-sm text-center pt-2 font-bold">
                      {" "}
                      ALL
                    </div>
                  </div>
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
                        {myLocationSlugs.find((e) => {
                          return e == l.slug;
                        }) ? (
                          <div
                            className=" transition-colors absolute -right-3 -top-3 w-10 h-10 rounded-full bg-slate-300 text-slate-500 flex flex-col items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromStorage(l.slug);
                              setMyLocationSlugs(getAllSlugs());
                            }}
                          >
                            -
                          </div>
                        ) : (
                          <div
                            className="transition-colors absolute -right-3 -top-3 w-10 h-10 rounded-full bg-green-500 text-white flex flex-col items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToStorage(l.slug, l);
                              setMyLocationSlugs(getAllSlugs());
                            }}
                          >
                            +
                          </div>
                        )}
                        <div className="bg-white/80 w-full px-2 py-1 ">
                          {l.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <hr></hr>
              </div>
            );
          })}
        <div className="text-xl p-3 font-bold ">All Stories:</div>
        {chosenLocation.locs.map((l, k) => {
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
