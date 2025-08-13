"use client";

// Libraries
import { useState, useEffect, useRef } from "react";
import {
  getHomeLocation,
  clearAll,
  getSettings,
  updateSettings,
} from "../lib/storageHelpers";
import { savedLocationToObj } from "../lib/locationHelpers";
import { getMdx } from "../lib/clientPostHelper";

import gsap from "gsap";

// Components
import SingleStoryPage from "./SingleStoryPage";
import ContentToolBar from "./ContentToolBar";
import { updateRoute } from "../lib/routeHelpers";
import Toast from "./Toast";
import Footer from "./Footer";

export default function ContentPane({
  entranceSlug,
  mainMap,
  paneOpen,
  setPaneOpen,
  currentSlug,
  setCurrentSlug,
  setViewingPin,
  setShowingWelcomeScreen,
  setWelcomeScreenStartIndex,
}) {
  const [paneHeight, setPaneHeight] = useState(getPaneHeight());

  const [contentIndex, setContentIndex] = useState(undefined);
  const scrollValue = useRef();
  const contentPaneRef = useRef(null);
  const [contentArray, setContentArray] = useState(undefined);
  const [reduceAnims, setReduceAnims] = useState(false);

  const [showingMenu, setShowingMenu] = useState(false);
  const [showClearWarning, setShowClearWarning] = useState(false);
  const [toastMessage, setToastMessage] = useState(undefined);
  const menuRef = useRef();
  const menuAnimRef = useRef();
  const startY = useRef();
  const isAtTop = useRef();
  const [homeLoc, setHomeLoc] = useState(undefined);
  const [homeLocationData, setHomeLocationData] = useState(undefined);

  useEffect(() => {
    const loc = getHomeLocation(); // now runs only in client
    setHomeLoc(loc);
    setHomeLocationData(savedLocationToObj(loc));
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setToastMessage(undefined);
    }, 2000);
  }, [toastMessage]);

  // Load up the content based on stored home location
  useEffect(() => {
    if (!homeLocationData) return;
    const locSlugs = homeLocationData.locs.map((l) => {
      return l.slug;
    });
    getMdx(locSlugs, (res) => {
      setContentArray(res);

      // Find the content corresponding to the entrance slug, otherwise use the first one
      let index = res.findIndex((content) => content.slug == entranceSlug);
      if (index < 0) {
        index = 0;
      }

      setContentIndex(index);
    });

    if (!menuRef.current) return;
    menuAnimRef.current = gsap.timeline({ paused: true });

    menuAnimRef.current.fromTo(
      menuRef.current,
      { y: "-100%" },
      {
        y: "0%",
        duration: 0.4,
        ease: "power2.out",
        onReverseComplete: () => {
          menuRef.current.style.visibility = "hidden";
        },
        onStart: () => {
          menuRef.current.style.visibility = "visible";
        },
      }
    );
    setReduceAnims(getSettings().reduceAnims);
  }, [homeLocationData]);

  useEffect(() => {
    if (reduceAnims) {
      if (showingMenu) {
        menuRef.current.style.visibility = "visible";
        menuRef.current.style.transform = "translateY(0%)";
      } else {
        menuRef.current.style.visibility = "hidden";
        menuRef.current.style.transform = "translateY(-100%)";
      }
    } else {
      showMenuAnim(showingMenu);
    }
  }, [showingMenu]);

  function showMenuAnim(shouldShow) {
    const tl = menuAnimRef.current;

    if (!tl) return;
    shouldShow ? tl.play() : tl.reverse();
  }

  useEffect(() => {
    if (!contentArray) return;
    if (contentIndex == undefined) return;

    const loc = contentArray[contentIndex];
    const newSlug = loc.slug;
    updateRoute(`/${loc.location[0].toLowerCase()}/${newSlug}`);
    setCurrentSlug(newSlug);

    // Update slug
    contentPaneRef.current?.scroll({ top: 0, behavior: "smooth" });

    // Update map
    mainMap.flyTo([loc.latlon[1], loc.latlon[0]], loc.zoom, false);
  }, [contentIndex]);

  function setIndexFromSlug(slug) {
    if (!contentArray || !slug) return;
    const index = contentArray.findIndex((content) => content.slug == slug);
    if (index >= 0) {
      setContentIndex(index);
    }
  }

  useEffect(() => {
    if (entranceSlug) {
      setIndexFromSlug(entranceSlug);
    } else if (contentArray) {
      setContentIndex(0);
      setCurrentSlug(contentArray[0].slug);
    }
  }, [entranceSlug, contentArray]);

  useEffect(() => {
    setIndexFromSlug(currentSlug);
  }, [currentSlug, contentArray]);

  function focusOnPin(slug, post) {
    setPaneOpen(false);
    const pin = mainMap.getPinFromSlug(slug);
    console.log(pin);
    mainMap.flyTo([post.latlon[1], post.latlon[0]], post.zoom, true);
    setViewingPin({ mdx: post, pin: pin });
  }

  function getPaneHeight() {
    if (!paneOpen) {
      return "20%";
    } else {
      return "100%";
    }
  }

  useEffect(() => {
    setPaneHeight(getPaneHeight());
  }, [paneOpen]);

  return (
    <div
      style={{ height: paneHeight }}
      className={`md:w-limiter w-screen bg-white fixed self-end drop-shadow-2xl shadow-t-lg  flex flex-col ${
        reduceAnims ? "transition-none" : "transition-[height]"
      } ease-linear z-10`}
      id="pane"
    >
      <script src="https://cdn.jsdelivr.net/gh/MarketingPipeline/Markdown-Tag/markdown-tag.js"></script>

      <div
        className="fixed pt-12 z-40 top-0 left-0 w-full md:w-limiter h-dvh bg-white overflow-y-auto border-2 border-black  rounded-b-md"
        ref={menuRef}
        style={{ visibility: "hidden" }}
      >
        <div className="bg-white flex flex-col justify-between h-full gap-2 text-black font-bold overflow-y-auto">
          <div className="flex flex-col pb-3">
            <div className="w-full text-center text-lg">Menu</div>
            <hr></hr>
            <div>
              <div className=" bg-lime-100 px-2 pt-3">Settings</div>
              <hr className="border-gray-300 pb-2"></hr>
            </div>
            <div className="flex flex-col gap-2 px-2">
              <label
                className="flex flex-row gap-2 items-baseline"
                onClick={() => {}}
              >
                <input
                  type="checkbox"
                  checked={reduceAnims}
                  onChange={(e) => {
                    updateSettings("reduceAnims", e.target.checked);
                    setReduceAnims(e.target.checked);
                  }}
                />
                <div>Reduce animations</div>
              </label>
              <div>
                <div className="text-gray-400 font-mono text-xs font-light">
                  Home Location
                </div>
                <div className="flex flex-row items-baseline gap-4">
                  <div className="text-md text-gray-800 ">{homeLoc}</div>
                  <button
                    className="underline text-black"
                    onClick={() => {
                      updateRoute(`/`);
                      setShowingWelcomeScreen(true);
                      setWelcomeScreenStartIndex(2);
                    }}
                  >
                    <div>Change</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-gray-700">
            <div>
              <hr className="border-gray-300"></hr>
              <div className="px-2 text-black bg-lime-100 pt-3">
                Want more Anywhere Adventures?
              </div>
              <hr></hr>
            </div>
            <div className="flex flex-col gap-4">
              <div className="px-2">
                <div className=" bg-white border-lime-300 p-2  rounded-lg border-2 flex flex-col items-center drop-shadow-sm font-normal">
                  <h1 className=" py-2 font-bold">Try doing research</h1>
                  <hr className="w-full border-lime-300 pb-2"></hr>
                  <div>words words words words words words words words </div>
                  <a className="underline font-light pt-2">
                    Link to research guide
                  </a>
                </div>
              </div>

              <div className="px-2">
                <div className=" bg-white border-lime-300 p-2  rounded-lg border-2 flex flex-col items-center drop-shadow-sm  font-normal">
                  <h1 className="py-2 font-bold">
                    Have a story you want to share?
                  </h1>
                  <hr className="w-full border-lime-300 pb-2"></hr>
                  <div>words words words words words words words words </div>
                </div>
              </div>
              <div className="px-2">
                <div className="bg-lime-300 p-2  rounded-lg border-2 border-gray-800 flex flex-col items-center drop-shadow-sm">
                  <h1 className="text-2xl py-3 font-bold">
                    Nominate your hometown
                  </h1>
                  <hr className="w-full border-lime-600 pb-2"></hr>
                  <div>words words words words words words words words </div>
                  <a className="underline font-light pt-2">
                    Nominate your hometown
                  </a>
                </div>
              </div>
            </div>
            <button
              className="p-2 m-2 bg-red-600 active:bg-red-700 text-white rounded-lg border-2 border-gray-800"
              onClick={() => {
                setShowClearWarning(true);
              }}
            >
              <div>Clear all data</div>
            </button>
            <Footer />
          </div>
        </div>
      </div>
      {showClearWarning && (
        <div className="fixed bg-white/90 w-full h-full flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-white flex flex-col gap-2 w-4/5 p-3 border-2 border-gray-800 ">
            <div className="font-bold text-center text-xl pb-2">
              Are you sure you want to clear all your data?
            </div>
            <div>
              This action cannot be undone. All your saved visits and archive
              items will be deleted.
            </div>
            <div className="flex flex-row gap-2 w-full">
              <button
                className="bg-red-600 active:bg-red-700 font-bold text-white py-1 px-2 grow border-2 border-gray-800 rounded-lg"
                onClick={() => {
                  clearAll();
                  setShowingMenu(false);
                  setShowingWelcomeScreen(true);
                  setShowClearWarning(false);
                  updateRoute(`/`);
                }}
              >
                Yes, delete
              </button>
              <button
                onClick={() => {
                  setShowClearWarning(false);
                }}
                className="bg-white active:bg-lime-100 font-bold grow py-1 px-2 border-2 border-gray-400 rounded-lg"
              >
                No, take me back
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="h-full w-full">
        <div className="w-full text-2xl font-bold fixed z-40">
          {contentArray && (
            <ContentToolBar
              post={contentArray[contentIndex]}
              paneOpen={paneOpen}
              setPaneOpen={setPaneOpen}
              focusOnPin={focusOnPin}
              showingMenu={showingMenu}
              setShowingMenu={setShowingMenu}
              setViewingPin={setViewingPin}
              mainMap={mainMap}
            />
          )}
        </div>
        <div
          aria-disabled={!paneOpen}
          className={`w-full h-full  overflow-x-hidden overflow-y-auto flex flex-col z-10`}
          style={{ paddingTop: "0rem" }}
          id="content-pane"
          ref={contentPaneRef}
          onDrag={(e) => {
            e.preventDefault();
            setPaneOpen(true);
          }}
          onClick={() => {
            setPaneOpen(true);
          }}
          onTouchStart={(e) => {
            startY.current = e.touches[0].clientY;
            isAtTop.current = contentPaneRef.current.scrollTop === 0;
          }}
          onTouchMove={(e) => {
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - startY.current;
            if (deltaY > 30) {
              console.log(deltaY);
              if (isAtTop.current && deltaY > 10) setPaneOpen(false);
            }
          }}
        >
          <SingleStoryPage
            currentSlug={currentSlug}
            setCurrentSlug={setCurrentSlug}
            entranceSlug={entranceSlug}
            setPaneOpen={setPaneOpen}
            scrollRef={scrollValue}
            paneOpen={paneOpen}
            contentPaneRef={contentPaneRef}
            contentIndex={contentIndex}
            contentArray={contentArray}
            setContentIndex={setContentIndex}
            setViewingPin={setViewingPin}
            mainMap={mainMap}
            setToastMessage={setToastMessage}
          />
          {toastMessage && <Toast message={toastMessage} />}
        </div>
      </div>
    </div>
  );
}
