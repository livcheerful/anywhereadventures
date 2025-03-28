"use client";
import { useState, useEffect, useRef } from "react";

import { saveLCItem } from "../../lib/storageHelpers";
export default function LOCItem({ image, linkOut, caption }) {
  const [itemOpen, setItemOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [diffPos, setDiffPos] = useState([0, 0]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {}, [itemOpen]);

  function startSaveAnim() {
    const journalTab = document.getElementById();
    // Animate from current position to new with a little shrinking situation.
  }

  return (
    <div className="flex flex-col items-center gap-1 pb-5 relative">
      <img
        src={image}
        onClick={() => {
          // VVN start fetch of item
          // setItemOpen(true);
        }}
      />
      <div className="absolute right-2 top-0 flex flex-row gap-2">
        {linkOut && (
          <a href={linkOut}>
            <div className=" bg-slate-100 p-2 drop-shadow-sm font-light">
              source
            </div>
          </a>
        )}
        <div
          className="bg-slate-100 p-2 drop-shadow-sm font-light"
          onClick={() => {
            saveLCItem(
              linkOut,
              image,
              caption,
              window.location.pathname.substring(1)
            );
            // startSaveAnim();
          }}
        >
          Save
        </div>
      </div>
      <div className="italic font-serif text-sm p-2">{caption}</div>
    </div>
  );
}

// inline -- local asset (JP2), expanded -- LOC IIIF version (fallback to GH)
