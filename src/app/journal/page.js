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

export default function Page() {
  const [allItems, setAllItems] = useState(getAllLCItems());
  const [allContent, setAllSlugs] = useState(getAllContent());
  const [allPages, setAllPages] = useState(getAllPages());

  const [categories, setCategories] = useState(
    transformSavedLocationsToCategories()
  );

  function transformSavedLocationsToCategories() {
    console.log("VVN gather categories from locations");
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

  return (
    <div className="h-dvh md:w-limiter bg-white overflow-y-hidden">
      <div
        id="journal-holder"
        className="flex flex-row snap-x snap-mandatory overflow-x-auto pb-20 gap-4"
      >
        <div
          className="w-full shrink-0 h-dvh snap-start"
          style={{
            backgroundImage: "url(/blanknotebook.png)",
            backgroundSize: "cover",
          }}
        ></div>
        <div
          className="w-full shrink-0 h-dvh snap-start flex flex-col pl-8 p-2 text-black"
          style={{
            backgroundImage: "url(/tempnotebookpage.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="bg-white font-bold w-fit">
            My Adventures with the Library of Congress
          </div>
          {Object.keys(allContent).map((slug, k) => {
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
              <div key={i} className="w-full h-full shrink-0">
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
      </div>
    </div>
  );
}
