"use client";
import { useState, useEffect, useRef } from "react";
export default function LOCItem({ image, lcLink, caption }) {
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
    <div className="flex flex-col items-center gap-2 pb-5">
      {itemOpen && (
        <div className="fixed w-full h-full bg-black/60 top-0 z-30 flex flex-col justify-center">
          <div
            className="bg-white absolute top-0 z-40"
            onClick={() => {
              setItemOpen(false);
            }}
          >
            Close
          </div>
          <div
            className=""
            onPointerDown={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onPointerUp={(e) => {
              setDragging(false);
            }}
            onPointerMove={(e) => {
              mouseHandler(e);
            }}
          >
            {lcLink ? (
              <div></div>
            ) : (
              <div className="w-full max-h-1/3 overflow-clip">
                <img
                  className="select-none"
                  src={image}
                  style={{
                    transform: `translate(${diffPos[0]}px,${diffPos[1]}px) scale(${zoomLevel})`,
                  }}
                  ref={openedImage}
                ></img>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 flex flex-row gap-2 p-3">
            <div
              className="bg-white p-3"
              onClick={() => {
                setZoomLevel(zoomLevel - 0.2);
              }}
            >
              Zoom Out
            </div>
            <div
              className="bg-white p-3"
              onClick={() => {
                setZoomLevel(zoomLevel + 0.2);
              }}
            >
              ZoomIn
            </div>
            {lcLink && (
              <div className="bg-white p-3">
                <a href={lcLink}>Visit the source</a>
              </div>
            )}
          </div>
        </div>
      )}
      <img
        src={image}
        onClick={() => {
          // VVN start fetch of item
          setItemOpen(true);
        }}
      />
      <div className="italic font-serif">{caption}</div>
    </div>
  );
}

// inline -- local asset (JP2), expanded -- LOC IIIF version (fallback to GH)
