"use client";
import { useState, useEffect, useRef } from "react";
export default function LOCItem({ image, assetLink, linkOut, caption }) {
  const [itemOpen, setItemOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [diffPos, setDiffPos] = useState([0, 0]);
  const [dragging, setDragging] = useState(false);
  const openedImage = useRef();

  useEffect(() => {}, [itemOpen]);

  function mouseHandler(e) {
    // Check how many fingers are down
    console.log("VVN touches:");
    console.log(e.touches);
    if (!dragging) return;
    setDiffPos([e.movementX + diffPos[0], e.movementY + diffPos[1]]);
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
      {linkOut && (
        <a href={linkOut}>
          <div className="absolute right-2 top-0 bg-slate-100 p-2 drop-shadow-sm font-light">
            source
          </div>
        </a>
      )}
      <div className="italic font-serif p-2">{caption}</div>
    </div>
  );
}

// inline -- local asset (JP2), expanded -- LOC IIIF version (fallback to GH)
