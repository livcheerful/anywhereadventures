"use client";
import {
  getAllLCItems,
  removeLCItem,
  getAllContent,
  getAllPages,
} from "../lib/storageHelpers";
import { useState, useEffect } from "react";

export default function Page() {
  const [allItems, setAllItems] = useState(getAllLCItems());
  const [allContent, setAllSlugs] = useState(getAllContent());
  const [allPages, setAllPages] = useState(getAllPages());

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
          className="w-full shrink-0 h-dvh snap-start flex flex-col  p-2 text-black"
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
        </div>
        {Object.keys(allContent).map((slug, k) => {
          const post = allContent[slug];
          const page = allPages[slug];
          console.log(post);
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
      </div>
    </div>
  );
}
