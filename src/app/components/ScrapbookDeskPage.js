"use client";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import interact from "interactjs";
import StickyNote from "./StickyNote";
import Toast from "./Toast";
import LibraryIndexCard from "./scrapbook/LibraryIndexCard";
import { getSettings, clearPhotoReel } from "../lib/storageHelpers";
import { useNotifications } from "../lib/NotificationsContext";

function createDownloadableImage(dataUrl, filename) {
  // Convert base64/URL-encoded data to raw binary
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });
  const blobUrl = URL.createObjectURL(blob);

  return { blobUrl, filename };
}

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
  const [pageHeight, setPageHeight] = useState(100);
  const { addNotification } = useNotifications();
  const { blobUrl, filename } = createDownloadableImage(
    collageImage,
    `anywhere-adventures-${locationId}.png`
  );

  // Animate desk + collage
  useEffect(() => {
    const reduceAnims = getSettings().reduceAnims;
    const tl = gsap.timeline();

    new ScrapbookDeskItem(document.querySelector("#collageImage"), 0, 0, 0);

    tl.fromTo(
      "#collageImage",
      { scale: 1.3, display: "block", rotate: -50 },
      {
        scale: 1,
        display: "block",
        rotate: 0,
        duration: reduceAnims ? 0 : 0.5,
        top: 20,
        right: 10,
        onComplete: () => {
          // Show toast and add notification in context
          setShowToast(true);
          addNotification("entry", locationId, { id: locationId });
          setTimeout(() => setShowToast(false), 1500);
          clearPhotoReel();
        },
      }
    );
    tl.fromTo(
      "#backToMap",
      { bottom: "-30rem" },
      { bottom: "-15rem", duration: reduceAnims ? 0 : 0.5 }
    );
  }, [locationId, addNotification]);

  useEffect(() => {
    const h = window.innerHeight;
    setPageHeight(h);
  }, []);

  // Animate sticker index cards
  useEffect(() => {
    const tl = gsap.timeline();
    const indexCards = document.querySelectorAll(".indexCard");

    indexCards.forEach((ic, i) => {
      const rotation = i * 3 - 10;
      const x = i * 30;
      const y = i * 30 + pageHeight / 2;
      new ScrapbookDeskItem(ic, rotation, x, y);
      tl.fromTo(
        ic,
        { opacity: 0, rotate: 0, x: 0, y: 600 },
        { rotate: rotation, opacity: 1, x: x, y: y, duration: 0.4 }
      );
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
        <div className="fixed z-[100] left-0 top-4 py-1 px-3 text-center text-black bg-amber-300 border-t-2 border-r-2 border-b-2 border-black h-fit font-bold font-mono drop-shadow-lg">
          Back to editing
        </div>
      </button>

      <div className="flex flex-col items-center gap-2">
        {stickerRefs && stickerRefs.length > 0 && (
          <StickyNote
            id="archiveItemsNote"
            className="-rotate-6 w-32 h-32 flex flex-col gap-2 z-10"
            position={{ left: 0, top: pageHeight / 2 - 90 }}
          >
            <div className="font-bold  leading-tight">Archive items used</div>
          </StickyNote>
        )}
        {stickerRefs.map((stickerObj, i) => (
          <div
            className="indexCard z-30 absolute w-80 h-56 draggable select-none"
            key={i}
          >
            <LibraryIndexCard
              stickerObj={stickerObj}
              locationRef={locationId}
            />
          </div>
        ))}

        <img
          src={blobUrl}
          id="collageImage"
          className="absolute z-40  w-2/3 drop-shadow-2xl select-none draggable"
          alt="collage"
          style={{ right: 0 }}
        />
        <StickyNote
          className="-rotate-6 w-32 h-32 flex flex-col gap-2"
          position={{ left: 0, top: 40 }}
        >
          <div className="font-bold uppercase leading-tight">
            Your Travel Log Entry
          </div>
          <div
            style={{ fontSize: "10px" }}
            className="visible md:hidden font-light leading-tight italic"
          >
            Tap and hold the image to save to your phone
          </div>
          <div className="hidden md:block text-sm">
            <a href={blobUrl} download={filename} className="underline">
              Download
            </a>
          </div>
        </StickyNote>
        <a href={`/${mdx.location[0].toLowerCase()}/${locationId}`}>
          <div
            id="backToMap"
            className="absolute z-30 -right-32 -rotate-6 drop-shadow-xl border-2 border-black"
            style={{
              width: "15rem",
              height: "25rem",
              backgroundImage: "url(/loc/map.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="bg-lime-300 absolute font-bold w-44 px-2 py-1 text-black border-2 border-black z-40 -right-2 bottom-3 drop-shadow-xl">
            Return to the map
          </div>
        </a>
      </div>
    </div>
  );
}
