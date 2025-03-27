"use client";
import { useState, useEffect, use } from "react";
import { gsap } from "gsap/gsap-core";
import { saveStamp } from "../lib/storageHelpers";
import { makeConfetti } from "../lib/animationHelpers";
export default function StampCollector({ slug }) {
  const [stampSvgs, setStampSvgs] = useState(new Map());
  const [stampPadString, setStampPadString] = useState("");
  const [stampList, setStampList] = useState([]);
  const [post, setPost] = useState();
  const [stampId, setStampId] = useState();
  const [currentStamppadId, setCurrentStamppadId] = useState(0);
  const colorList = ["#fcba03", "#73fc03", "#f04fc0"];

  const defaultStamp = "seattle-general-2.svg";
  // =*==*==*==*==*==*==*==*==*=animations=*==*==*==*==*==*==*==*==*==*=
  function stampAnim() {
    const tl = gsap.timeline();
    tl.to("#stamphandle", { duration: ".4", top: "30px" });
    tl.to("#stamphandle", { duration: ".4", top: "0px" });
    tl.to("#stamphandle", {
      top: "200px",
      onComplete: () => {
        stampItWahoo(stampId);
        // const bottomY = document.getElementById("#stamphandle").bottom;
        const paper = document.querySelectorAll("#stamphandle")[0];
        const box = paper.getBoundingClientRect();
        console.log(box);
        makeConfetti(
          paper.parentElement,
          box.x + box.width / 2,
          box.y + box.height / 2 - 50,
          10
        );
      },
    });
    tl.to("#stamphandle", { top: "0px" });
  }

  function paperAnim() {
    gsap.fromTo(
      "#paper",
      { rotate: "10deg", bottom: "-70px" },
      { rotate: "0deg", bottom: "20px" }
    );
  }
  // =*==*==*==*==*==*==*==*==*=animations=*==*==*==*==*==*==*==*==*==*=

  // Helper to grab the SVG as text
  async function fetchSVG(stampName) {
    if (!stampName) return;
    const file = await fetch(`/stamps/${stampName}`);
    const f = await file.text();
    console.log("in fetch svg");
    console.log(f);
    return f;
  }

  // Starts the call to fetch stamp and adds it to our map
  async function fetchStampSVG(stampName) {
    const f = await fetchSVG(stampName);
    const updatedMap = new Map(stampSvgs);
    updatedMap.set(stampName, f);
    setStampSvgs(updatedMap);
  }

  // If the stamp string exists in our map, fetch it. if not, start a request to get it.
  function getStampString(stampName) {
    if (!stampSvgs.has(stampName)) {
      fetchStampSVG(stampName);
      return undefined;
    } else {
      return stampSvgs.get(stampName);
    }
  }

  function showStamppads() {
    const items = colorList.map((color, i) => {
      return (
        <div
          key={i}
          className="stamppad w-[10rem] shrink-0  snap-center snap-mandatory"
          dangerouslySetInnerHTML={{ __html: stampPadString }}
        ></div>
      );
    });
    return items;
  }

  function stampItWahoo(id) {
    const list = [];
    list.push({
      slug: slug,
      id: id,
      color: colorList[currentStamppadId],
      dateCollected: new Date(),
    });
    saveStamp(list);
    setStampList(list);
  }

  useEffect(() => {
    async function fetchPost(fileName) {
      const file = await fetch(`/content/generated/${fileName}.json`);
      const f = await file.json();

      setPost(f);
    }
    async function fetchStamppad() {
      const f = await fetchSVG("stamp-pad.svg");
      setStampPadString(f);
    }
    fetchStamppad();
    fetchPost(slug);
    // Load one sheet of paper in frame.
    paperAnim();
  }, []);

  useEffect(() => {
    if (post) {
      const stampFile = post.stampName || defaultStamp;
      getStampString("stamp-pad.svg");
      getStampString(stampFile);
      setStampId(stampFile);
    }
  }, [post]);
  useEffect(() => {
    // Update Colors
    if (!stampPadString) return;
    const pads = document.querySelectorAll(
      ".stamppad  [custom='stamp-pad-color']"
    );
    if (!pads) return;
    for (let i = 0; i < pads.length; i++) {
      pads[i].style.fill = colorList[i];
    }
    for (let i = 0; i < stampList.length; i++) {
      const stamp = stampList[i];
      const id = stamp.id.substring(0, stamp.id.length - ".svg".length);
      const query = `#${id}-${i} [custom='background-color']`;
      const stampElem = document.querySelector(query);
      if (!stampElem) return;
      stampElem.style.fill = stamp.color;
    }
  });

  return (
    <div className="w-full h-fit">
      <div className="flex flex-col items-center w-full">
        <img
          id="stamphandle"
          className="h-[15rem] relative z-20"
          src="/stamps/stamphandle.png"
          onClick={() => {
            stampAnim();
          }}
        />
        {/* <div
          className="absolute bg-purple-500 p-2 rounded-lg"
          onClick={() => {
            paperAnim();
          }}
        >
          Test Button
        </div> */}
        {stampPadString && (
          <div
            id={"stamppads"}
            onScroll={(e) => {
              const pads = document.getElementsByClassName("stamppad");
              for (let i = 0; i < pads.length; i++) {
                const thisPad = pads[i];
                const rect = thisPad.getBoundingClientRect();
                const thisPadsAboutX = rect.x + rect.width / 2;
                if (thisPadsAboutX == window.innerWidth / 2) {
                  setCurrentStamppadId(i);
                }
              }
            }}
            className=" flex flex-row overflow-x-scroll gap-2 w-full snap-x px-[10rem]"
          >
            {showStamppads()}
          </div>
        )}

        <div className="font-bold text-lg bg-pink-200 p-3 w-fit -rotate-12 z-10">
          Collect your stamp
        </div>
        {stampList.length == 0 && (
          <div
            id="paper"
            className="fixed bottom-0 bg-white drop-shadow-xl"
            style={{ width: "15rem", height: "15rem" }}
          ></div>
        )}
        <div className="flex flex-col items-center">
          {stampList.map((stamp, index) => {
            const id = stamp.id;
            return (
              <div
                key={index}
                className=" bg-white fixed drop-shadow-xl flex flex-col items-center justify-center "
                style={{ width: "15rem", height: "15rem", bottom: "20px" }}
              >
                <div
                  id={`${id.substring(0, id.length - ".svg".length)}-${index}`}
                  className="w-[12rem] h-[12rem] self-center"
                  dangerouslySetInnerHTML={{
                    __html: getStampString(stamp.id),
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
