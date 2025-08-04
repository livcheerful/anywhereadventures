"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import interact from "interactjs";
import StickyNote from "./StickyNote";
import Toast from "./Toast";
import LibraryIndexCard from "./scrapbook/LibraryIndexCard";
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
      start: (event) => {},
      move: (event) => {
        this.x += event.dx;
        this.y += event.dy;
        updateTransform();
      },
      end: (event) => {},
    },
  });
}

export default function ScrapbookDeskPage({
  collageImage,
  locationId,
  stickerRefs,
  setShowSummaryPage,
}) {
  const [showToast, setShowToast] = useState(false);
  useGSAP(() => {
    const tl = gsap.timeline();
    new ScrapbookDeskItem(document.querySelector("#collageImage"), -6, 0, 0);
    tl.fromTo("#pens", { top: "-33rem", delay: 1 }, { top: "-4rem" });
    tl.fromTo("#backToMap", { bottom: "-30rem" }, { bottom: "-10rem" });
    tl.fromTo(
      ".stickyNote",
      { zoom: 2, visibility: "hidden" },
      {
        zoom: 1,
        visibility: "visible",
        stagger: ".1",
      }
    );
    tl.fromTo(
      "#collageImage",
      { scale: 4, display: "none" },
      {
        scale: 1,
        display: "block",
        onComplete: () => {
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 1500);
        },
      }
    );
  }, []);
  useGSAP(() => {
    const tl = gsap.timeline();
    const indexCards = document.querySelectorAll(".indexCard");

    indexCards.forEach((ic, i) => {
      const rotation = Math.random() * 10 - 5;
      tl.fromTo(
        ic,
        { opacity: 0, rotate: 0 },
        {
          rotate: rotation,
          opacity: 1,
        }
      );
      new ScrapbookDeskItem(ic, rotation, 0, 0);
    });
  }, [stickerRefs]);
  return (
    <div
      className="w-full h-full absolute top-0 left-0  z-20 overflow-clip touch-none select-none flex flex-col items-center"
      style={{
        backgroundImage: "url(woodendesk.jpg)",
        backgroundSize: "cover",
      }}
    >
      {showToast && <Toast message={"Travel log saved"} />}
      <button
        onClick={() => {
          setShowSummaryPage(false);
        }}
      >
        <div
          id="pens"
          className="absolute left-5 w-40 h-96 z-30 -top-24 rotate-12"
          style={{
            backgroundImage: `url(/pens.png)`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <StickyNote className={"rotate-6 top-4 left-0"}>
          Back to editing
        </StickyNote>
      </button>
      <div className="flex flex-col items-center gap-2 ">
        {/* <a
          className="w-1/3 h-fit"
          href={collageImage}
          download={`loc-${locationId}.jpg`}
        >
          <div className=" p-2 text-center text-white font-bold bg-purple-400 rounded-lg grow-0">
            Download
          </div>
        </a>

        <a className="w-1/3 h-fit" href="/">
          <div className=" p-2 text-center text-white font-bold bg-purple-400 rounded-lg grow-0">
            Return to map
          </div>
        </a>

        <a className="w-1/3 h-fit" href="/journal">
          <div className=" p-2 text-center text-white font-bold bg-purple-400 rounded-lg grow-0">
            To scrapbook
          </div>
        </a> */}
        {stickerRefs.map((stickerObj, i) => {
          return (
            <div
              className="indexCard z-10 absolute w-96 h-64 draggable  select-none"
              key={i}
              style={{
                top: `${Math.random() * 300 + 30}px`,
                left: `${Math.random() * 40}px`,
              }}
            >
              <LibraryIndexCard stickerObj={stickerObj} />
            </div>
          );
        })}
        <img
          src={collageImage}
          id="collageImage"
          className="draggable z-20 w-1/2 absolute top-10 -rotate-6 drop-shadow-2xl border-2 border-black select-none"
        />
        <a href={collageImage} download={`anywhere-adventures-${locationId}`}>
          <StickyNote
            className={"hidden md:visible -rotate-6 left-0 bottom-10"}
          >
            Save your travel log
          </StickyNote>
        </a>

        <StickyNote
          className="visible md:hidden -rotate-6 w-32 h-32"
          position={{ right: 10, top: 10 }}
        >
          <div>Tap and hold the image to save</div>
        </StickyNote>
        <a href={`/${locationId}`}>
          <div
            id="backToMap"
            className="  absolute z-30 -right-10 -rotate-6 drop-shadow-xl"
            style={{
              width: "15rem",
              height: "25rem",
              backgroundImage: "url(/loc/map.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <StickyNote className={"bottom-4 right-0 -rotate-6"}>
            Return to the map
          </StickyNote>
        </a>
      </div>
    </div>
  );
}
