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
import { seattleLocs, seattleByCategory } from "../lib/MdxQueries";
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
import { registerNewIO } from "../lib/intersectionObserverHelper";

function getPostsByCategory(category) {
  for (let i = 0; i < seattleByCategory.length; i++) {
    if (seattleByCategory[i].tag == category) return seattleByCategory[i].posts;
  }
}

function getPostBySlug(slug) {
  for (let i = 0; i < seattleLocs.length; i++) {
    if (seattleLocs[i].slug == slug) return seattleLocs[i];
  }
}

export default function ContentPane({
  slug,
  mainMap,
  paneOpen,
  setPaneOpen,
  exploringContent,
  setExploringContent,
}) {
  const router = useRouter();
  const [post, setPost] = useState();
  const [viewAsGrid, setViewAsGrid] = useState(false);
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [myLocationSlugs, setMyLocationSlugs] = useState(getAllSlugs());
  const [thumbnailView, setThumbnailView] = useState(
    exploringContent == true && currentSlug == "discover"
  );
  const ioRef = useRef();
  const scrollValue = useRef();

  useEffect(() => {
    // Get Post based on slug
    async function fetchPost() {
      const file = await fetch(`/content/generated/${currentSlug}.json`);
      const f = await file.json();

      setPost(f);
    }
    console.log("VVN update it's thumbnail view :)");
    setThumbnailView(exploringContent == true && currentSlug == "discover");
    if (currentSlug == "discover" || currentSlug == "") return;
    fetchPost();
  }, [currentSlug]);

  useEffect(() => {
    if (mainMap && !exploringContent) mainMap.removeAllTempLayers();
  }, [mainMap, exploringContent]);

  // Register Intersection Observer
  useEffect(() => {
    if (!mainMap) return;
    if (ioRef.current) {
      if (slug == "") {
        // Unregister IO
        console.log("Need to unregister");
      }
      return;
    }
    if (!exploringContent) return;

    // For individual cards, highlight pin
    ioRef.current = registerNewIO(
      document.getElementsByClassName("ind-card"),
      document.getElementById("#explorePane"),
      (entries) => {
        for (let entryIdx = 0; entryIdx < entries.length; entries++) {
          const justScrolledInElem = entries[entryIdx].target;
          const cardSlug = justScrolledInElem.getAttribute("cardslug");
          if (
            entries[entryIdx].isIntersecting &&
            entries[entryIdx].intersectionRatio == 1
          ) {
            const postInView = getPostBySlug(cardSlug);

            const m = makeNewMarker(excitingMapColor, postInView, router, true);
            mainMap.addLayer(m, cardSlug);
          } else {
            mainMap.removeLayerGroup(cardSlug);
          }
        }
      }
    );

    console.log("VVn in contentpane");
    // For each category, highlight pins
    registerNewIO(
      document.getElementsByClassName("category-row-header"),
      document.getElementById("#explorePane"),
      (entries) => {
        console.log("intersecting! hello");
        for (let entryIdx = 0; entryIdx < entries.length; entries++) {
          const justScrolledInElem = entries[entryIdx].target;
          const category = justScrolledInElem.getAttribute("categoryname");
          const catMetaInfo = categoryInfo[category];
          if (
            entries[entryIdx].isIntersecting &&
            entries[entryIdx].intersectionRatio == 1
          ) {
            const postsInView = getPostsByCategory(category);
            postsInView.forEach((p) => {
              const m = makeNewMarker(
                catMetaInfo?.pinColor || excitingMapColor,
                p,
                router,
                true
              );
              mainMap.addLayer(m, category);
            });
          } else {
            mainMap.removeLayerGroup(category);
          }
        }
      }
    );
  }, [mainMap, currentSlug]);

  useEffect(() => {
    const myLocations = getAllContent();
    mainMap?.updatePins(myLocations);
  }, [mainMap, myLocationSlugs]);

  useEffect(() => {
    // Fetch all the relevant pins.
    // Add them to the map
    // Filter the places in our column based on it?
    if (mainMap && exploringContent) {
      const shortList = seattleLocs.map((l) => {
        return {
          latlon: l.latlon,
          slug: l.slug,
          title: l.title,
          cardImage: l.cardImage,
        };
      });

      shortList.forEach((l) => {
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

  function zoomToMainMap(coords, zoom, setTempPin = false) {
    console.log("Vivian in zoom to main map");
    setPaneOpen(false);
    mainMap.map.flyTo({
      center: [coords[1], coords[0]],
      zoom: zoom || 8,
      speed: 0.4,
    });
    if (setTempPin) {
      const tempPinOnMainMap = makeNewMarker(unvisitedMapColor, {
        latlon: coords,
      });
      const l = mainMap.addTemporaryLayer(tempPinOnMainMap);
    }
  }

  function getPaneHeight() {
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
  console.log(currentSlug);

  return (
    <div
      style={{ height: getPaneHeight() }}
      className={`lg:w-limiter  bg-white fixed self-end  shadow-t-lg  flex flex-col transition-[height] ease-linear z-10`}
      id="pane"
    >
      <script src="https://cdn.jsdelivr.net/gh/MarketingPipeline/Markdown-Tag/markdown-tag.js"></script>

      <div className="h-full ">
        <div className="w-full text-2xl font-bold fixed  z-40">
          <ContentToolBar
            setPaneOpen={setPaneOpen}
            exploringContent={exploringContent}
            setExploringContent={setExploringContent}
            currentSlug={currentSlug}
            setCurrentSlug={setCurrentSlug}
            mainMap={mainMap}
            viewAsGrid={viewAsGrid}
            setViewAsGrid={setViewAsGrid}
          />
        </div>
        <div
          className="w-full h-full overflow-x-hidden overflow-y-scroll flex flex-col z-10"
          style={{ paddingTop: "30px" }}
          id="content-pane"
          onDrag={() => {
            setPaneOpen(true);
          }}
          onClick={() => {
            setPaneOpen(true);
          }}
          onScroll={(e) => {
            // scrollValue.current = e.target.scrollTop;
          }}
        >
          {thumbnailView && <DiscoverFeed setCurrentSlug={setCurrentSlug} />}
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

          {exploringContent && !thumbnailView && post && (
            <div className={` w-full ${showContent() ? "visible" : "hidden"}`}>
              <ContentHeader
                post={post}
                currentSlug={currentSlug}
                zoomToMainMap={zoomToMainMap}
                setMyLocationSlugs={setMyLocationSlugs}
                isAdded={isAdded(localStorageKey, currentSlug)}
                setPaneOpen={setPaneOpen}
              />

              <PostContent post={post} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
