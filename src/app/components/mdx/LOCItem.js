"use client";
import { gsap } from "gsap";
import { useState, useEffect, useRef } from "react";

import { makeConfetti } from "../../lib/animationHelpers";
import { saveLCItem } from "../../lib/storageHelpers";
export default function LOCItem({ image, linkOut, caption }) {
  const [itemOpen, setItemOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [diffPos, setDiffPos] = useState([0, 0]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {}, [itemOpen]);

  function startSaveAnim(e) {
    // const journalTab = document.getElementById("navbar-journal-tab");
    // const journalTabBox = journalTab.getBoundingClientRect();
    const ogImage = document.getElementById(`lcitem-${image}`);
    // Animate from current position to new with a little shrinking situation.
    const resourceCpy = document.createElement("img");
    resourceCpy.src = image;
    resourceCpy.style.zIndex = 100;
    resourceCpy.className = "absolute";

    ogImage.parentElement.appendChild(resourceCpy);

    setTimeout(() => {
      const tl = gsap.timeline();
      tl.to(resourceCpy, {
        duration: 1,
        width: "30%",
        rotate: -360,
        scale: 0.2,
        onComplete: () => {
          // makeConfetti(resourceCpy.parentElement, 0, 15, 4);
          resourceCpy.remove();
        },
      });
    }, 10);
  }

  return (
    <div className="flex flex-col items-center gap-1 pb-3 relative">
      <img
        src={image}
        id={`lcitem-${image}`}
        onClick={() => {
          // VVN start fetch of item
          // setItemOpen(true);
        }}
      />
      <div className="absolute right-2 top-0 flex flex-row gap-2">
        {linkOut && (
          <a href={linkOut}>
            <div className=" relative cursor-pointer  bg-emerald-800 p-2  -top-1 drop-shadow-2xl font-bold text-white underline decoration-white rounded-b-lg">
              source
            </div>
          </a>
        )}
        <div
          className="font-bold cursor-pointer relative bg-emerald-800 p-2  -top-1 drop-shadow-lg  text-white rounded-b-lg"
          onClick={(e) => {
            makeConfetti(
              e.target.parentElement,
              e.clientX,
              e.clientY,
              10,
              "💥"
            );
            startSaveAnim(e);
            saveLCItem(
              linkOut,
              image,
              caption,
              window.location.pathname.substring(1)
            );
          }}
        >
          save
        </div>
      </div>
      <div className="italic font-serif text-sm p-2">{caption}</div>
    </div>
  );
}
