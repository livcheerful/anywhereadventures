"use client";
import {
  getAllLCItems,
  removeLCItem,
  getAllPages,
} from "../lib/storageHelpers";
import { useState, useEffect } from "react";
import JournalPage from "../components/JournalPage";
import { categoryInfo } from "../content/meta";
import { savedLocationToObj } from "../lib/locationHelpers";
import { getHomeLocation } from "../lib/storageHelpers";
import CornerTape from "../components/CornerTape";

export default function Page() {
  const [categories, setCategories] = useState(
    transformSavedLocationsToCategories()
  );

  function addHomeLocationStickers(homeLocation) {
    switch (homeLocation) {
      case "Seattle":
        return (
          <div className="bg-yellow-300 p-2 px-8 absolute -rotate-12 right-7 bottom-1/3 text-black ">
            Seattle
          </div>
        );
      case "Chicago":
        break;
      case "Southeast Wyoming":
        const wyStickers = [];
        wyStickers.push(
          <div className="absolute left-3 bottom-1/3 ">
            <CornerTape>
              <img
                className="w-56 h-auto rotate-2 drop-shadow-2xl text-black"
                src="/loc/sewy/wypack.png"
              />
            </CornerTape>
          </div>
        );
        wyStickers.push(
          <div className="bg-yellow-300 p-2 px-8 absolute -rotate-12 right-7 bottom-1/3 font-bold text-lg">
            Wyoming
          </div>
        );
        return wyStickers;
        break;
      default:
        break;
    }
  }
  function makeJournalPages() {
    let pageCount = 1;
    const allPages = categories.values().map((category, i) => {
      const catMeta = categoryInfo[category.tag];
      const numberPerPage = 4;
      const numOfPagesNeeded = Math.ceil(
        category.locations.length / numberPerPage
      );
      const pages = [];
      for (let i = 0; i < numOfPagesNeeded; i++) {
        const base = i * numberPerPage;
        pages.push(
          <div
            key={i}
            className="w-full h-full shrink-0"
            id={`page-${category.tag}-${i}`}
          >
            <JournalPage
              pageNumber={pageCount++}
              category={category}
              categoryMeta={catMeta}
              locations={category.locations.slice(base, base + numberPerPage)}
            />
          </div>
        );
      }
      return pages;
    });
    return allPages;
  }

  function transformSavedLocationsToCategories() {
    const homeLoc = getHomeLocation() || "World";
    const locData = savedLocationToObj(homeLoc);

    const gatheredCategoriesMap = new Map();
    for (let mdxIdx in locData.locs) {
      const mdx = locData.locs[mdxIdx];
      console.log(mdx);
      mdx.tags.forEach((tag, i) => {
        if (!gatheredCategoriesMap.has(tag)) {
          gatheredCategoriesMap.set(tag, { tag: tag, locations: [] });
        }

        const soFar = gatheredCategoriesMap.get(tag);
        const addAnother = Array.from(soFar.locations);
        addAnother.push(mdx);
        gatheredCategoriesMap.set(tag, {
          ...soFar,
          locations: addAnother,
        });
      });
    }
    return gatheredCategoriesMap;
  }
  const homeLocation = getHomeLocation();

  const values = new Array(categories.values());

  return (
    <div className="h-dvh md:w-limiter bg-white overflow-y-hidden">
      <div>
        <div
          id="journal-holder"
          className="flex flex-row snap-x snap-mandatory overflow-x-auto pb-20 gap-4"
        >
          <div
            className="w-full shrink-0 h-dvh snap-start flex flex-col items-center relative"
            style={{
              backgroundImage: "url(/notebook3.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="bg-white w-fit h-fit top-1/4 relative p-4 rounded-lg drop-shadow-sm flex flex-col gap-2"
              style={{
                backgroundImage:
                  "url(data:image/png;base64,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)",
              }}
            >
              <div className="text-center">my</div>
              <div className="font-mono text-gray-800 font-bold text-2xl">
                Anywhere Adventures
              </div>
              <div className="text-center font-mono text-sm">
                with the Library of Congress
              </div>
            </div>
            {addHomeLocationStickers(homeLocation)}
          </div>
          <div className="w-full shrink-0 h-dvh snap-start flex flex-col pl-8 p-2 text-black bg-yellow-100">
            <div className="w-full  flex flex-row justify-between p-2 text-xs text-gray-700 font-mono">
              <div className="font-bold text-xs text-gray-700 font-mono">
                My Anywhere Adventures with the Library of Congress
              </div>
            </div>
            <hr className="w-full border-slate-700 pb-4"></hr>
            <div className="bg-white font-bold w-fit p-1 px-2">
              Locations by theme
            </div>
            {categories.values().map((category, i) => {
              const catMeta = categoryInfo[category.tag];
              return (
                <div className="pb-2" key={i}>
                  <a
                    href={`#page-${category.tag}-0`}
                    onClick={(e) => {
                      e.preventDefault();
                      const page = document.querySelector(
                        `#page-${category.tag}-0`
                      );
                      page.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <div className="font-mono text-gray-900 font-bold underline">
                      {catMeta?.title}
                    </div>
                  </a>
                  {category.locations.map((categoryLocation, j) => {
                    return (
                      <div
                        key={j}
                        className="text-sm font-mono pl-4 text-gray-800"
                      >
                        <a
                          href={`#page-${category.tag}-0`}
                          onClick={(e) => {
                            e.preventDefault();
                            console.log("Trying to scroll:");
                            console.log(`#page-${category.tag}-${j % 4}`);
                            const page = document.querySelector(
                              `#page-${category.tag}-${Math.floor(j / 4)}`
                            );
                            page.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          {categoryLocation.locationTitle ||
                            categoryLocation.title}
                        </a>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            <a
              href={`#explore`}
              onClick={(e) => {
                e.preventDefault();
                const page = document.querySelector(`#explore`);
                page.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="flex flex-row gap-2 text-md font-bold">
                Explore the library more
              </div>
            </a>
            <a
              href={`#about`}
              onClick={(e) => {
                e.preventDefault();
                const page = document.querySelector(`#about`);
                page.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div>About the project</div>
            </a>
          </div>

          {makeJournalPages()}
          <a href="/">
            <div className="fixed left-0 top-1/2 bg-lime-200 p-2 z-30 font-bold drop-shadow-2xl text-black">
              Back to Map
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
