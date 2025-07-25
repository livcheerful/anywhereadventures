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
    console.log("vvn map click handler");
    setViewingPin(undefined);
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
