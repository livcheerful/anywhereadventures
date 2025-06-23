"use client";
import { useSearchParams } from "next/navigation";
import MainMap, { shiftUp } from "./Map";
import MyMap from "./MyMap";
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

  const [mainMap, setMainMap] = useState(undefined);
  // Elements to control map
  const [viewingPin, setViewingPin] = useState(undefined);
  const [mapState, setMapState] = useState("myMap"); // Could also be in "Explore state"
  const [viewingExploreCategory, setViewingExploreCategory] =
    useState(undefined);
  const [brochureViewOpen, setBrochureViewOpen] = useState(false);
  const [myLocations, setMyLocations] = useState(getAllContent());
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

  function mapCB(m) {
    setMainMap(m);
  }
  function mapClickHandler() {
    setPaneOpen(false);
  }

  function openMapExploreToBrochure(tagName) {
    setPaneOpen(false);
    setMapState("explore");
    setExploringContent(true);
    setViewingExploreCategory(tagName);
    setBrochureViewOpen(true);
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
          paneOpen={paneOpen}
          mapClickHandler={mapClickHandler}
          chosenLocation={chosenLocation}
          myLocations={myLocations}
          setMyLocations={setMyLocations}
          initialCenter={chosenLocation?.center}
          initialZoom={chosenLocation?.zoom}
          defaultLocation={chosenLocation}
          setExploringContent={setExploringContent}
          viewingPin={viewingPin}
          setViewingPin={setViewingPin}
          mapState={mapState}
          setMapState={setMapState}
          viewingExploreCategory={viewingExploreCategory}
          setViewingExploreCategory={setViewingExploreCategory}
          brochureViewOpen={brochureViewOpen}
          setBrochureViewOpen={setBrochureViewOpen}
        />
      }
      {!viewingPin && (
        <a href="/journal">
          <div
            id="toJournal"
            className="absolute -right-24 md:-right-10 -bottom-32 md:bottom-0 -rotate-6 drop-shadow-xl"
            style={{
              width: "15rem",
              height: "25rem",
              backgroundImage: "url(/notebook3.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="stickyNote w-28 h-28 bottom-28 md:bottom-14 right-7 absolute p-2 flex flex-col justify-center  -rotate-6"
            style={{
              backgroundImage: `url(/stickynote.png)`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="font-mono text-gray-900 font-bold text-sm text-center">
              View journal
            </div>
          </div>
        </a>
      )}
      {exploringContent != undefined && exploringContent == false && (
        <ContentPane
          chosenLocation={chosenLocation}
          slug={slug}
          mainMap={mainMap}
          paneOpen={paneOpen}
          setPaneOpen={setPaneOpen}
          exploringContent={exploringContent}
          setExploringContent={setExploringContent}
          currentSlug={currentSlug}
          setCurrentSlug={setCurrentSlug}
          post={post}
          setPost={setPost}
          myLocationSlugs={myLocationSlugs}
          setMyLocationSlugs={setMyLocationSlugs}
          setShowingWelcomeScreen={setShowingWelcomeScreen}
          setViewingPin={setViewingPin}
          openMapExploreToBrochure={openMapExploreToBrochure}
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
