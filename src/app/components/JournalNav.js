"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { getAllLCItems, getSettings } from "../lib/storageHelpers";
import LOCItem from "./mdx/LOCItem";
import LibraryIndexCard from "./scrapbook/LibraryIndexCard";
import { useNotifications } from "../lib/NotificationsContext";

export default function JournalNav({
  showToc,
  setShowToc,
  showSavedItems,
  setShowSavedItems,
}) {
  const [savedLcItems, setSavedLcItems] = useState(undefined);
  const menuAnimTl = useRef();
  const savedItemsRef = useRef();
  const savedItemsAnim = useRef();
  const [reduceAnims, setReduceAnims] = useState(true);
  const { notifications, removeAllNotificationsOfType } = useNotifications();

  const [hasNewSavedItems, setHasNewSavedItems] = useState(false);
  const [hasNewEntries, setHasNewEntries] = useState(false);
  const newSavedItems = notifications.filter((i) => i.type === "lcItem");
  const newEntries = notifications.filter((i) => i.type === "entry");
  useEffect(() => {
    setHasNewSavedItems(notifications.some((i) => i.type === "lcItem"));
    setHasNewEntries(notifications.some((i) => i.type === "entry"));
  }, [notifications]);
  useEffect(() => {
    setReduceAnims(getSettings().reduceAnims);
    const allItemsObj = getAllLCItems();
    const asArray = Object.keys(allItemsObj).map((k) => {
      return allItemsObj[k];
    });
    setSavedLcItems(asArray);

    const tl = gsap.timeline({ paused: true });

    tl.to(
      "#line1",
      {
        y: 15,
        rotate: 45,
        transformOrigin: "50% 50%",
        duration: 0.3,
      },
      0
    );

    tl.to(
      "#line3",
      {
        y: -15,
        x: 0,
        rotate: -45,
        transformOrigin: "50% 50%",
        duration: 0.3,
      },
      0
    );

    tl.to(
      "#line2",
      {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "50% 50%",
        duration: 0.3,
      },
      0
    );
    menuAnimTl.current = tl;

    if (!savedItemsRef.current) return;
    savedItemsAnim.current = gsap.timeline({ paused: true });

    savedItemsAnim.current.fromTo(
      savedItemsRef.current,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.4,
        ease: "power2.out",
        onReverseComplete: () => {
          savedItemsRef.current.style.visibility = "hidden";
        },
        onStart: () => {
          savedItemsRef.current.style.visibility = "visible";
        },
      }
    );
  }, []);

  useEffect(() => {
    if (reduceAnims) {
      const l1 = document.querySelector("#line1");
      const l2 = document.querySelector("#line2");
      const l3 = document.querySelector("#line3");
      if (showToc) {
        l1.style.transform = "translateY(15px) rotate(45deg)";
        l1.style.transformOrigin = "50% 50%";

        l2.style.visibility = "hidden";

        l3.style.transform = "translateY(-15px) rotate(-45deg)";
        l3.style.transformOrigin = "50% 50%";
      } else {
        l1.style.transform = "translateY(0px) rotate(-0deg)";
        l1.style.transformOrigin = "50% 50%";

        l2.style.visibility = "visible";

        l3.style.transform = "translateY(0px) rotate(0deg)";
        l3.style.transformOrigin = "50% 50%";
      }
    } else {
      showMenuAnim(showToc);
    }
  }, [showToc]);

  useEffect(() => {
    if (!savedItemsAnim.current) return;
    const reduceAnims = getSettings().reduceAnims;
    if (reduceAnims) {
      if (showSavedItems) {
        savedItemsRef.current.style.visibility = "visible";
        savedItemsRef.current.style.transform = "translateY(0%)";
      } else {
        savedItemsRef.current.style.visibility = "hidden";
      }
    } else {
      if (showSavedItems) {
        savedItemsAnim.current.play();
      } else {
        savedItemsAnim.current.reverse();
      }
    }
  }, [showSavedItems]);

  function showMenuAnim(shouldShow) {
    const tl = menuAnimTl.current;
    shouldShow ? tl.play() : tl.reverse();
  }

  function compileLibraryItemStats(items) {
    if (!items) return {};
    const maps = items.filter((i) => i.type == "map").length;
    const manuscripts = items.filter((i) => i.type == "manuscript").length;
    const pnp = items.filter((i) => i.type == "pnp").length;
    const newspaper = items.filter((i) => i.type == "newspaper").length;
    const other = items.filter((i) => i.type == undefined).length;

    return {
      manuscripts: manuscripts,
      maps: maps,
      pnp: pnp,
      newspaper: newspaper,
      other: other,
    };
  }
  const lcItemStats = compileLibraryItemStats(savedLcItems);
  return (
    <div className="absolute bottom-0 h-14 overflow-clip z-10 w-full md:w-limiter">
      <div className="absolute bottom-0 flex flex-row justify-between gap-20 pr-5 p-2 w-full md:w-limiter h-10 bg-green-800 border-t-black border-2 z-10">
        <div className="text-sm font-black grow text-white underline">
          <a className="" href="/">
            BACK TO MAP
          </a>
        </div>
        <button
          onClick={() => {
            setShowSavedItems(!showSavedItems);
            setShowToc(false);
            removeAllNotificationsOfType("lcItem");
          }}
          className="text-sm font-black text-white"
        >
          <div className="underline ">SAVED ITEMS</div>
          {hasNewSavedItems && (
            <div>
              <div
                className={`absolute bg-red-400 drop-shadow-lg right-0 top-1 rounded-full w-3 h-3 ${
                  !reduceAnims && !showSavedItems && "animate-gentle-ping"
                } `}
              ></div>
              <div className="absolute bg-red-500 drop-shadow-lg right-0 top-1 rounded-full w-3 h-3"></div>
            </div>
          )}
        </button>
        <button
          onClick={(e) => {
            setShowToc(!showToc);
            setShowSavedItems(false);
          }}
          className="absolute flex flex-col items-center justify-center z-40 w-16 h-16 border-2 border-black drop-shadow-xl -bottom-3 rounded-full bg-amber-300 left-1/2 -translate-x-1/2"
        >
          <svg
            viewBox="0 0 100 100"
            id="menu-icon"
            className="fill-gray-800 w-10 h-10"
          >
            <rect
              className="line"
              id="line1"
              x="20"
              y="30"
              width="60"
              height="8"
              rx="5"
            />
            <rect
              className="line"
              id="line2"
              x="20"
              y="45"
              width="60"
              height="8"
              rx="5"
            />
            <rect
              className="line"
              id="line3"
              x="20"
              y="60"
              width="60"
              height="8"
              rx="5"
            />
          </svg>
          {hasNewEntries && (
            <div>
              <div
                className={`absolute bg-red-400 drop-shadow-lg right-0 top-1 rounded-full w-3 h-3 ${
                  !reduceAnims && !showToc && "animate-gentle-ping"
                } `}
              ></div>
              <div className="absolute bg-red-500 drop-shadow-lg right-0 top-1 rounded-full w-3 h-3"></div>
            </div>
          )}
        </button>
      </div>

      <div
        className="fixed bg-white bottom-10 w-full md:w-limiter left-0 z-0"
        ref={savedItemsRef}
        style={{ visibility: "hidden" }}
      >
        <div className="sticky h-10 font-bold p-1 px-2 border-y-2 border-black flex flex-row justify-between items-center bg-lime-200 w-full text-black">
          <div className="text-md">SAVED ITEMS</div>
          <button
            className="w-4 h-4"
            onClick={() => {
              setShowSavedItems(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
            </svg>
          </button>
        </div>
        <div className="relative">
          <div className="text-black p-2 bg-lime-50 drop-shadow-md">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col h-full justify-end">
                <div className="font-bold text-3xl">
                  {savedLcItems?.length || 0}
                </div>
                <div className="text-gray-500 font-mono text-xs">
                  Archival items saved
                </div>
              </div>
              <div className="grid grid-cols-3 grid-rows-2  w-full gap-1">
                <div className="row-start-1 col-start-1 col-span-1 row-span-1 w-full ">
                  <div className="text-gray-500 font-mono text-xs">
                    Manuscript
                  </div>
                  <div>{lcItemStats.manuscripts}</div>
                </div>
                <div className="row-start-1 col-start-2 col-span-1 row-span-1 w-full">
                  <div className="text-gray-500 font-mono text-xs">Maps</div>
                  <div>{lcItemStats.maps}</div>
                </div>
                <div className="row-start-1 col-start-3 col-span-1 row-span-1 w-full ">
                  <div className="text-gray-500 font-mono text-xs">
                    Newspaper
                  </div>
                  <div>{lcItemStats.newspaper}</div>
                </div>
                <div className="row-start-2 col-start-1 col-span-2 row-span-1 w-full ">
                  <div className="text-gray-500 font-mono text-xs">
                    Print / photograph
                  </div>
                  <div>{lcItemStats.pnp}</div>
                </div>
                <div className="row-start-2 col-start-3 col-span-1 row-span-1">
                  <div className="text-gray-500 font-mono text-xs">Other</div>
                  <div>{lcItemStats.other}</div>
                </div>
              </div>
            </div>
          </div>
          <hr></hr>
          {savedLcItems && savedLcItems.length > 1 && (
            <div className="absolute -bottom-4 right-0 text-black text-xs self-end italic z-20 bg-white/80 px-2">
              &lt;- swipe to see your saved items -&gt;
            </div>
          )}
        </div>
        <div className="flex flex-row w-full h-72 overflow-y-clip overflow-x-auto snap-x snap-mandatory ">
          {!savedLcItems ||
            (savedLcItems.length == 0 && (
              <div className="text-black h-full w-full grow shrink-0 snap-start flex flex-col p-2">
                <div className="w-full text-center font-bold">
                  You don't have any saved items yet!
                </div>
                <div>
                  Read stories and collect archives items here to use them in
                  your travel log entries and for easy reference later.
                </div>
              </div>
            ))}
          {savedLcItems?.map((item, i) => {
            console.log(item);
            return (
              <div className="w-full pt-2 shrink-0  snap-start" key={i}>
                <div className="relative w-full border-2 border-gray-200">
                  <div className="absolute w-full justify-between flex flex-row gap-2 px-1">
                    <a
                      className="flex flex-col items-center justify-center   decoration-black bg-yellow-300 font-mono text-xs font-bold text-black p-1 border-2 border-gray-900 drop-shadow-sm rounded-b-lg"
                      href={`/${item.fromSlug}`}
                    >
                      <div>Open in map</div>
                    </a>
                    <a
                      className="flex flex-col items-center justify-center  underline decoration-white bg-emerald-700 font-mono text-xs font-bold text-white p-1 border-2 border-gray-900 drop-shadow-sm rounded-b-lg"
                      href={item.link}
                      target="_blank"
                    >
                      <div>source</div>
                    </a>
                  </div>
                  <img src={item.image} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
