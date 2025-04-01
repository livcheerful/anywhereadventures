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

  function startSaveAnim() {
    const journalTab = document.getElementById("navbar-journal-tab");
    const journalTabBox = journalTab.getBoundingClientRect();
    const ogImage = document.getElementById(`lcitem-${image}`);
    // Animate from current position to new with a little shrinking situation.
    const resourceCpy = document.createElement("img");
    resourceCpy.src = image;
    resourceCpy.style.zIndex = 100;
    resourceCpy.className = "fixed ";

    ogImage.parentElement.appendChild(resourceCpy);

    const tl = gsap.timeline();

    setTimeout(() => {
      tl.to(resourceCpy, {
        duration: 2,
        width: "30%",
        rotate: -20,
        left: 0,
        top: `${journalTabBox.y}`,
        onComplete: () => {
          resourceCpy.remove();
          makeConfetti(journalTab, journalTabBox.x, journalTabBox.y, 4);
        },
      });
    }, 10);
  }

  return (
    <div className="flex flex-col items-center gap-1 pb-5 relative">
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
            <div className=" bg-slate-100 p-2 drop-shadow-sm font-light">
              source
            </div>
          </a>
        )}
        <div
          className="bg-slate-100 p-2 drop-shadow-sm font-light"
          onClick={(e) => {
            makeConfetti(e.target.parentElement, e.clientX, e.clientY, 10);
            startSaveAnim();
            saveLCItem(
              linkOut,
              image,
              caption,
              window.location.pathname.substring(1)
            );
          }}
        >
          Save
        </div>
      </div>
      <div className="italic font-serif text-sm p-2">{caption}</div>
    </div>
  );
}
