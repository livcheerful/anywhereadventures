"use client";
import { updateRoute } from "../lib/routeHelpers";
import { useEffect, useRef, useState } from "react";
import PostContent from "./PostContent";
import ContentHeader from "./ContentHeader";
import * as storageHelpers from "../lib/storageHelpers";

import { registerNewIO } from "../lib/intersectionObserverHelper";

export default function RiverFeed({
  setCurrentSlug,
  setExploringContent,
  myLocationSlugs,
  zoomToMainMap,
  setMyLocationSlugs,
  setPaneOpen,
  viewAsGrid,
  setViewAsGrid,
  scrollRef,
}) {
  const [contentArray, setContentArray] = useState(undefined);
  const [currentlyViewing, setCurrentlyViewing] = useState("");
  const [test, setTest] = useState(false);
  const ioRef = useRef(undefined);

  // Intersection Observer to update the URL
  useEffect(() => {
    if (!contentArray) return;
    // if (ioRef.current) return;
    const thingsToWatch = document.getElementsByClassName("article");
    const whereToWatch = undefined;
    const io = registerNewIO(
      thingsToWatch,
      whereToWatch,
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          const e = entries[i];
          if (e.isIntersecting) {
            // VVN TODO: page skips when component gets rerendered / state gets updated
            const slug = e.target.getAttribute("articleslug");
            const userKey = storageHelpers.getUserKey();
            // setTest(!test);
            updateRoute(`/${slug}?k=${userKey}`);
            setCurrentlyViewing(slug);
          }
        }
      },
      [0]
    );
    ioRef.current = io;
  }, [contentArray]);
  async function getMdx(locations) {
    const ca = [];
    for (const l of locations) {
      const file = await fetch(`/content/generated/${l}.json`);
      const f = await file.json();
      ca.push(f);
    }
    setContentArray(ca);
  }
  useEffect(() => {
    const locSlugs = storageHelpers.getAllSlugs();
    getMdx(locSlugs);
  }, [myLocationSlugs]);
  return (
    <div id="river-feed">
      {viewAsGrid && ( // Grid view
        <div className="  h-full bg-white ">
          <div className="w-full flex flex-row gap-2 overflow-x-hidden overflow-y-scroll flex-wrap p-2">
            {contentArray?.map((c, i) => {
              return (
                <div
                  key={i}
                  className=" w-1/3 grow h-[10rem] bg-slate-300 rounded-md drop-shadow-lg font-bold cursor-pointer "
                  style={{
                    backgroundImage: `url(${c.cardImage})`,
                    backgroundSize: "cover",
                  }}
                  onClick={() => {
                    const articles = document.getElementsByClassName("article");
                    for (let i = 0; i < articles.length; i++) {
                      if (articles[i].getAttribute("articleslug") == c.slug) {
                        articles[i].scrollIntoView();
                        setViewAsGrid(false);
                      }
                    }
                  }}
                >
                  <div className="bg-white/80 w-full px-2 py-1 ">{c.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {(!contentArray || contentArray.length == 0) && (
        <div className="pl-3 pt-2">
          <div className="flex flex-row">
            <svg
              className={`stroke-black stroke-[1] w-1/3 h-1/3 fill-none `}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd="url(#arrow)"
            >
              <defs>
                <marker
                  className="fill-black"
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="3"
                  markerHeight="3"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" />
                </marker>
              </defs>
              <path d={`m20 20 c-5 0 -13 -10 -13 -17 `}></path>
            </svg>

            <div className="pr-8 pt-10 font-bold -rotate-12  relative top-4 -left-6">
              <div>You don't have any locations saved to your map yet!</div>
              <div>Add new stories by exploring.</div>
            </div>
          </div>
        </div>
      )}
      {contentArray?.map((c, i) => {
        return (
          <div key={i} className="article" articleslug={c.slug}>
            <div className="h-1 article-io-spacer"></div>
            <ContentHeader
              post={c}
              currentSlug={""}
              contentSlug={c.slug}
              zoomToMainMap={zoomToMainMap}
              k={i}
              isAdded={true}
              setMyLocationSlugs={setMyLocationSlugs}
              setPaneOpen={setPaneOpen}
              scrollRef={scrollRef}
            />
            <PostContent post={c} />
            {i < contentArray.length - 1 && (
              <hr className="py-4 " style={{ color: "#FF2244" }}></hr>
            )}
          </div>
        );
      })}
    </div>
  );
}
