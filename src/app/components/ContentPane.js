"use client";

// Libraries
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Map, Marker, Popup } from "maplibre-gl";
import { getHomeLocation } from "../lib/storageHelpers";
import { savedLocationToObj } from "../lib/locationHelpers";
import { getMdx } from "../lib/clientPostHelper";

// Components
import RiverFeed from "./RiverFeed";
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

  const [showingMenu, setShowingMenu] = useState(false);

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
  }, []);

  useEffect(() => {
    console.log(contentIndex);
    if (!contentArray) return;
    if (!contentIndex) return;

    const newSlug = contentArray[contentIndex].slug;
    updateRoute(`/${newSlug}`);
    setCurrentSlug(newSlug);
    // Update slug
    contentPaneRef.current?.scroll({ top: 0, behavior: "smooth" });
  }, [contentIndex]);

  useEffect(() => {
    if (!contentArray) return;
    if (!entranceSlug) {
      setContentIndex(0);
      setCurrentSlug(contentArray[0].slug);
      return;
    }
    const index = contentArray.findIndex(
      (content) => content.slug == entranceSlug
    );
    setContentIndex(index);
  }, [entranceSlug, contentArray]);

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
      className={`md:w-limiter w-screen bg-white fixed self-end drop-shadow-2xl shadow-t-lg  flex flex-col transition-[height] ease-linear z-10`}
      id="pane"
    >
      <script src="https://cdn.jsdelivr.net/gh/MarketingPipeline/Markdown-Tag/markdown-tag.js"></script>

      {showingMenu && (
        <div className="fixed pt-24 z-50 top-16 left-0 w-full md:w-limiter h-dvh bg-white">
          <div className="bg-white flex flex-col">
            <button
              onClick={() => {
                updateRoute(`/`);
                setShowingWelcomeScreen(true);
              }}
            >
              <div>Reset Home</div>
            </button>
          </div>
        </div>
      )}
      <div className="h-full w-full">
        <div className="w-full text-2xl font-bold fixed  z-40">
          {contentArray && (
            <ContentToolBar
              post={contentArray[contentIndex]}
              paneOpen={paneOpen}
              setPaneOpen={setPaneOpen}
              focusOnPin={focusOnPin}
              showingMenu={showingMenu}
              setShowingMenu={setShowingMenu}
            />
          )}
        </div>
        <div
          aria-disabled={!paneOpen}
          className="w-full h-full  overflow-x-hidden overflow-y-auto flex flex-col z-10"
          style={{ paddingTop: "1rem" }}
          id="content-pane"
          ref={contentPaneRef}
          onDrag={(e) => {
            e.preventDefault();
            setPaneOpen(true);
          }}
          onClick={() => {
            setPaneOpen(true);
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
          />
        </div>
      </div>
    </div>
  );
}
