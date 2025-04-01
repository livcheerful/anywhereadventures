"use client";

import { useState } from "react";
import { getAllLCItems, removeLCItem } from "../lib/storageHelpers";

export default function ScrapbookPage() {
  const [allItems, setAllItems] = useState(getAllLCItems());

  function randomColor() {
    const colors = ["#50fa7d", "#e3fa50", "#ff8fda"];
    return {
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  function randomTwist(degVariation) {
    return {
      rotate: `${
        Math.random() > 0.5
          ? Math.random() * degVariation
          : -1 * Math.random() * degVariation
      }deg`,
    };
  }

  return (
    <div
      className="overflow-clip pl-12 pr-2"
      onScroll={() => {
        console.log("scrolling");
      }}
    >
      <div className=" text-2xl font-bold py-4">Scrapbook</div>

      {Object.keys(allItems).length == 0 && (
        <div>
          <div>
            This is where your saved items from the Library of Congress will go.
            Collect them to explore more for later.
          </div>
          <div>
            Why not go{" "}
            <a className=" text-blue-600 underline" href="/discover">
              discover some new stories?
            </a>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-16">
        {Object.keys(allItems).map((link, k) => {
          const thisItem = allItems[link];
          return (
            <div key={k} className="relative pl-[2rem]">
              <div
                className="p-2 bg-white m-2 relative drop-shadow-lg"
                style={{ ...randomTwist(20) }}
              >
                <img src={thisItem.image} />
                <div
                  onClick={() => {
                    removeLCItem(link);
                    setAllItems(getAllLCItems());
                  }}
                  className="bg-white -rotate-6 drop-shadow-md rounded-full absolute top-0 -left-3 p-3 outline-2 outline-slate-500 cursor-pointer"
                >
                  x
                </div>
                <div
                  className="absolute right-5 rotate-3 top-3  p-2 font-black drop-shadow-lg"
                  style={{ ...randomTwist(10), ...randomColor() }}
                >
                  <div>{new Date(thisItem.timeAdded).toDateString()}</div>
                  <a href={thisItem.fromSlug}>
                    <div className=" underline text-blue-500">Saved From</div>
                  </a>
                </div>
              </div>
              <div className=" gap-2 z-10 absolute w-4/5 right-2 bottom-[-4rem] bg-white p-2 font-serif italic drop-shadow-lg flex flex-row items-center rounded-r-lg">
                <div>{thisItem.caption}</div>
                <div className="w-[1px] shrink-0 h-8 bg-slate-300"></div>
                <div className="shrink-0 w-4 h-full">
                  <a href={thisItem.link}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-[15rem] w-full"> </div>
    </div>
  );
}
