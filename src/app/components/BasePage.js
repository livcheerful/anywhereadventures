"use client";
import MainMap from "./Map";
import ContentPane from "./ContentPane";
import { useState } from "react";
export default function BasePage({ slug, post }) {
  const [mainMap, setMainMap] = useState(undefined);
  function mapCB(m) {
    console.log("setting map");
    setMainMap(m);
  }

  return (
    <div className="relative flex w-full overflow-hidden ">
      <MainMap mapCB={mapCB} />
      <ContentPane slug={slug} post={post} mainMap={mainMap} />
    </div>
  );
}
