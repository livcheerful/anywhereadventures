"use client";
import MainMap from "./Map";
import ContentPane from "./ContentPane";
import { useState } from "react";
export default function BasePage({ slug, post }) {
  const [mainMap, setMainMap] = useState(undefined);
  const [paneOpen, setPaneOpen] = useState(!!post || slug == "discover");

  function mapCB(m) {
    setMainMap(m);
  }
  function mapClickHandler() {
    setPaneOpen(false);
  }

  return (
    <div className="relative flex w-full overflow-hidden ">
      <MainMap mapCB={mapCB} mapClickHandler={mapClickHandler} />
      <ContentPane
        slug={slug}
        post={post}
        mainMap={mainMap}
        paneOpen={paneOpen}
        setPaneOpen={setPaneOpen}
      />
    </div>
  );
}
