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

export default function ContentPane({
  entranceSlug,
  mainMap,
  paneOpen,
  setPaneOpen,
  currentSlug,
  setCurrentSlug,
  setViewingPin,
  setShowingWelcomeScreen,
}) {
  const [paneHeight, setPaneHeight] = useState(getPaneHeight());

  const [contentIndex, setContentIndex] = useState(0);
  const scrollValue = useRef();
  const contentPaneRef = useRef(null);
  const [contentArray, setContentArray] = useState(undefined);
  const [reduceAnims, setReduceAnims] = useState(false);

  const [showingMenu, setShowingMenu] = useState(false);
  const menuRef = useRef();
  const menuAnimRef = useRef();
  const startY = useRef();
  const isAtTop = useRef();

  // Load up the content based on stored home location
  useEffect(() => {
    const homeLoc = getHomeLocation();
    const homeLocationData = savedLocationToObj(homeLoc);
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

    shouldShow ? tl.play() : tl.reverse();
  }

  useEffect(() => {
    if (!contentArray) return;
    if (!contentIndex) return;

    const newSlug = contentArray[contentIndex].slug;
    updateRoute(`/${newSlug}`);
    setCurrentSlug(newSlug);
    // Update slug
    contentPaneRef.current?.scroll({ top: 0, behavior: "smooth" });
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
      return "23%";
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
        className="fixed pt-16 z-40 top-0 left-0 w-full md:w-limiter h-dvh bg-white overflow-y-auto"
        ref={menuRef}
        style={{ visibility: "hidden" }}
      >
        <div className="bg-white flex flex-col gap-2 p-2 text-black font-bold">
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
          <button
            className="p-2 bg-yellow-200 rounded-lg border-2 border-gray-800"
            onClick={() => {
              updateRoute(`/`);
              setShowingWelcomeScreen(true);
            }}
          >
            <div>Change home location</div>
          </button>
          <button
            className="p-2 bg-yellow-200 rounded-lg border-2 border-gray-800"
            onClick={() => {
              clearAll();
              setShowingMenu(false);
              setShowingWelcomeScreen(true);
            }}
          >
            <div>Clear all data</div>
          </button>
          <hr className="border-gray-300 pb-2"></hr>
          <div className="bg-lime-300 p-2 rounded-lg border-2 border-gray-800 flex flex-col items-center">
            <h1 className="text-2xl">CTA</h1>
            <div>words words words words words words words words </div>
            <a className="underline">Nominate your hometown</a>
          </div>
        </div>
      </div>
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
          className={`w-full h-full  overflow-x-hidden ${
            paneOpen ? "overflow-y-auto" : "overflow-y-hidden"
          } flex flex-col z-10`}
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
