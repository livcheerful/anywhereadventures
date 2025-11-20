"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";

import MyMap from "./MyMap";
import ContentPane from "./ContentPane";
import WelcomeScreen from "./WelcomeScreen";

import LoadingTransitionPage from "./LoadingTransitionPage";
import { locationData, savedLocationToObj } from "../lib/locationHelpers";
import { getHomeLocation, setHomeLocation } from "../lib/storageHelpers";

export default function BasePage({ entranceSlug }) {
  const [isNewUser, setIsNewUser] = useState(!getHomeLocation());
  const [showingWelcomeScreen, setShowingWelcomeScreen] = useState(false);
  const [paneOpen, setPaneOpen] = useState(false);
  const [showLoadingTransition, setShowLoadingTransition] = useState(false);

  const [currentSlug, setCurrentSlug] = useState(entranceSlug);
  const [exploringContent, setExploringContent] = useState(false);

  // VVN These store the same things, just one gets initialized...?
  const [savedLocation, setSavedLocation] = useState(getHomeLocation());
  const [chosenLocation, setChosenLocation] = useState(locationData.all);

  const [welcomeScreenStartIndex, setWelcomeScreenStartIndex] = useState(0);

  const [mainMap, setMainMap] = useState(undefined);
  // Elements to control map
  const [viewingPin, setViewingPin] = useState(undefined);

  const searchParams = useSearchParams();
  const params = useParams();

  const homeLocation = getHomeLocation();
  function finishWelcome() {
    setShowingWelcomeScreen(false);
  }

  useEffect(() => {
    // Check query param
    const skipWelcome = searchParams.get("skip") === "true";

    if (skipWelcome) {
      const slugParam = params.slug;

      const parts = Array.isArray(slugParam)
        ? slugParam
        : slugParam
        ? [slugParam]
        : [];

      const city = parts[0]; // "seattle"

      setHomeLocation(locationData[city].name);
      setChosenLocation(locationData[city]);
    }

    setShowingWelcomeScreen(!skipWelcome && isNewUser);
  }, []);

  useEffect(() => {
    if (
      savedLocation &&
      (!chosenLocation || chosenLocation == locationData.all)
    ) {
      const locObj = savedLocationToObj(savedLocation);
      setChosenLocation(locObj);
      mainMap?.flyTo(locObj.center, locObj.zoom);
    }
  }, [savedLocation, mainMap]);

  function mapCB(m) {
    setMainMap(m);
  }
  function mapClickHandler() {
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
          setShowLoadingTransition={setShowLoadingTransition}
        />
      }
      {showLoadingTransition && <LoadingTransitionPage />}

      {!showingWelcomeScreen && homeLocation && (
        <ContentPane
          setShowLoadingTransition={setShowLoadingTransition}
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
          setWelcomeScreenStartIndex={setWelcomeScreenStartIndex}
          setViewingPin={setViewingPin}
        />
      )}

      {showingWelcomeScreen && (
        <WelcomeScreen
          onFinishWelcoming={finishWelcome}
          setChosenLocation={setChosenLocation}
          mainMap={mainMap}
          setPaneOpen={setPaneOpen}
          startIndex={welcomeScreenStartIndex}
        />
      )}
    </div>
  );
}
