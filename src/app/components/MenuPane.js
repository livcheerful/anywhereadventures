"use client";

import gsap from "gsap";
import { useEffect, useState, useRef } from "react";
import { clearAll, getSettings, updateSettings } from "../lib/storageHelpers";
import FocusLock from "react-focus-lock";

export default function MenuPane({
  showingMenu,
  homeLoc,
  reduceAnims,
  setReduceAnims,
  updateRoute,
  setShowingWelcomeScreen,
  setShowingMenu,
}) {
  const menuRef = useRef();
  const menuHeaderRef = useRef();
  const menuAnimRef = useRef();
  const [showClearWarning, setShowClearWarning] = useState(false);

  useEffect(() => {
    setupAnimations();
  }, []);

  useEffect(() => {
    if (reduceAnims) {
      if (showingMenu) {
        menuRef.current.style.visibility = "visible";
        menuRef.current.style.transform = "translateY(0%)";
      } else {
        menuRef.current.style.visibility = "hidden";
        menuRef.current.style.transform = "translateY(-100%)";
      }
    } else {
      showMenuAnim(showingMenu);
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setShowingMenu(!showingMenu);
      }
    }

    if (showingMenu) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showingMenu]);

  function showMenuAnim(shouldShow) {
    const tl = menuAnimRef.current;

    if (!tl) return;
    shouldShow ? tl.play() : tl.reverse();
  }

  function setupAnimations() {
    if (!menuRef.current) return;
    menuAnimRef.current = gsap.timeline({ paused: true });

    menuAnimRef.current.fromTo(
      menuRef.current,
      { y: "-100%" },
      {
        y: "0%",
        duration: 0.4,
        ease: "power2.out",
        onReverseComplete: () => {
          menuRef.current.style.visibility = "hidden";
        },
        onStart: () => {
          menuRef.current.style.visibility = "visible";
        },
      }
    );
    setReduceAnims(getSettings().reduceAnims);
  }
  return (
    <FocusLock disabled={!showingMenu} autoFocus>
      <div
        className="fixed pt-4 z-40 top-0 left-0 w-full md:w-limiter h-dvh bg-white overflow-y-auto border-2 border-black  rounded-b-md"
        ref={menuRef}
        style={{ visibility: "hidden" }}
      >
        <button
          className="w-6 ml-4"
          aria-label="Close Menu"
          onClick={() => {
            setShowingMenu(false);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" />
          </svg>
        </button>
        <div className="bg-white flex flex-col justify-between h-full gap-8 text-black font-bold overflow-y-auto">
          <div className="flex flex-col pb-3">
            <div
              ref={menuHeaderRef}
              tabIndex={-1}
              className="w-full text-center text-lg"
            >
              Menu
            </div>
            <hr></hr>
            <div>
              <div className=" bg-lime-100 px-2 pt-3">Settings</div>
              <hr className="border-gray-300 pb-2"></hr>
            </div>
            <div className="px-2">
              <div className="w-full bg-white border-lime-300 p-2  rounded-lg border-2 flex flex-col gap-2 items-center drop-shadow-sm font-normal">
                <div className="w-full">
                  <div className="text-gray-400 font-mono text-xs font-light">
                    Home Location
                  </div>
                  <div className="flex flex-row items-baseline gap-4">
                    <div className="text-md text-gray-800 ">{homeLoc}</div>
                    <button
                      className="underline text-black"
                      onClick={() => {
                        updateRoute(`/`);
                        setShowingWelcomeScreen(true);
                        setWelcomeScreenStartIndex(2);
                      }}
                    >
                      <div className="font-bold">Change</div>
                    </button>
                  </div>
                </div>
                <hr className="w-full"></hr>
                <label
                  className="flex flex-row gap-2 items-baseline w-full"
                  onClick={() => {}}
                >
                  <input
                    type="checkbox"
                    checked={reduceAnims}
                    onChange={(e) => {
                      updateSettings("reduceAnims", e.target.checked);
                      setReduceAnims(e.target.checked);
                    }}
                  />
                  <div className="font-bold">Reduce animations</div>
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-gray-700">
            <div>
              <hr className="border-gray-300"></hr>
              <div className="px-2 text-black bg-lime-100 pt-3">
                Want more Anywhere Adventures?
              </div>
              <hr></hr>
            </div>
            <div className="flex flex-col gap-4">
              <div className="px-2">
                <div className=" bg-white border-lime-300 p-2  rounded-lg border-2 flex flex-col items-center drop-shadow-sm  font-normal">
                  <h1 className="py-2 font-bold">
                    Share your adventures online
                  </h1>
                  <hr className="w-full border-lime-300 pb-2"></hr>
                  <div>
                    Share the travel log entries you've created by posting them
                    online and tagging the{" "}
                    <a
                      className="underline font-light pt-2"
                      href="https://www.instagram.com/librarycongress/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Library of Congress
                    </a>
                    .
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className=" bg-white border-lime-300 p-2  rounded-lg border-2 flex flex-col items-center drop-shadow-sm font-normal">
                  <h1 className=" py-2 font-bold">Get in touch</h1>
                  <hr className="w-full border-lime-300 pb-2"></hr>
                  <div>
                    Have something you want to share? Have a note about one of
                    the stories? Send us a message! Email Vivian at{" "}
                    <a
                      className="underline font-light pt-2"
                      href="mailto:lc-labs@loc.gov"
                    >
                      lc-labs@loc.gov
                    </a>
                    .
                  </div>
                </div>
              </div>

              <div className="px-2">
                <div className="bg-lime-300 p-2  rounded-lg border-2 border-gray-800 flex flex-col items-center drop-shadow-sm">
                  <h1 className="text-2xl py-3 font-bold text-black">
                    Nominate your hometown
                  </h1>
                  <hr className="w-full border-lime-600 pb-2"></hr>
                  <div>
                    Anywhere Adventures is growing! Comment on our blog post to
                    nominate your town.
                  </div>
                  <a
                    className="underline font-light pt-2"
                    href="https://blogs.loc.gov/thesignal/?p=35873&preview=true"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Nominate your hometown
                  </a>
                </div>
              </div>
            </div>

            <button
              className="p-2 m-2 bg-red-600 active:bg-red-700 text-white rounded-lg border-2 border-gray-800"
              onClick={() => {
                setShowClearWarning(true);
              }}
            >
              <div>Clear all data</div>
            </button>
            <div className="font-mono text-gray-400 text-xs font-light p-1 self-end">
              VERSION 0.0.2
            </div>
          </div>
        </div>
      </div>
      {showClearWarning && (
        <FocusLock>
          <div className="fixed bg-white/90 w-full h-full flex flex-col items-center justify-center z-50 p-4 text-black">
            <div className="bg-white flex flex-col gap-2 w-4/5 p-3 border-2 border-gray-800 ">
              <div className="font-bold text-center text-xl pb-2">
                Are you sure you want to clear all your data?
              </div>
              <div>
                This action cannot be undone. All your saved visits and archive
                items will be deleted.
              </div>
              <div className="flex flex-row gap-2 w-full">
                <button
                  className="bg-red-600 active:bg-red-700 font-bold text-white py-1 px-2 grow border-2 border-gray-800 rounded-lg"
                  onClick={() => {
                    clearAll();
                    setShowingMenu(false);
                    setShowingWelcomeScreen(true);
                    setShowClearWarning(false);
                    updateRoute(`/`);
                  }}
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => {
                    setShowClearWarning(false);
                  }}
                  className="bg-white active:bg-lime-100 font-bold grow py-1 px-2 border-2 border-gray-400 rounded-lg"
                >
                  No, take me back
                </button>
              </div>
            </div>
          </div>
        </FocusLock>
      )}
    </FocusLock>
  );
}
