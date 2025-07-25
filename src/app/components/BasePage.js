"use client";
import { useSearchParams } from "next/navigation";
import MyMap from "./MyMap";
import ContentPane from "./ContentPane";
import WelcomeScreen from "./WelcomeScreen";
import { useState, useEffect } from "react";
import { updateRoute } from "../lib/routeHelpers";
import { locationData, savedLocationToObj } from "../lib/locationHelpers";
import { getHomeLocation } from "../lib/storageHelpers";
export default function BasePage({ entranceSlug }) {
  const [isNewUser, setIsNewUser] = useState(!getHomeLocation());
  const [showingWelcomeScreen, setShowingWelcomeScreen] = useState(isNewUser);
  const [paneOpen, setPaneOpen] = useState(!isNewUser);

  const [currentSlug, setCurrentSlug] = useState(entranceSlug);
  const [exploringContent, setExploringContent] = useState(false);
  const [post, setPost] = useState();

  // VVN These store the same things, just one gets initialized...?
  const [savedLocation, setSavedLocation] = useState(getHomeLocation());
  const [chosenLocation, setChosenLocation] = useState(
    savedLocationToObj(savedLocation) || locationData.all
  );

  const [mainMap, setMainMap] = useState(undefined);
  // Elements to control map
  const [viewingPin, setViewingPin] = useState(undefined);

  function finishWelcome() {
    setShowingWelcomeScreen(false);
  }

  useEffect(() => {
    if (savedLocation && !chosenLocation) {
      const locObj = savedLocationToObj(savedLocation);
      setChosenLocation(locObj);
      mainMap?.flyTo(locObj.center, locObj.zoom);
    }
  }, [savedLocation, mainMap]);

  function mapCB(m) {
    setMainMap(m);
  }
  function mapClickHandler() {
    setPaneOpen(false);
  }

  function setPaneOpenHandler(open) {
    setPaneOpen(open);
  }

  return (
    <div
      className="relative flex w-full overflow-hidden"
      onDrag={(e) => {
        e.preventDefault();
      }}
    >
      {
        <MyMap
          mapCB={mapCB}
          mapClickHandler={mapClickHandler}
          defaultLocation={chosenLocation}
          paneOpen={paneOpen}
          setPaneOpen={setPaneOpenHandler}
          viewingPin={viewingPin}
          setViewingPin={setViewingPin}
          chosenLocation={chosenLocation}
          setCurrentSlug={setCurrentSlug}
        />
      }
      {!viewingPin && (
        <a
          href="/journal"
          className="absolute left-4 md:left-10 -bottom-14 md:bottom-0 -rotate-12 drop-shadow-xl"
        >
          <div
            id="toJournal"
            className="relative"
            style={{
              width: "15rem",
              height: "25rem",
              backgroundImage: "url(/notebook3.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="stickyNote w-28 h-28 top-4 left-5 absolute md:bottom-14 right-7  p-2 flex flex-col justify-center  -rotate-6"
              style={{
                backgroundImage: `url(/stickynote.png)`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="font-mono text-gray-900 font-bold text-sm text-center">
                Travel Log
              </div>
            </div>
          </div>
        </a>
      )}

      {!showingWelcomeScreen && (
        <ContentPane
          entranceSlug={entranceSlug}
          chosenLocation={chosenLocation}
          mainMap={mainMap}
          paneOpen={paneOpen}
          setPaneOpen={setPaneOpen}
          exploringContent={exploringContent}
          setExploringContent={setExploringContent}
          currentSlug={currentSlug}
          setCurrentSlug={setCurrentSlug}
          post={post}
          setPost={setPost}
          setShowingWelcomeScreen={setShowingWelcomeScreen}
          setViewingPin={setViewingPin}
        />
      )}

      {showingWelcomeScreen && (
        <WelcomeScreen
          onFinishWelcoming={finishWelcome}
          setChosenLocation={setChosenLocation}
          mainMap={mainMap}
        />
      )}
    </div>
  );
}
