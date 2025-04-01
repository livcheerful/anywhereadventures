"use client";
import { useSearchParams } from "next/navigation";
import MainMap from "./Map";
import ContentPane from "./ContentPane";
import { useState, useEffect } from "react";
import { isThisMe } from "../lib/storageHelpers";
export default function BasePage({ slug, post }) {
  const [mainMap, setMainMap] = useState(undefined);
  const [paneOpen, setPaneOpen] = useState(true);

  const [exploringContent, setExploringContent] = useState(undefined);
  const searchParams = useSearchParams();
  const userKey = searchParams.get("k");

  useEffect(() => {
    setExploringContent(true);
    // let itIsMe = false;
    // if (!userKey) {
    //   itIsMe = false;
    // } else {
    //   itIsMe = isThisMe(userKey);
    // }
    // if (!userKey) {
    //   setExploringContent(false);
    //   return;
    // }
    // if (itIsMe) {
    //   // Load the river feed
    //   setExploringContent(false);
    // } else {
    //   // Load into that page
    //   setExploringContent(true);
    // }
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
    <div className="relative flex w-full overflow-hidden ">
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
