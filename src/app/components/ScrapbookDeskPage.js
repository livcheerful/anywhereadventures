"use client";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import interact from "interactjs";
import StickyNote from "./StickyNote";
import Toast from "./Toast";
import LibraryIndexCard from "./scrapbook/LibraryIndexCard";
import { getSettings, clearPhotoReel } from "../lib/storageHelpers";
import { useNotifications } from "../lib/NotificationsContext";

function ScrapbookDeskItem(htmlElem, rotation, x0, y0) {
  this.x = x0;
  this.y = y0;
  this.rotation = rotation;
  this.elem = htmlElem;
  const updateTransform = () => {
    this.elem.style.transform = `
      translate(${this.x}px, ${this.y}px)
      rotate(${this.rotation}deg)
    `;
  };
  const drag = interact(htmlElem);
  drag.draggable({
    listeners: {
      move: (event) => {
        this.x += event.dx;
        this.y += event.dy;
        updateTransform();
      },
    },
  });
}

export default function ScrapbookDeskPage({
  mdx,
  collageImage,
  locationId,
  stickerRefs,
  setShowSummaryPage,
}) {
  const [showToast, setShowToast] = useState(false);
  const { addNotification } = useNotifications();

  // Animate desk + collage
  useEffect(() => {
    const reduceAnims = getSettings().reduceAnims;
    const tl = gsap.timeline();
    new ScrapbookDeskItem(document.querySelector("#collageImage"), -6, 0, 0);

    tl.fromTo(
      "#pens",
      { top: "-33rem", delay: 1 },
      { top: "-4rem", duration: reduceAnims ? 0 : 0.5 }
    );

    tl.fromTo(
      "#backToMap",
      { bottom: "-30rem" },
      { bottom: "-10rem", duration: reduceAnims ? 0 : 0.5 }
    );

    tl.fromTo(
      ".stickyNote",
      { zoom: 2, visibility: "hidden" },
      {
        zoom: 1,
        visibility: "visible",
        stagger: 0.1,
        duration: reduceAnims ? 0 : 0.5,
      }
    );

    tl.fromTo(
      "#collageImage",
      { scale: 4, display: "none" },
      {
        scale: 1,
        display: "block",
        duration: reduceAnims ? 0 : 0.5,
        onComplete: () => {
          // Show toast and add notification in context
          setShowToast(true);
          addNotification("entry", locationId, { id: locationId });
          setTimeout(() => setShowToast(false), 1500);
          clearPhotoReel();
        },
      }
    );
  }, [locationId, addNotification]);

  // Animate sticker index cards
  useEffect(() => {
    const tl = gsap.timeline();
    const indexCards = document.querySelectorAll(".indexCard");

    indexCards.forEach((ic) => {
      const rotation = Math.random() * 10 - 5;
      tl.fromTo(
        ic,
        { opacity: 0, rotate: 0 },
        { rotate: rotation, opacity: 1 }
      );
      new ScrapbookDeskItem(ic, rotation, 0, 0);
    });
  }, [stickerRefs]);

  return (
    <div
      className="w-full h-full absolute top-0 left-0 z-20 overflow-clip touch-none select-none flex flex-col items-center"
      style={{
        backgroundImage: "url(woodendesk.jpg)",
        backgroundSize: "cover",
      }}
    >
      {showToast && <Toast message="Travel log saved" />}

      <button onClick={() => setShowSummaryPage(false)}>
        <div
          id="pens"
          className="absolute left-5 w-40 h-96 z-30 -top-24 rotate-12"
          style={{
            backgroundImage: `url(/pens.png)`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <StickyNote className="rotate-6 top-4 left-0">
          Back to editing
        </StickyNote>
      </button>

      <div className="flex flex-col items-center gap-2">
        {stickerRefs.map((stickerObj, i) => (
          <div
            className="indexCard z-10 absolute w-96 h-64 draggable select-none"
            key={i}
            style={{
              top: `${Math.random() * 300 + 30}px`,
              left: `${Math.random() * 40}px`,
            }}
          >
            <LibraryIndexCard stickerObj={stickerObj} />
          </div>
        ))}

        <img
          src={collageImage}
          id="collageImage"
          className="draggable z-20 w-1/2 absolute top-1/3 -rotate-6 drop-shadow-2xl border-2 border-black select-none"
        />

        <StickyNote className="hidden md:block -rotate-6 right-0 top-10">
          Save your travel log
          <a
            href={collageImage}
            download={`anywhere-adventures-${locationId}`}
            className="underline"
          >
            <div>Download</div>
          </a>
        </StickyNote>

        <StickyNote
          className="visible md:hidden -rotate-6 w-32 h-32"
          position={{ right: 10, top: 10 }}
        >
          <div>Tap and hold the image to save to your phone</div>
        </StickyNote>

        <a href={`/${mdx.location[0].toLowerCase()}/${locationId}`}>
          <div
            id="backToMap"
            className="absolute z-30 -right-10 -rotate-6 drop-shadow-xl"
            style={{
              width: "15rem",
              height: "25rem",
              backgroundImage: "url(/loc/map.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <StickyNote className="bottom-4 right-0 -rotate-6">
            Return to the map
          </StickyNote>
        </a>
      </div>
    </div>
  );
}
