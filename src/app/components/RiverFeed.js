"use client";
import { updateRoute } from "../lib/routeHelpers";
import { useEffect, useRef, useState } from "react";
import PostContent from "./PostContent";
import StickyHeader from "./StickyHeader";
import PhotoPrompt from "./PhotoPrompt";
import UnstickyHeader from "./UnstickyHeader";
import { getMdx } from "../lib/clientPostHelper";
import { savedLocationToObj } from "../lib/locationHelpers";

import * as storageHelpers from "../lib/storageHelpers";
import { registerNewIO } from "../lib/intersectionObserverHelper";

export default function RiverFeed({
  entranceSlug,
  myLocationSlugs,
  focusOnPin,
  paneOpen,
  setPaneOpen,
  viewAsGrid,
  setViewAsGrid,
  scrollRef,
}) {
  const [contentArray, setContentArray] = useState(undefined);
  const [currentlyViewing, setCurrentlyViewing] = useState("");
  const [test, setTest] = useState(false);
  const ioRef = useRef(undefined);

  useEffect(() => {
    if (!entranceSlug) return;
    const article = document.querySelector(`#${entranceSlug[0]}`);
    if (article) article.scrollIntoView({ behavior: "smooth" });
  }, [contentArray]);

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
            updateRoute(`/${slug}`);
            setCurrentlyViewing(slug);
          }
        }
      },
      [0]
    );
    ioRef.current = io;
  }, [contentArray]);
  useEffect(() => {
    const homeLoc = storageHelpers.getHomeLocation();
    const homeLocationData = savedLocationToObj(homeLoc);
    if (!homeLocationData) return;
    const locSlugs = homeLocationData.locs.map((l) => {
      return l.slug;
    });
    getMdx(locSlugs, (res) => {
      setContentArray(res);
    });
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
                  <div className="bg-white/80 w-full px-2 py-1 dark:text-black ">
                    {c.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {contentArray?.map((c, i) => {
        return (
          <div key={i} className="article" id={c.slug} articleslug={c.slug}>
            <StickyHeader
              post={c}
              contentSlug={c.slug}
              focusOnPin={focusOnPin}
              isAdded={true}
              scrollRef={scrollRef}
              paneOpen={paneOpen}
              setPaneOpen={setPaneOpen}
            />
            <UnstickyHeader post={c} />
            <PostContent post={c} />
            <div className="w-full p-4">
              <PhotoPrompt
                mdx={c}
                visited={storageHelpers.hasLocationBeenVisited(c.slug)}
              />
            </div>
            {i < contentArray.length - 1 && (
              <hr className="py-4 " style={{ color: "#FF2244" }}></hr>
            )}
          </div>
        );
      })}
    </div>
  );
}
