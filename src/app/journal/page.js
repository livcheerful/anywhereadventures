"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import JournalPage from "../components/JournalPage";
import SearchParamHandler from "../components/SearchParamHandler";
import Box from "../components/ui/Box";
import BaseButton from "../components/ui/BaseButton";
import JournalNav from "../components/JournalNav";
import { categoryInfo } from "../content/meta";
import gsap from "gsap";
import { savedLocationToObj } from "../lib/locationHelpers";
import {
  getHomeLocation,
  hasLocationBeenVisited,
  haveSeenJournal,
  setHaveSeenJournal,
  clearNewTravelLogPages,
} from "../lib/storageHelpers";
import CornerTape from "../components/CornerTape";

export default function Page() {
  const [categories, setCategories] = useState(
    transformSavedLocationsToCategories()
  );

  const [showToc, setShowToc] = useState(false);
  const [pagesExist, setPagesExist] = useState(false);
  const [refSlug, setRefSlug] = useState(undefined);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [screenIdx, setScreenIdx] = useState(0);
  const tocRef = useRef();
  const tocAnim = useRef();

  useEffect(() => {
    setShowIntro(!haveSeenJournal());
    clearNewTravelLogPages();
  }, []);

  function addHomeLocationStickers() {
    const homeLocation = getHomeLocation();
    switch (homeLocation) {
      case "Seattle":
        return [
          <div
            className="rotate-3 w-48 h-fit bottom-10 absolute left-3 "
            key={1}
          >
            <CornerTape directions={{ ne: true, nw: true }}>
              <img src="/loc/seattle/montlakeBridge/canalRoutes.png" />
            </CornerTape>
          </div>,
          <div
            className="bg-yellow-300 p-2 px-8 absolute -rotate-12 right-7 bottom-1/3 text-black font-bold"
            key={2}
          >
            Seattle
          </div>,
          <div
            className="-rotate-6 w-48 h-fit top-10 absolute right-0 "
            key={3}
          >
            <CornerTape directions={{ nw: true, se: true }}>
              <img src="/loc/regrade-results.jpg" />
            </CornerTape>
          </div>,
        ];
      case "Chicago":
        break;
      case "Southeast Wyoming":
        const wyStickers = [];
        wyStickers.push(
          <div className="absolute left-3 bottom-1/3 " key={1}>
            <CornerTape>
              <img
                className="w-56 h-auto rotate-2 drop-shadow-2xl text-black"
                src="/loc/sewy/wypack.png"
              />
            </CornerTape>
          </div>
        );
        wyStickers.push(
          <div
            className="bg-yellow-300 p-2 px-8 absolute -rotate-12 right-7 bottom-1/3 font-bold text-lg"
            key={2}
          >
            Wyoming
          </div>
        );
        return wyStickers;
        break;
      default:
        break;
    }
  }

  const screens = [
    <div className="flex flex-col justify-between h-full pb-2">
      <div className="flex flex-col">
        <img
          src="/placeholderThumbnail.png"
          className="border-b-2 border-gray-800"
        />
        <div className="p-2">
          <h1 className="font-bold text-lg">This is your travel log</h1>
          <div>
            As you visit story locations, collect photos and fill up your logs.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <BaseButton
          onClick={() => {
            setScreenIdx(screenIdx + 1);
          }}
          classes={["bg-lime-200"]}
        >
          Next
        </BaseButton>
      </div>
    </div>,
    <div className="flex flex-col justify-between h-full pb-2">
      <div className="flex flex-col">
        <img
          src="/placeholderThumbnail.png"
          className="border-b-2 border-gray-800"
        />
        <div className="p-2">
          <h1 className="font-bold text-lg">
            See where you haven't visited yet
          </h1>
          <div>
            Swipe to see the logs you've created and the places you still
            haven't been. You can also navigate via the table of contents.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <BaseButton
          onClick={() => {
            setScreenIdx(screenIdx + 1);
          }}
          classes={["bg-lime-200"]}
        >
          Next
        </BaseButton>

        <button
          onClick={() => {
            setScreenIdx(screenIdx - 1);
          }}
          className="underline text-sm"
        >
          Back
        </button>
      </div>
    </div>,
    <div className="flex flex-col justify-between h-full pb-2">
      <div className="flex flex-col">
        <img
          src="/placeholderThumbnail.png"
          className="border-b-2 border-gray-800"
        />
        <div className="p-2">
          <h1 className="font-bold text-lg">Save archive items for later</h1>
          <div>
            You can also see all your saved archives items here for easy
            reference later. You can also use them in your travel logs as
            stickers.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <BaseButton
          onClick={() => {
            setShowIntro(false);
            setHaveSeenJournal(true);
          }}
          classes={["bg-lime-200"]}
        >
          Start
        </BaseButton>
        <button
          onClick={() => {
            setScreenIdx(screenIdx - 1);
          }}
          className="underline text-sm"
        >
          Back
        </button>
      </div>
    </div>,
  ];

  useEffect(() => {
    if (!tocRef.current) return;
    tocAnim.current = gsap.timeline({ paused: true });

    tocAnim.current.fromTo(
      tocRef.current,
      { y: "100%" },
      {
        y: "0%",
        duration: 0.4,
        ease: "power2.out",
        onReverseComplete: () => {
          tocRef.current.style.visibility = "hidden";
        },
        onStart: () => {
          tocRef.current.style.visibility = "visible";
        },
      }
    );
  }, []);

  useEffect(() => {
    if (!tocAnim.current) return;
    if (showToc) {
      tocAnim.current.play();
    } else {
      tocAnim.current.reverse();
    }
  }, [showToc]);

  useEffect(() => {
    let found = false;
    if (!categories) return;
    [...categories.values()].forEach((category, i) => {
      category.locations.forEach((location, j) => {
        if (found) {
          return;
        }
        if (location.slug == refSlug) {
          found = true;
          const page = document.querySelector(
            `#page-${category.tag}-${Math.floor(j / 4)}`
          );
          page.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }, [refSlug]);

  function handleSearchParams(kvp) {
    setRefSlug(kvp["id"]);
  }

  function makeJournalPages() {
    let pageCount = 1;
    if (!categories || !categories.values()) return;
    const allPages = [...categories.values()].map((category, i) => {
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
            className="w-full shrink-0"
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
    <div className="h-dvh md:w-limiter relative bg-white overflow-y-hidden">
      {showIntro && (
        <div className="w-full h-full absolute top-0 left-0 bg-white/40 z-20 border-2 border-black">
          <Box
            isModal
            className={"bg-yellow-200 left-[12.5%] top-[18%] h-2/3 w-3/4"}
          >
            {screens[screenIdx]}
          </Box>
        </div>
      )}
      <Suspense>
        <SearchParamHandler paramsToFetch={["id"]} cb={handleSearchParams} />
      </Suspense>
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
            }}
          >
            <div className="bg-yellow-200 border-2 border-gray-800 w-fit h-fit top-1/4 relative p-4 rounded-lg drop-shadow-sm flex flex-col gap-2">
              <div className="text-center text-black">my</div>
              <div className="font-mono text-gray-800 font-bold text-2xl">
                Anywhere Adventures
              </div>
              <div className="text-center font-mono text-sm text-black">
                with the Library of Congress
              </div>
            </div>
            {addHomeLocationStickers()}
          </div>
          {makeJournalPages()}
          <div
            ref={tocRef}
            style={{ visibility: "hidden" }}
            className="fixed z-10 left-0 top-0 bg-white w-full md:w-limiter h-full overflow-y-auto drop-shadow-2xl"
          >
            <div className="w-full shrink-0 snap-start flex flex-col p-2 text-black min-h-dvh bg-yellow-100 pb-20">
              <div className="w-full  flex flex-row justify-between p-2 text-xs text-gray-700 font-mono">
                <div className="font-bold text-xs text-gray-700 font-mono">
                  Table of Contents
                </div>
              </div>
              <hr className="w-full border-slate-700 pb-4"></hr>
              {categories &&
                [...categories.values()].map((category, i) => {
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
                              <div className="flex-none h-fit text-sm w-fit text-wrap">
                                {categoryLocation.locationTitle ||
                                  categoryLocation.title}
                              </div>
                            </a>
                            <div className="grow w-0 overflow-clip text-gray-600 text-xs">
                              ...........................................................................
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
                              <div className="font-black">{"LOG"}</div>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          </div>
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
