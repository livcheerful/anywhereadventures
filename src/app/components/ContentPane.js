"use client";

// Libraries
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Map, Marker, Popup } from "maplibre-gl";

// Components
import PostContent from "./PostContent";
import RiverFeed from "./RiverFeed";
import ContentHeader from "./ContentHeader";
import ContentToolBar from "./ContentToolBar";
import DiscoverFeed from "./DiscoverFeed";

// Helpers
import {
  getAllContent,
  getAllSlugs,
  isAdded,
  localStorageKey,
} from "../lib/storageHelpers";
import { makeNewMarker } from "../components/Map";
import { categoryInfo } from "../content/meta";
import {
  unvisitedMapColor,
  unopinionatedMapColor,
  excitingMapColor,
} from "../lib/constants";

export default function ContentPane({
  slug,
  mainMap,
  paneOpen,
  setPaneOpen,
  exploringContent,
  setExploringContent,
  currentSlug,
  setCurrentSlug,
  post,
  setPost,
  chosenLocation,
  myLocationSlugs,
  setMyLocationSlugs,
  setShowingWelcomeScreen,
}) {
  const router = useRouter();
  const [viewAsGrid, setViewAsGrid] = useState(false);
  const [paneHeight, setPaneHeight] = useState(getPaneHeight());
  const [thumbnailView, setThumbnailView] = useState(
    exploringContent == true && currentSlug == "discover"
  );
  const scrollValue = useRef();

  useEffect(() => {
    // Get Post based on slug
    async function fetchPost() {
      const file = await fetch(`/content/generated/${currentSlug}.json`);
      const f = await file.json();

      setPost(f);
    }
    setThumbnailView(exploringContent == true && currentSlug == "discover");
    if (currentSlug == "discover" || currentSlug == "") return;
    fetchPost();
  }, [currentSlug]);

  useEffect(() => {
    // if (mainMap && !exploringContent) mainMap.removeAllTempLayers();
  }, [mainMap, exploringContent]);

  useEffect(() => {
    // Fetch all the relevant pins.
    // Add them to the map
    // Filter the places in our column based on it?
    if (mainMap && exploringContent) {
      const shortList = chosenLocation.locs.map((l) => {
        return {
          latlon: l.latlon,
          slug: l.slug,
          title: l.title,
          cardImage: l.cardImage,
        };
      });

      shortList.forEach((l) => {
        console.log(l);
        const tempPinOnMainMap = makeNewMarker(
          unopinionatedMapColor,
          l,
          router,
          true
        );
        tempPinOnMainMap.addClassName("pinned");
        mainMap?.addTemporaryLayer(tempPinOnMainMap);
      });
    }
  }, [exploringContent, mainMap]);

  useEffect(() => {
    console.log("pane height changed");
    setPaneHeight(getPaneHeight());
  }, [paneOpen]);

  function zoomToMainMap(center, zoom) {
    console.log("VVN trying to set pane closed?");
    setPaneOpen(false);
    mainMap.flyTo(center, zoom, false);
  }

  function getPaneHeight() {
    console.log("In get pane height");
    if (!paneOpen) {
      return "20%";
    } else if (paneOpen && exploringContent) {
      return "80%";
    } else {
      return "90%";
    }
  }

  function showContent() {
    return currentSlug && currentSlug != "discover";
  }

  return (
    <div
      style={{ height: paneHeight }}
      className={`md:w-limiter w-screen bg-white fixed self-end  shadow-t-lg  flex flex-col transition-[height] ease-linear z-10`}
      id="pane"
    >
      <script src="https://cdn.jsdelivr.net/gh/MarketingPipeline/Markdown-Tag/markdown-tag.js"></script>
      <div className="h-full w-full">
        <div className="w-full text-2xl font-bold fixed  z-40">
          <ContentToolBar
            post={post}
            setPaneOpen={setPaneOpen}
            exploringContent={exploringContent}
            setExploringContent={setExploringContent}
            currentSlug={currentSlug}
            setCurrentSlug={setCurrentSlug}
            mainMap={mainMap}
            viewAsGrid={viewAsGrid}
            setMyLocationSlugs={setMyLocationSlugs}
            setViewAsGrid={setViewAsGrid}
            setShowingWelcomeScreen={setShowingWelcomeScreen}
          />
        </div>
        <div
          className="w-full h-full overflow-x-hidden overflow-y-auto flex flex-col z-10"
          style={{ paddingTop: "30px" }}
          id="content-pane"
          onDrag={(e) => {
            e.preventDefault();
            setPaneOpen(true);
          }}
          onClick={() => {
            setPaneOpen(true);
          }}
          onScroll={(e) => {
            // scrollValue.current = e.target.scrollTop;
          }}
        >
          {!exploringContent && (
            <RiverFeed
              setExploringContent={setExploringContent}
              zoomToMainMap={zoomToMainMap}
              setCurrentSlug={setCurrentSlug}
              myLocationSlugs={myLocationSlugs}
              setMyLocationSlugs={setMyLocationSlugs}
              setPaneOpen={setPaneOpen}
              viewAsGrid={viewAsGrid}
              setViewAsGrid={setViewAsGrid}
              scrollRef={scrollValue}
            />
          )}
        </div>
      </div>
    </div>
  );
}
