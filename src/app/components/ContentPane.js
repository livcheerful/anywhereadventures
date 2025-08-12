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

  const [contentIndex, setContentIndex] = useState(0);
  const scrollValue = useRef();
  const contentPaneRef = useRef(null);
  const [contentArray, setContentArray] = useState(undefined);
  const [reduceAnims, setReduceAnims] = useState(false);

  const [showingMenu, setShowingMenu] = useState(false);
  const [showClearWarning, setShowClearWarning] = useState(false);
  const menuRef = useRef();
  const menuAnimRef = useRef();
  const startY = useRef();
  const isAtTop = useRef();

  const homeLoc = getHomeLocation();
  const homeLocationData = savedLocationToObj(homeLoc);
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
  }, []);

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
    if (!contentIndex) return;

    const loc = contentArray[contentIndex];
    const newSlug = loc.slug;
    updateRoute(`/${newSlug}`);
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
        className="fixed pt-16 z-40 top-0 left-0 w-full md:w-limiter h-dvh bg-white overflow-y-auto border-2 border-black  rounded-b-md"
        ref={menuRef}
        style={{ visibility: "hidden" }}
      >
        <div className="bg-white flex flex-col justify-between h-full gap-2 text-black font-bold overflow-y-auto">
          <div className="p-2 flex flex-col gap-2">
            <div>Menu</div>
            <hr className="border-gray-300 pb-2"></hr>
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
            <hr className="border-gray-300 pb-2"></hr>
            <div className="text-black">Home Location</div>
            <div className="flex flex-row items-baseline gap-2">
              <div className="text-md text-gray-800 font-mono">{homeLoc}</div>
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
            <button
              className="p-2 bg-red-600 text-white rounded-lg border-2 border-gray-800"
              onClick={() => {
                setShowClearWarning(true);
              }}
            >
              <div>Clear all data</div>
            </button>

            <hr className="border-gray-300 pb-2"></hr>
          </div>
          <div className="flex flex-col gap-2">
            <div className="px-2">
              <div className="bg-lime-300 p-2  rounded-lg border-2 border-gray-800 flex flex-col items-center">
                <h1 className="text-2xl">CTA</h1>
                <div>words words words words words words words words </div>
                <a className="underline">Nominate your hometown</a>
              </div>
            </div>
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
              This action cannot be undone. All your saved visits will be
              deleted.
            </div>
            <div className="flex flex-row gap-2 w-full">
              <button
                className="bg-red-600 font-bold text-white py-1 px-2 grow border-2 border-gray-800 rounded-lg"
                onClick={() => {
                  clearAll();
                  setShowingMenu(false);
                  setShowingWelcomeScreen(true);
                  setShowClearWarning(false);
                }}
              >
                Yes, delete
              </button>
              <button
                onClick={() => {
                  setShowClearWarning(false);
                }}
                className="bg-white font-bold grow py-1 px-2 border-2 border-gray-400 rounded-lg"
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
            console.log(contentPaneRef.current);
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
          />
        </div>
      </div>
    </div>
  );
}
