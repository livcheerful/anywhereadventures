"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { categoryInfo } from "../content/meta";
import { seattleLocs, seattleByCategory } from "../lib/MdxQueries";
import { updateRoute } from "../lib/routeHelpers";
export default function DiscoverFeed({ setCurrentSlug }) {
  const [expandedCategories, setExpandedCateogires] = useState(new Map());
  const router = useRouter();
  return (
    <div className="w-full h-fit flex gap-2 flex-col  ">
      <div id="explorePane" className=" flex flex-col p-2 gap-3 ">
        {seattleByCategory.map((category, ck) => {
          const isThisExpanded = expandedCategories.has(category.tag);
          const categoryMeta = categoryInfo[category.tag];
          return (
            <div className="category-row" key={ck}>
              <div
                className="text-xl font-bold pb-2 category-row-header"
                categoryname={category.tag}
              >
                {category.tag.toUpperCase()}
              </div>
              {isThisExpanded && (
                <div className="p-3">
                  {categoryMeta && <div>{categoryMeta?.description}</div>}

                  <div className="bg-emerald-400 text-white font-bold p-2 rounded-lg ">
                    Add all to map
                  </div>
                </div>
              )}
              <div className={`flex flex-row overflow-x-auto gap-2`}>
                {category.posts.map((l, k) => {
                  return (
                    <div
                      onClick={() => {
                        // router.replace(`/${l.slug}`);
                        updateRoute(`/${l.slug}`);
                        setCurrentSlug(l.slug);
                      }}
                      key={k}
                      className={`shrink-0 w-3/5  h-[10rem] bg-cover text-md font-extrabold cursor-pointer bg-slate-200 drop-shadow-md rounded-lg flex flex-col items-end`}
                      style={{
                        backgroundImage: `url(${l.cardImage})`,
                      }}
                    >
                      <div className="bg-white/80 w-full px-2 py-1 ">
                        {l.title}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex flex-col items-center pt-3">
                <div
                  onClick={() => {
                    const eC = new Map(expandedCategories);
                    if (isThisExpanded) {
                      // Remove it
                      eC.delete(category.tag);
                    } else {
                      eC.set(category.tag, true);
                    }
                    setExpandedCateogires(eC);
                  }}
                  className="cursor-pointer text-slate-500 flex flex-col items-center"
                >
                  <div className="text-xs font-normal">
                    {isThisExpanded ? "COLLAPSE" : "EXPAND"}
                  </div>
                  <div className="w-3 stroke-slate-500 stroke-2">
                    {isThisExpanded ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <hr className="m-2"></hr>
            </div>
          );
        })}
        <div className="text-xl p-3 font-bold ">All Seattle Stories:</div>
        {seattleLocs.map((l, k) => {
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
