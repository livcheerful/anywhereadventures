"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import JournalPage from "../JournalPage";
import SearchParamHandler from "../SearchParamHandler";
import Box from "../ui/Box";
import BaseButton from "../ui/BaseButton";
import TableOfContents from "../TableOfContents";
import Toast from "../Toast";
import JournalNav from "../JournalNav";
import gsap from "gsap";
import { savedLocationToObj } from "../../lib/locationHelpers";
import {
  getHomeLocation,
  hasLocationBeenVisited,
  haveSeenJournal,
  setHaveSeenJournal,
  getSettings,
} from "../../lib/storageHelpers";
import CornerTape from "../CornerTape";

import { useNotifications } from "../../lib/NotificationsContext";

export default function JournalClient({}) {
  const [showToc, setShowToc] = useState(false);
  const [refSlug, setRefSlug] = useState(undefined);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [screenIdx, setScreenIdx] = useState(0);
  const tocRef = useRef();
  const tocAnim = useRef();
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [homeLoc, setHomeLoc] = useState(undefined);
  const [locData, setLocData] = useState(undefined);
  const [reduceAnim, setReduceAnim] = useState(true);

  const { notifications } = useNotifications();

  const [newSavedItems, setNewSavedItems] = useState([]);
  const [newEntries, setNewEntries] = useState([]);

  // Whenever notifications change, update saved items / entries
  useEffect(() => {
    if (!notifications) return;

    const items = notifications.filter((i) => i.type === "lcItem");
    setNewSavedItems(items);

    const entries = notifications.filter((i) => i.type === "entry");
    setNewEntries(entries);
  }, [notifications]);

  // Clear temporary copied alert
  useEffect(() => {
    if (!copiedAlert) return;
    const t = setTimeout(() => setCopiedAlert(false), 2000);
    return () => clearTimeout(t);
  }, [copiedAlert]);

  // On mount, initialize home location, loc data, intro, reduceAnim
  useEffect(() => {
    setShowIntro(!haveSeenJournal());
    const loc = getHomeLocation();
    setHomeLoc(loc);
    setLocData(savedLocationToObj(loc));
    setReduceAnim(getSettings().reduceAnims);
  }, []);

  function addHomeLocationStickers() {
    switch (homeLoc) {
      case "Seattle":
        return [
          <div
            className="rotate-3 w-48 h-fit bottom-10 absolute left-3"
            key={1}
          >
            <CornerTape directions={{ ne: true, nw: true }}>
              <img src="/loc/seattle/montlakeBridge/canalRoutes.png" />
            </CornerTape>
          </div>,
          <div
            className="bg-yellow-300 p-2 px-8 absolute -rotate-12 right-7 bottom-1/3 text-black font-bold"
            key={2}
          >
            Seattle
          </div>,
          <div className="-rotate-6 w-48 h-fit top-10 absolute right-0" key={3}>
            <CornerTape directions={{ nw: true, se: true }}>
              <img src="/loc/regrade-results.jpg" />
            </CornerTape>
          </div>,
        ];
      case "Southeast Wyoming":
        return [
          <div className="absolute left-3 bottom-1/3" key={1}>
            <CornerTape>
              <img
                className="w-56 h-auto rotate-2 drop-shadow-2xl text-black"
                src="/loc/sewy/wypack.png"
              />
            </CornerTape>
          </div>,
          <div
            className="bg-yellow-300 p-2 px-8 absolute -rotate-12 right-7 bottom-1/3 font-bold text-lg"
            key={2}
          >
            Wyoming
          </div>,
        ];
      default:
        return [];
    }
  }

  const screens = [
    <div className="flex flex-col justify-between h-full pb-2" key={0}>
      <div className="flex flex-col">
        <img
          src="/illustrations/travellog.jpg"
          className="border-b-2 border-gray-800"
        />
        <div className="p-2">
          <h1 className="font-bold text-lg">This is your travel log</h1>
          <div>
            As you visit story locations, collect photos and create entries for
            your visits.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <BaseButton
          onClick={() => setScreenIdx(screenIdx + 1)}
          classes={["bg-lime-200", "active:bg-lime-300"]}
        >
          Next
        </BaseButton>
        <a href="/" className="underline text-sm">
          Back to map
        </a>
      </div>
    </div>,
    <div
      className="flex flex-col justify-between h-full pb-2  overflow-y-auto"
      key={1}
    >
      <div className="flex flex-col">
        <img
          src="/illustrations/swipe.gif"
          className="border-b-2 border-gray-800"
        />
        <div className="p-2">
          <h1 className="font-bold text-lg">
            See where you haven't visited yet
          </h1>
          <div>
            Swipe to see the entries you've created and the places you still
            haven't been. You can also navigate via the table of contents.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <BaseButton
          onClick={() => setScreenIdx(screenIdx + 1)}
          classes={["bg-lime-200", "active:bg-lime-300"]}
        >
          Next
        </BaseButton>

        <button
          onClick={() => setScreenIdx(screenIdx - 1)}
          className="underline text-sm"
        >
          Back
        </button>
      </div>
    </div>,
    <div className="flex flex-col justify-between h-full pb-2" key={2}>
      <div className="flex flex-col">
        <img
          src="/illustrations/saveitems.png"
          className="border-b-2 border-gray-800"
        />
        <div className="p-2">
          <h1 className="font-bold text-lg">Save archive items for later</h1>
          <div>
            You can also see all your saved archives items here for easy
            reference later. You can also use them in your entries as stickers.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <BaseButton
          onClick={() => {
            setShowIntro(false);
            setHaveSeenJournal(true);
          }}
          classes={["bg-lime-200", "active:bg-lime-300"]}
        >
          Start
        </BaseButton>
        <button
          onClick={() => setScreenIdx(screenIdx - 1)}
          className="underline text-sm"
        >
          Back
        </button>
      </div>
    </div>,
  ];

  useEffect(() => {
    if (!tocRef.current) return;
    tocAnim.current = gsap.timeline({ paused: true });
    tocAnim.current.fromTo(
      tocRef.current,
      { y: "100%" },
      {
        y: "0%",
        duration: 0.4,
        ease: "power2.out",
        onReverseComplete: () => {
          tocRef.current.style.visibility = "hidden";
        },
        onStart: () => {
          tocRef.current.style.visibility = "visible";
        },
      }
    );
  }, []);

  useEffect(() => {
    if (!tocAnim.current) return;
    const reduce = getSettings().reduceAnims;
    if (reduce) {
      tocRef.current.style.transform = showToc
        ? "translateY(0%)"
        : "translateY(100%)";
      tocRef.current.style.visibility = showToc ? "visible" : "hidden";
    } else {
      showToc ? tocAnim.current.play() : tocAnim.current.reverse();
    }
  }, [showToc]);

  useEffect(() => {
    if (!refSlug) return;
    const homeLoc = getHomeLocation();
    const locData = savedLocationToObj(homeLoc);
    const reduce = getSettings().reduceAnims;
    const allLocs = locData.locs;
    const index = allLocs.findIndex((l) => l.slug === refSlug);
    const page = document.querySelector(`#page-${Math.floor(index / 2) + 1}`);
    page?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, [refSlug]);

  function handleSearchParams(kvp) {
    setRefSlug(kvp["id"]);
  }

  function makeJournalPages() {
    if (!locData?.locs) return [];
    const allLocs = locData.locs.filter((f) => {
      return !f.hidden;
    });

    let pageCount = 1;
    const pages = [];

    function countVisited() {
      return allLocs.reduce(
        (acc, loc) => acc + (hasLocationBeenVisited(loc.slug) ? 1 : 0),
        0
      );
    }

    for (let i = 0; i < allLocs.length; i += 2) {
      pages.push(
        <div
          key={pageCount}
          className="w-full shrink-0"
          id={`page-${pageCount}`}
        >
          <JournalPage
            pageNumber={pageCount++}
            locations={[allLocs[i], allLocs[i + 1]]}
            totalNumLocs={allLocs.length}
            numVisited={countVisited()}
          />
        </div>
      );
    }

    return pages;
  }

  return (
    <div className="h-dvh w-full relative bg-white overflow-y-hidden">
      {showIntro && (
        <div className="w-full h-full absolute top-0 left-0 bg-white/40 z-20 border-2 border-black">
          <Box
            isModal
            className="bg-yellow-200 left-[12.5%] top-[18%] h-2/3 w-3/4"
          >
            {screens[screenIdx]}
          </Box>
        </div>
      )}
      <Suspense>
        <SearchParamHandler paramsToFetch={["id"]} cb={handleSearchParams} />
      </Suspense>
      <div>
        <div
          id="journal-holder"
          className="flex flex-row snap-x snap-mandatory overflow-x-auto pb-20 gap-4"
        >
          <div
            className="w-full shrink-0 h-dvh snap-start flex flex-col items-center relative"
            style={{
              backgroundImage: "url(/notebook3.png)",
              backgroundSize: "contain",
            }}
          >
            <div className="bg-yellow-200 border-2 border-gray-800 w-fit h-fit top-1/4 relative p-4 rounded-lg drop-shadow-sm flex flex-col gap-2">
              <div className="text-center text-black">my</div>
              <div className="font-mono text-gray-800 font-bold text-2xl">
                Anywhere Adventures
              </div>
              <div className="text-center font-mono text-sm text-black">
                with the Library of Congress
              </div>
            </div>
            {addHomeLocationStickers()}
            <div className="absolute right-2 bottom-24 -rotate-6 flex flex-col items-center justify-center drop-shadow-lg">
              <div className="text-xl font-vivian bg-lime-200 text-blue-800 p-1">
                Swipe to open
              </div>
              <img
                className={`w-12 ml-10 ${!reduceAnim && "animate-bounce-x"}`}
                src="/arrow.svg"
              />
            </div>
          </div>
          {makeJournalPages()}
          <div
            ref={tocRef}
            style={{ visibility: "hidden" }}
            className="fixed z-10 left-0 top-0 bg-white w-full md:w-limiter h-full overflow-y-auto drop-shadow-2xl"
          >
            <TableOfContents
              setShowToc={setShowToc}
              setCopiedAlert={setCopiedAlert}
              newEntries={newEntries}
            />
          </div>
        </div>
      </div>
      {copiedAlert && <Toast message={copiedAlert} />}
      <JournalNav
        notifications={notifications}
        showToc={showToc}
        setShowToc={setShowToc}
        showSavedItems={showSavedItems}
        setShowSavedItems={setShowSavedItems}
        newEntries={newEntries}
        newSavedItems={newSavedItems}
      />
    </div>
  );
}
