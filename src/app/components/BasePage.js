"use client";
import { useSearchParams } from "next/navigation";
import MainMap from "./Map";
import ContentPane from "./ContentPane";
import { useState, useEffect } from "react";
import { updateRoute } from "../lib/routeHelpers";
import { isThisMe } from "../lib/storageHelpers";
export default function BasePage({ slug, post }) {
  const [mainMap, setMainMap] = useState(undefined);
  const [paneOpen, setPaneOpen] = useState(true);

  const [exploringContent, setExploringContent] = useState(undefined);
  const searchParams = useSearchParams();
  const userKey = searchParams.get("k");

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
    console.log("Vivian in pane open handler");
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
      <MainMap mapCB={mapCB} mapClickHandler={mapClickHandler} />
      {exploringContent != undefined && (
        <ContentPane
          slug={slug}
          post={post}
          mainMap={mainMap}
          paneOpen={paneOpen}
          setPaneOpen={paneOpenHandler}
          exploringContent={exploringContent}
          setExploringContent={setExploringContent}
        />
      )}
    </div>
  );
}
