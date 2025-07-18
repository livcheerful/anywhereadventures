"use client";
import { useState, useEffect } from "react";
import { getAllLCItems } from "../lib/storageHelpers";
import LOCItem from "./mdx/LOCItem";
export default function JournalNav({
  showToc,
  setShowToc,
  showSavedItems,
  setShowSavedItems,
}) {
  const [savedLcItems, setSavedLcItems] = useState(undefined);

  useEffect(() => {
    const allItemsObj = getAllLCItems();
    const asArray = Object.keys(allItemsObj).map((k) => {
      console.log(allItemsObj[k]);
      return allItemsObj[k];
    });
    setSavedLcItems(asArray);
  }, []);
  console.log(savedLcItems);
  return (
    <div className="absolute bottom-0 ">
      <div className="z-20 flex flex-row justify-between gap-20 pr-5 p-2 w-full md:w-limiter h-10 bg-lime-200 border-t-black border-2 drop-shadow-xl">
        <a className="grow" href="/">
          <div className="text-sm font-black text-gray-800 underline">
            BACK TO MAP
          </div>
        </a>
        <button
          onClick={() => {
            setShowSavedItems(!showSavedItems);
          }}
          className="text-sm font-black text-gray-800"
        >
          <div className="underline">SAVED ITEMS</div>
        </button>
        <button
          onClick={(e) => {
            setShowToc(!showToc);
          }}
          className="absolute z-30 w-16 h-16 border-2 border-black drop-shadow-sm -bottom-3 rounded-full bg-white left-1/2 -translate-x-1/2"
        ></button>
      </div>
      {showSavedItems && (
        <div className="absolute bg-white bottom-10 w-full md:w-limiter left-0 ">
          <div className="sticky text-xs font-bold p-1 border-y-2 border-black bg-lime-200 w-full ">
            SAVED ITEMS
          </div>
          <div className="flex flex-row w-full h-72 overflow-y-clip overflow-x-auto">
            {savedLcItems?.map((item, i) => {
              console.log(item);
              return (
                <div className="h-full w-fit p-2 shrink-0 grow" key={i}>
                  <a href={`/${item.fromSlug}`}>
                    <div>back to story</div>
                  </a>
                  <a href={item.link}>source</a>
                  <img src={item.image} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
