"use client";
import { useState, useEffect, Suspense } from "react";
import JournalPage from "../components/JournalPage";
import SearchParamHandler from "../components/SearchParamHandler";
import JournalNav from "../components/JournalNav";
import { categoryInfo } from "../content/meta";
import { savedLocationToObj } from "../lib/locationHelpers";
import { getHomeLocation, hasLocationBeenVisited } from "../lib/storageHelpers";
import CornerTape from "../components/CornerTape";

export default function Page() {
  const [categories, setCategories] = useState(
    transformSavedLocationsToCategories()
  );

  const [showToc, setShowToc] = useState(false);
  const [pagesExist, setPagesExist] = useState(false);
  const [refSlug, setRefSlug] = useState(undefined);
  const [showSavedItems, setShowSavedItems] = useState(false);

  useEffect(() => {
    // let found = false;
    // if (!categories) return;
    // categories.values().forEach((category, i) => {
    //   console.log(category.locations);
    //   category.locations.forEach((location, j) => {
    //     if (found) {
    //       return;
    //     }
    //     if (location.slug == refSlug) {
    //       found = true;
    //       const page = document.querySelector(
    //         `#page-${category.tag}-${Math.floor(j / 4)}`
    //       );
    //       page.scrollIntoView({ behavior: "smooth" });
    //     }
    //   });
    // });
  }, [refSlug]);

  function handleSearchParams(kvp) {
    setRefSlug(kvp["id"]);
  }

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
    if (!categories) return;
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

  return (
    <div className="h-dvh md:w-limiter bg-white overflow-y-hidden">
      <Suspense>
        <SearchParamHandler paramsToFetch={["id"]} cb={handleSearchParams} />
      </Suspense>
      <div>
        <div
          id="journal-holder"
          className="flex flex-row snap-x snap-mandatory overflow-x-auto pb-20 gap-4"
        >
          {showToc && (
            <div className="absolute z-10 left-0 top-0 bg-white w-full md:w-limiter h-full overflow-y-auto">
              <div className="w-full shrink-0 snap-start flex flex-col p-2 text-black min-h-dvh bg-yellow-100 pb-20">
                <div className="w-full  flex flex-row justify-between p-2 text-xs text-gray-700 font-mono">
                  <div className="font-bold text-xs text-gray-700 font-mono">
                    Table of Contents
                  </div>
                </div>
                <hr className="w-full border-slate-700 pb-4"></hr>
                {categories.values().map((category, i) => {
                  const catMeta = categoryInfo[category.tag];
                  return (
                    <div className="pb-2" key={i}>
                      <a
                        href={`#page-${category.tag}-0`}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowToc(false);
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
                      {category?.locations.map((categoryLocation, j) => {
                        if (!categoryLocation) return;
                        return (
                          <div
                            key={j}
                            className="text-md font-mono text-gray-800 flex flex-row w-full items-center gap-2 justify-between "
                          >
                            <div>
                              {hasLocationBeenVisited(categoryLocation.slug)
                                ? "✅"
                                : "⬜️"}
                            </div>
                            <a
                              className="overflow-x-clip shrink-0 pointer"
                              href={`/${categoryLocation.slug}`}
                            >
                              <div className="flex-none w-fit">
                                {categoryLocation.locationTitle ||
                                  categoryLocation.title}
                              </div>
                            </a>
                            <div className="grow w-0 overflow-clip text-gray-600 text-xs">
                              ........................................................
                            </div>
                            <a
                              className="overflow-x-clip shrink-0 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowToc(false);
                                const page = document.querySelector(
                                  `#page-${category.tag}-${Math.floor(j / 4)}`
                                );
                                page.scrollIntoView({ behavior: "smooth" });
                              }}
                            >
                              <div>{"LOG"}</div>
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
            </div>
          )}

          {makeJournalPages()}
        </div>
      </div>
      <JournalNav
        showToc={showToc}
        setShowToc={setShowToc}
        showSavedItems={showSavedItems}
        setShowSavedItems={setShowSavedItems}
      />
    </div>
  );
}
