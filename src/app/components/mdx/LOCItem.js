"use client";
import { gsap } from "gsap";

import Toast from "../Toast";
import { makeConfetti } from "../../lib/animationHelpers";
import { saveLCItem } from "../../lib/storageHelpers";
import { useState } from "react";
export default function LOCItem({ image, linkOut, caption, allowSave, alt }) {
  const [showToast, setShowToast] = useState(false);
  function startSaveAnim(e) {
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
          resourceCpy.remove();
        },
      });
    }, 10);
  }
  return (
    <div className="flex flex-col items-center gap-1 pb-3 relative">
      <img src={image} id={`lcitem-${image}`} alt={alt} />
      <div className="absolute right-2 top-0 flex flex-row gap-2">
        {linkOut && (
          <a href={linkOut} target="_blank" rel="noopener noreferrer">
            <button className=" relative cursor-pointer  bg-emerald-800 p-2 -top-1 drop-shadow-2xl font-bold text-white underline decoration-white rounded-b-lg">
              source
            </button>
          </a>
        )}
        {allowSave && (
          <button
            className="font-bold cursor-pointer relative bg-emerald-800 p-2 -top-1 drop-shadow-lg text-white rounded-b-lg"
            onClick={(e) => {
              setShowToast(true);
              setTimeout(() => {
                setShowToast(false);
              }, 1000);
              saveLCItem(
                linkOut,
                image,
                caption,
                window.location.pathname.substring(1)
              );
            }}
          >
            save
          </button>
        )}
      </div>
      {caption && (
        <div className="italic font-serif text-sm p-2">{caption}</div>
      )}
      {showToast && <Toast message="Saved to travel log" />}
    </div>
  );
}
