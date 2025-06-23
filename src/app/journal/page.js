"use client";
import {
  getAllLCItems,
  removeLCItem,
  getAllContent,
  getAllPages,
} from "../lib/storageHelpers";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BigLink from "../components/mdx/BigLink";
import Comic from "../components/mdx/Comic";
import JournalPage from "../components/JournalPage";
import { categoryInfo } from "../content/meta";
import { getHomeLocation } from "../lib/storageHelpers";
import CornerTape from "../components/CornerTape";

export default function Page() {
  const [allItems, setAllItems] = useState(getAllLCItems());
  const [allContent, setAllSlugs] = useState(getAllContent());
  const [allPages, setAllPages] = useState(getAllPages());

  const [categories, setCategories] = useState(
    transformSavedLocationsToCategories()
  );

  function addHomeLocationStickers(homeLocation) {
    console.log(homeLocation);
    switch (homeLocation) {
      case "Seattle":
        return (
          <div className="bg-yellow-300 p-2 px-8 absolute -rotate-12 right-7 bottom-1/3 ">
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
                className="w-56 h-auto rotate-2 drop-shadow-2xl"
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

  function transformSavedLocationsToCategories() {
    const gatheredCategoriesMap = new Map();
    for (let index in Object.keys(allContent)) {
      const slug = Object.keys(allContent)[index];
      const mdx = allContent[slug];
      // console.log(mdx);
      mdx.tags.forEach((tag, i) => {
        // console.log(tag);
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

  return (
    <div className="h-dvh md:w-limiter bg-white overflow-y-hidden">
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
          <div className="bg-white font-bold w-fit">Locations by theme</div>
          {categories.values().map((category, i) => {
            const catMeta = categoryInfo[category.tag];
            return (
              <a
                key={i}
                href={`#page-${category.tag}-0`}
                onClick={(e) => {
                  e.preventDefault();
                  const page = document.querySelector(
                    `#page-${category.tag}-0`
                  );
                  console.log(page);
                  page.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="font-mono text-gray-900 font-bold underline">
                  {catMeta.title}
                </div>
              </a>
            );
          })}
          {/* {Object.keys(allContent).map((slug, k) => {
            const post = allContent[slug];
            return (
              <a
                key={k}
                href={`#page-${k}`}
                onClick={(e) => {
                  e.preventDefault();
                  const page = document.querySelector(`#page-${k}`);
                  console.log(page);
                  page.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="flex flex-row gap-2 text-md font-bold">
                  <div>{allPages[slug] ? "✅" : "⬜️"}</div>
                  <div> {post.title}</div>
                </div>
              </a>
            );
          })} */}

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

        {categories.values().map((category, i) => {
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
                  category={category}
                  categoryMeta={catMeta}
                  locations={category.locations.slice(
                    base,
                    base + numberPerPage
                  )}
                />
              </div>
            );
          }
          return pages;
        })}

        {/* {Object.keys(allContent).map((slug, k) => {
          const post = allContent[slug];
          const page = allPages[slug];
          if (!page) {
            // gotta collect still
          }
          return (
            <div
              key={k}
              id={`page-${k}`}
              className="w-full shrink-0 snap-start flex flex-col items-center justify-around"
              style={{
                backgroundImage: `url(/tempnotebookpage.jpg)`,
                backgroundSize: "cover",
              }}
            >
              {page && <img src={page.image} style={{ maxWidth: "20rem" }} />}
              <div className=" text-black text-lg font-bold bg-white p-2 w-fit">
                {post.title}
              </div>
            </div>
          );
        })}
        <div
          className="w-full shrink-0 snap-start flex flex-col items-center justify-around h-dvh overflow-y-auto text-black"
          style={{
            backgroundImage: `url(/tempnotebookpage.jpg)`,
            backgroundSize: "cover",
          }}
        >
          <div id="explore" className="text-black text-lg font-bold p-2 w-fit">
            Explore the Library more
          </div>
          <div>
            <Comic
              position="right"
              image="/comics/Vivian.png"
              speechBubbles={[
                {
                  text: "If you want to find cool items in the Library of Congress yourself, you can try out these research guides!",
                },
              ]}
            />
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            <BigLink
              link="https://guides.loc.gov/architecture-design-engineering-collections"
              thumbnail="/placeholderThumbnail.png"
              title="Architecture, Design and Engineering Collections"
            />
            <BigLink
              link="https://guides.loc.gov/illinois-state-guide"
              thumbnail="/placeholderThumbnail.png"
              title="Illinois State Research Guide"
            />
            <BigLink
              link="https://guides.loc.gov/washington-state-guide"
              thumbnail="/placeholderThumbnail.png"
              title="Washington State Research Guide"
            />
            <BigLink
              link="https://guides.loc.gov/wyoming-state-guide"
              thumbnail="/placeholderThumbnail.png"
              title="Wyoming State Research Guide"
            />
          </div>
          <div>
            <Comic
              position="right"
              image="/comics/Vivian.png"
              speechBubbles={[
                {
                  text: "These were made by Library of Congress staff, and are a great starting point.",
                },
              ]}
            />
          </div>
        </div>
        <div
          id="about"
          className="w-full shrink-0 snap-start flex flex-col items-center justify-around"
          style={{
            backgroundImage: `url(/tempnotebookpage.jpg)`,
            backgroundSize: "cover",
          }}
        >
          <div className=" text-black text-lg font-bold bg-white p-2 w-fit">
            About the project
          </div>
        </div> */}
        <div className="fixed left-0 top-1/2 bg-white p-2 z-30">
          Back to Map
        </div>
      </div>
    </div>
  );
}
