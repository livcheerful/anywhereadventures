"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { gsap } from "gsap";

import Camera from "../components/Camera";
import StampCollector from "../components/StampCollector";
import Navbar from "../components/Navbar";

export default function Page() {
  const [picture, setPicture] = useState(undefined);
  const [showMenuButtons, setShowMenuButtons] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const refSlug = searchParams.get("refSlug");
  const slug = searchParams.get("locationId");

  function kickoffSummaryAnimation() {
    gsap.to("#picture", {
      duration: 1,
      position: "absolute",
      top: "10px",
      left: "-19px",
      rotate: "-25deg",
      scale: 0.9,
      onComplete: () => {
        setShowMenuButtons(true);
      },
    });
  }
  useEffect(() => {
    if (picture) {
      gsap.fromTo(
        "#picture",
        { scale: 0.1 },
        {
          position: "absolute",
          top: "50%",
          duration: 1,
          rotate: 720,
          scale: 1.4,
          onComplete: () => {
            setTimeout(() => {
              kickoffSummaryAnimation();
            }, 1000);
          },
        }
      );
    }
  }, [picture]);

  return (
    <div
      className="flex flex-col relative w-screen h-screen overflow-hidden"
      style={{
        background: `url("/loc/sba-journal-blank.jpg")`,
        backgroundSize: "cover",
      }}
    >
      {/* Show the photo strip */}
      {picture && (
        <div
          id="picture"
          className="output flex flex-col relative w-fit max-w-[15rem] max-h-[15rem]"
        >
          <img className="" src={picture} />
        </div>
      )}
      {showMenuButtons && (
        <div className="w-full h-screen">
          <Navbar />
          <div
            className="w-fit flex flex-col gap-2 right-4 absolute "
            style={{ top: "10px" }}
          >
            <button
              className="py-3 px-2 h-fit bg-emerald-200 hover:bg-emerald-400 font-bold text-emerald-800 rounded-lg drop-shadow-lg"
              onClick={() => {
                setShowMenuButtons(false);
                setPicture(undefined);
              }}
            >
              Retake
            </button>
            <button
              className="py-3 px-2 h-fit bg-emerald-200 hover:bg-emerald-400 font-bold text-emerald-800 rounded-lg drop-shadow-lg"
              onClick={() => {
                const dataURL = document
                  .getElementById("canvas")
                  .toDataURL("image/png");
                var a = document.createElement("a");
                // Set the link to the image so that when clicked, the image begins downloading
                a.href = dataURL;
                // Specify the image filename
                a.download = "canvas-download.png";
                // Click on the link to set off download
                a.click();
              }}
            >
              Download
            </button>
            <button
              className="py-3 px-2 h-fit bg-emerald-200 hover:bg-emerald-400 font-bold text-emerald-800 rounded-lg drop-shadow-lg"
              onClick={() => {
                console.log("Hello vivian");
                router.push(`/${refSlug}`);
              }}
            >
              Back to reading
            </button>
          </div>
        </div>
      )}
      {showMenuButtons && (
        <div className="absolute w-full" style={{ top: "30%" }}>
          <div className="absolute w-full" style={{ top: "-30px" }}>
            <StampCollector slug={slug} />
          </div>
        </div>
      )}
      <Suspense>
        <Camera
          picture={picture}
          setPicture={setPicture}
          kickoffSummaryAnimation={kickoffSummaryAnimation}
        />
      </Suspense>
    </div>
  );
}
