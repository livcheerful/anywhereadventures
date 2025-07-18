"use client";

// Libraries
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Map, Marker, Popup } from "maplibre-gl";

// Components
import RiverFeed from "./RiverFeed";
import ContentToolBar from "./ContentToolBar";

export default function ContentPane({
  entranceSlug,
  mainMap,
  paneOpen,
  setPaneOpen,
  exploringContent,
  setExploringContent,
  currentSlug,
  setCurrentSlug,
  post,
  setViewingPin,
  setShowingWelcomeScreen,
}) {
  const router = useRouter();
  const [viewAsGrid, setViewAsGrid] = useState(false);
  const [paneHeight, setPaneHeight] = useState(getPaneHeight());
  const [thumbnailView, setThumbnailView] = useState(
    exploringContent == true && currentSlug == "discover"
  );
  const scrollValue = useRef();

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
    console.log("VVN in useEffect for pane Height");
    setPaneHeight(getPaneHeight());
  }, [paneOpen]);

  return (
    <div
      style={{ height: paneHeight }}
      className={`md:w-limiter w-screen bg-white fixed self-end drop-shadow-2xl shadow-t-lg  flex flex-col transition-[height] ease-linear z-10`}
      id="pane"
    >
      <script src="https://cdn.jsdelivr.net/gh/MarketingPipeline/Markdown-Tag/markdown-tag.js"></script>
      <div className="h-full w-full">
        <div className="w-full text-2xl font-bold fixed  z-40">
          <ContentToolBar
            post={post}
            paneOpen={paneOpen}
            setPaneOpen={setPaneOpen}
            exploringContent={exploringContent}
            setExploringContent={setExploringContent}
            currentSlug={currentSlug}
            setCurrentSlug={setCurrentSlug}
            mainMap={mainMap}
            viewAsGrid={viewAsGrid}
            setViewAsGrid={setViewAsGrid}
            setShowingWelcomeScreen={setShowingWelcomeScreen}
          />
        </div>
        <div
          aria-disabled={!paneOpen}
          className="w-full h-full  overflow-x-hidden overflow-y-auto flex flex-col z-10"
          style={{ paddingTop: "1rem" }}
          id="content-pane"
          onDrag={(e) => {
            e.preventDefault();
            setPaneOpen(true);
          }}
          onClick={() => {
            setPaneOpen(true);
          }}
        >
          {!exploringContent && (
            <RiverFeed
              entranceSlug={entranceSlug}
              focusOnPin={focusOnPin}
              setPaneOpen={setPaneOpen}
              viewAsGrid={viewAsGrid}
              setViewAsGrid={setViewAsGrid}
              scrollRef={scrollValue}
              paneOpen={paneOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
}
