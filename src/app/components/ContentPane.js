"use client";

// Libraries
import { useState, useEffect, useRef } from "react";
import { getHomeLocation } from "../lib/storageHelpers";
import { savedLocationToObj } from "../lib/locationHelpers";
import { getMdx } from "../lib/clientPostHelper";

import FocusLock from "react-focus-lock";

// Components
import SingleStoryPage from "./SingleStoryPage";
import MenuPane from "./MenuPane";
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
  setShowLoadingTransition,
  setWelcomeScreenStartIndex,
}) {
  const [paneHeight, setPaneHeight] = useState(getPaneHeight());
  const [contentIndex, setContentIndex] = useState(undefined);
  const [contentArray, setContentArray] = useState(undefined);
  const [reduceAnims, setReduceAnims] = useState(false);

  const [showingMenu, setShowingMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(undefined);
  const [homeLoc, setHomeLoc] = useState(undefined);
  const [homeLocationData, setHomeLocationData] = useState(undefined);

  const startY = useRef();
  const isAtTop = useRef();
  const contentPaneRef = useRef(null);

  useEffect(() => {
    const loc = getHomeLocation(); // now runs only in client
    const locationData = savedLocationToObj(loc);
    setHomeLoc(loc);
    setHomeLocationData(locationData);

    setContentArray(new Array(locationData.locs.length));
  }, []);

  // Load up the content based on stored home location
  useEffect(() => {
    if (!homeLocationData) return;

    const locSlugs = homeLocationData.locs.map((l) => {
      return l.slug;
    });

    let index = locSlugs.findIndex((slug) => slug == entranceSlug);
    if (index < 0) {
      index = undefined;
      mainMap.flyTo(homeLocationData.center, homeLocationData.zoom, false);
      updateRoute(`/${homeLocationData.id}`);
    }

    setContentIndex(index);
  }, [homeLocationData]);

  useEffect(() => {
    if (entranceSlug) {
      setIndexFromSlug(entranceSlug);
    } else if (contentArray) {
      setContentIndex(undefined);
      setCurrentSlug(undefined);
    }
  }, [entranceSlug]);

  function handleRouteAndSlugs(loc) {
    const newSlug = loc.slug;
    updateRoute(`/${loc.location[0].toLowerCase()}/${newSlug}`);
    setCurrentSlug(newSlug);
    setViewingPin(undefined);

    // Update slug
    contentPaneRef.current?.scroll({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (!contentArray) return;
    if (contentIndex != undefined) {
      // Check if we have to fetch the content
      const locationInfo = homeLocationData.locs[contentIndex];
      if (!contentArray[contentIndex]) {
        getMdx([locationInfo.slug], (mdx) => {
          setContentArray((prev) => {
            const newArray = [...prev];
            newArray[contentIndex] = mdx[0];
            return newArray;
          });
          handleRouteAndSlugs(mdx[0]);
          // Update map
          mainMap.flyTo(
            [locationInfo.latlon[1], locationInfo.latlon[0]],
            locationInfo.zoom,
            false
          );
        });
        return;
      } else {
        handleRouteAndSlugs(contentArray[contentIndex]);
      }
    }
  }, [contentIndex]);

  useEffect(() => {
    if (!homeLocationData) return;
    if (
      !contentIndex ||
      homeLocationData.locs[contentIndex].slug != currentSlug
    ) {
      setIndexFromSlug(currentSlug);
    }
  }, [currentSlug]);

  useEffect(() => {
    setPaneHeight(getPaneHeight());
  }, [paneOpen]);

  useEffect(() => {
    setTimeout(() => {
      setToastMessage(undefined);
    }, 2000);
  }, [toastMessage]);

  function setIndexFromSlug(slug) {
    if (!contentArray) return;
    if (!slug) {
      setContentIndex(undefined);
      return;
    }
    const index = homeLocationData.locs.findIndex((loc) => loc.slug == slug);
    if (index >= 0) {
      setContentIndex(index);
    }
  }

  function getPaneHeight() {
    if (!paneOpen) {
      return "20%";
    } else {
      return "100%";
    }
  }

  return (
    <div
      style={{ height: paneHeight }}
      className={`md:w-limiter w-screen bg-white fixed self-end drop-shadow-2xl shadow-t-lg  flex flex-col ${
        reduceAnims ? "transition-none" : "transition-[height]"
      } ease-linear z-10`}
      id="pane"
    >
      <script src="https://cdn.jsdelivr.net/gh/MarketingPipeline/Markdown-Tag/markdown-tag.js"></script>
      <MenuPane
        showingMenu={showingMenu}
        setShowingMenu={setShowingMenu}
        homeLoc={homeLoc}
        reduceAnims={reduceAnims}
        setReduceAnims={setReduceAnims}
        updateRoute={updateRoute}
        setShowingWelcomeScreen={setShowingWelcomeScreen}
      />

      <FocusLock
        disabled={showingMenu || !paneOpen}
        className="relative h-full"
        returnFocus
      >
        <div className="h-full w-full">
          <div className="w-full text-2xl font-bold fixed z-40">
            {contentArray && (
              <ContentToolBar
                setShowLoadingTransition={setShowLoadingTransition}
                post={contentArray[contentIndex]}
                paneOpen={paneOpen}
                setPaneOpen={setPaneOpen}
                showingMenu={showingMenu}
                setShowingMenu={setShowingMenu}
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
                if (isAtTop.current && deltaY > 10) setPaneOpen(false);
              }
            }}
          >
            <SingleStoryPage
              currentSlug={currentSlug}
              setCurrentSlug={setCurrentSlug}
              entranceSlug={entranceSlug}
              setPaneOpen={setPaneOpen}
              paneOpen={paneOpen}
              contentPaneRef={contentPaneRef}
              contentIndex={contentIndex}
              contentArray={contentArray}
              setContentIndex={setContentIndex}
              setViewingPin={setViewingPin}
              mainMap={mainMap}
              setToastMessage={setToastMessage}
              homeLocationData={homeLocationData}
            />
            {toastMessage && <Toast message={toastMessage} />}
            <Footer paneOpen={paneOpen} />
          </div>
        </div>
      </FocusLock>
    </div>
  );
}
