"use client";
import { useSearchParams } from "next/navigation";
import MainMap, { shiftUp } from "./Map";
import ContentPane from "./ContentPane";
import WelcomeScreen from "./WelcomeScreen";
import { useState, useEffect } from "react";
import { updateRoute } from "../lib/routeHelpers";
import { locationData, savedLocationToObj } from "../lib/locationHelpers";
import {
  isThisMe,
  getAllSlugs,
  getAllContent,
  getHomeLocation,
} from "../lib/storageHelpers";
export default function BasePage({ slug }) {
  const [mainMap, setMainMap] = useState(undefined);
  const [isNewUser, setIsNewUser] = useState(!getHomeLocation());
  const [showingWelcomeScreen, setShowingWelcomeScreen] = useState(isNewUser);
  const [paneOpen, setPaneOpen] = useState(!isNewUser);

  const [currentSlug, setCurrentSlug] = useState(slug);
  const [exploringContent, setExploringContent] = useState(undefined);
  const [post, setPost] = useState();
  const searchParams = useSearchParams();
  const userKey = searchParams.get("k");

  const [savedLocation, setSavedLocation] = useState(getHomeLocation());
  const [chosenLocation, setChosenLocation] = useState(
    savedLocationToObj(savedLocation) || locationData.all
  );

  const [myLocationSlugs, setMyLocationSlugs] = useState(getAllSlugs());
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

  useEffect(() => {
    setExploringContent(true);
    if (slug == "") {
      setExploringContent(false);
    } else {
      let itIsMe = false;
      if (!userKey) {
        setExploringContent(true);
        return;
      } else {
        itIsMe = isThisMe(userKey);
      }
      if (itIsMe) {
        // Load the river feed
        setExploringContent(false);
      } else {
        // Load into that page
        setExploringContent(true);
        // Also update the URL to remove the user's key
        updateRoute(`/${slug}`);
      }
    }
  }, []);

  function paneOpenHandler(s) {
    setPaneOpen(s);
  }
  function mapCB(m) {
    setMainMap(m);
  }
  function mapClickHandler() {
    setPaneOpen(false);
  }

  return (
    <div
      className="relative flex w-full overflow-hidden"
      onDrag={(e) => {
        e.preventDefault();
      }}
    >
      {
        <MainMap
          mapCB={mapCB}
          mapClickHandler={mapClickHandler}
          post={post}
          slug={currentSlug}
          fullscreen={!paneOpen}
          exploringContent={exploringContent}
          myLocations={getAllContent()}
          initialCenter={chosenLocation?.center}
          initialZoom={chosenLocation?.zoom}
        />
      }
      {exploringContent != undefined && (
        <ContentPane
          chosenLocation={chosenLocation}
          slug={slug}
          mainMap={mainMap}
          paneOpen={paneOpen}
          setPaneOpen={paneOpenHandler}
          exploringContent={exploringContent}
          setExploringContent={setExploringContent}
          currentSlug={currentSlug}
          setCurrentSlug={setCurrentSlug}
          post={post}
          setPost={setPost}
          myLocationSlugs={myLocationSlugs}
          setMyLocationSlugs={setMyLocationSlugs}
          setShowingWelcomeScreen={setShowingWelcomeScreen}
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
