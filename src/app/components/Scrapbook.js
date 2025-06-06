import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import interact from "interactjs";

import ScrapbookCornerDisplay from "./ScrapbookCornerDisplay";
import { ScrapbookElem } from "./ScrapbookElement";

import { getAllLCItems } from "../lib/storageHelpers";

const defaultStickerSize = 300;
function ScrapbookPage(handleDraggingItem, picture) {
  this.topZ = 10;
  this.elements = []; // array for now, maybe diff structure in future
  this.numElems = 0;

  this.picture = picture;

  const pictureDiv = document.createElement("img");
  pictureDiv.src = picture;
  let adjustedWidth = pictureDiv.width;
  let adjustedHeight = pictureDiv.height;
  if (adjustedWidth > adjustedHeight) {
    adjustedWidth = Math.min(480, window.innerWidth);
    adjustedHeight = (pictureDiv.height / pictureDiv.width) * adjustedWidth;
  } else {
    adjustedWidth = (pictureDiv.width / pictureDiv.height) * adjustedHeight;
  }
  this.adjustedWidth = adjustedWidth;
  this.adjustedHeight = adjustedHeight;
  pictureDiv.remove();

  this.startFlatten = async function (onFlattenEnd) {
    const dataUrl = await this.flatten();
    onFlattenEnd(dataUrl);
  };

  this.flatten = async function () {
    const canvas = document.querySelector("#scrapbookCanvas");
    var ctx = canvas.getContext("2d");

    const placeItHere = document.querySelector("#scrapbookPlayground");
    canvas.width = placeItHere.getBoundingClientRect().width;
    canvas.height = window.innerHeight;
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
    // const pictureDiv = document.querySelector("#picture");
    // ctx.drawImage(
    //   pictureDiv,
    //   0,
    //   0,
    //   pictureDiv.getBoundingClientRect().width,
    //   pictureDiv.getBoundingClientRect().height
    // );
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => {
          console.log(e);
          reject(new Error(` Failed to load image: ${src}:`));
        };
        img.src = src;
      });
    }

    for (let i = 0; i < this.elements.length; i++) {
      const elem = this.elements[i];
      console.log(elem);
      switch (elem.type) {
        case "sticker":
          console.log("flatten sticker");
          const sticker = this.elements[i];
          const currElem = sticker.elem;
          const imgSrc = await loadImage(sticker.imgSrc);
          const originalWidth = sticker.originalWidth;
          const originalHeight = sticker.originalHeight;

          const box = currElem.getBoundingClientRect();

          ctx.save();
          ctx.translate(box.left + box.width / 2, box.top + box.height / 2);
          ctx.rotate((sticker.rotation * Math.PI) / 180);
          ctx.scale(sticker.scale, sticker.scale);

          ctx.drawImage(
            imgSrc,
            -originalWidth / 2,
            -originalHeight / 2,
            originalWidth,
            originalHeight
          );

          ctx.restore();
          break;
        case "text":
          console.log("trying to flatten text");
          const svgElement = elem.elem;
          const svgString = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
          });
          const url = URL.createObjectURL(svgBlob);
          const img = await loadImage(url);
          ctx.drawImage(img, 0, 0, 10, 10);
          break;
        default:
          console.log("Default");
          break;
      }
    }

    const dataURL = document
      .getElementById("scrapbookCanvas")
      .toDataURL("image/jpeg", 0.9);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return dataURL;
  };

  this.deleteSticker = function (draggable) {
    const foundIndex = this.elements.indexOf((e) => {
      return e.elem == draggable;
    });
    draggable.remove();
    this.elements.splice(foundIndex, 1);
  };

  this.addNewTextSticker = function (text) {
    const placeItHere = document.querySelector("#scrapbookPlayground");
    const svgDiv = document.createElement("svg");
    svgDiv.id = `sticker-${this.numElems}`;
    const textSvg = document.createElement("text");
    svgDiv.appendChild(textSvg);
    svgDiv.style.position = "absolute";
    svgDiv.style.zIndex = this.topZ;
    svgDiv.style.width = `${200}px`;
    svgDiv.style.top = "0px";
    svgDiv.style.left = "0px";
    const stick = new ScrapbookElem({
      handleDraggingItem: handleDraggingItem,
      type: "text",
      htmlElem: svgDiv,
      id: `sticker-${this.numElems}`,
      z: this.topZ,
      origWidth: 200,
      origHeight: 168.75,
      textSrc: "text",
    });
    this.elements.push(stick);
    this.topZ++;
    this.numElems++;

    textSvg.textContent = text;

    placeItHere.appendChild(svgDiv);
  };

  this.addNewPageSticker = function (img, size, linkOut) {
    const imgDiv = this.addNewSticker(img, size);
    if (linkOut) {
      imgDiv.className = imgDiv.className + " refImage";
      imgDiv.setAttribute("linkout", linkOut);
    }
  };
  this.addNewSticker = function (img, width, height) {
    const placeItHere = document.querySelector("#scrapbookPlayground");
    const imgDiv = document.createElement("img");
    imgDiv.id = `sticker-${this.numElems}`;
    imgDiv.src = img;
    imgDiv.style.position = "absolute";
    imgDiv.style.zIndex = this.topZ;
    imgDiv.style.width = `${width}px`;
    imgDiv.style.top = "0px";
    imgDiv.style.left = "0px";

    const stick = new ScrapbookElem({
      handleDraggingItem: handleDraggingItem,
      type: "sticker",
      htmlElem: imgDiv,
      id: `sticker-${this.numElems}`,
      z: this.topZ,
      origWidth: width,
      origHeight: 168.75,
      imgSrc: img,
    });
    console.log(stick);
    this.elements.push(stick);
    this.topZ++;
    this.numElems++;

    placeItHere.appendChild(imgDiv);

    return imgDiv;
  };
}

export default function Scrapbook({
  reel,
  slug,
  onFinishedScrapbooking,
  setProcessPhotos,
}) {
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [currentTool, setCurrentTool] = useState();
  const [stickers, setStickers] = useState([]);
  const [pageStickers, setPageStickers] = useState([]);
  const [showMyPhotos, setShowMyPhotos] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [scrapbookPage, setScrapbookPage] = useState(
    new ScrapbookPage(handleDraggingItem)
  );
  const [draggingItem, setDraggingItem] = useState(undefined);

  const trashRef = useRef();

  const itemsOnWheel = [
    {
      title: "My Photos",
      image: "/rotatedFilm.png",
      onClickHandler: () => {
        setShowMyPhotos(true);
      },
    },
    {
      title: "Stickers",
      image: "/tempStickerImage.png",
      onClickHandler: () => {
        setShowStickerModal(true);
      },
    },
    {
      title: "Text",
      image: "/tape1.png",
      onClickHandler: () => {
        setShowTextModal(true);
      },
    },
    {
      title: "Scissors",
      image: "/scissorsUp.png",
      onClickHandler: () => {
        setShowStickerModal(true);
      },
    },
    {
      title: "Pen",
      onClickHandler: () => {},
    },
  ];

  useEffect(() => {
    if (!showTextModal) return;
    const textInput = document.getElementById("textStickerInput");
    console.log(textInput);
    textInput.focus();
  }, [showTextModal]);
  useEffect(() => {
    // get all saved LC items
    const lcItems = getAllLCItems();
    setStickers(Object.values(lcItems));

    reel.forEach((image, i) => {
      scrapbookPage.addNewSticker(image, defaultStickerSize);
    });
  }, []);

  useEffect(() => {
    if (!trashRef.current) return;

    const dropZone = interact("#trashZone").dropzone({
      accept: ".trashable",
      overlap: "pointer",
      ondropactivate: (event) => {
        console.log("Drop Activated");
      },
      ondropenter: (event) => {
        console.log("drop entered");
      },
      ondrop: (event) => {
        console.log("Dropped!");
        console.log(event);
        scrapbookPage.deleteSticker(event.draggable.target);
      },
    });

    return () => dropZone.unset();
  }, []);

  useEffect(() => {
    // Get Post based on slug
    async function fetchPost() {
      const file = await fetch(`/content/generated/${slug}.json`);
      const f = await file.json();
      console.log(f.stickers);
      setPageStickers(f.stickers);
    }
    fetchPost();
  }, [slug]);
  useEffect(() => {}, []);

  function handleDraggingItem(element) {
    setDraggingItem(element);
  }

  function makeToolbar() {
    return (
      <div className="w-fit flex flex-row gap-2 pl-2" id="scrapbook-tool-wheel">
        {itemsOnWheel.map((item, i) => {
          return (
            <button
              key={i}
              className="h-36 w-36   flex flex-col pt-2 "
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
              onClick={() => {
                item.onClickHandler();
              }}
            >
              <div className="w-full text-center font-mono font-bold text-gray-700 h-fit "></div>
            </button>
          );
        })}
        <div className="fixed bottom-0 left-0 w-full md:w-limiter bg-blue-200 p-2 flex flex-row gap-2 font-mono text-gray-600 font-bold">
          <button
            onClick={() => {
              setProcessPhotos(false);
            }}
            className="bg-white rounded-full px-4 py-2 grow"
          >
            Back
          </button>
          <button
            onClick={() => {
              scrapbookPage.startFlatten(onFinishedScrapbooking);
            }}
            className="bg-white rounded-full px-4 py-2 grow"
          >
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-hidden z-30">
      {reel && (
        <div className="flex flex-col  w-full h-full absolute top-0 left-0 bg-white"></div>
      )}
      <canvas className="absolute top-0 left-0" id="scrapbookCanvas" />

      <div
        id="scrapbookPlayground"
        className="w-full h-full top-0 left-0 absolute overflow-clip z-10 touch-none select-none"
      ></div>
      {showMyPhotos && (
        <div
          className="md:w-limiter w-full h-full bg-white/80 absolute top-0 flex flex-col justify-end items-center z-50"
          onClick={() => {
            setShowMyPhotos(false);
          }}
        >
          <div className="rounded-t-lg bg-white h-[90%] w-[95%] overflow-y-auto dark:text-black">
            <svg
              className="w-4 "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              onClick={(e) => {
                setShowMyPhotos(false);
                e.stopPropagation();
              }}
            >
              <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
            </svg>
            <div className=" p-2 text-lg font-bold">Your photos</div>
            <div className="flex flex-row flex-wrap gap-2 items-center justify-center p-2">
              {reel?.map((photo, i) => {
                return (
                  <div
                    key={i}
                    style={{ width: "300px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      scrapbookPage.addNewPageSticker(photo, 300);
                      setShowMyPhotos(false);
                    }}
                  >
                    <img src={photo}></img>
                  </div>
                );
              })}
            </div>
          </div>
          <ScrapbookCornerDisplay imgUrl="/rotatedFilm.png" />
        </div>
      )}
      {showStickerModal && (
        <div
          className="md:w-limiter w-full h-full bg-white/80 absolute top-0 flex flex-col justify-end items-center z-50"
          onClick={() => {
            setShowStickerModal(false);
          }}
        >
          <div className="rounded-t-lg bg-white h-[90%] w-[95%] overflow-y-auto dark:text-black">
            <svg
              className="w-4 "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              onClick={(e) => {
                setShowStickerModal(false);
                e.stopPropagation();
              }}
            >
              <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
            </svg>
            <div className=" p-2 text-lg font-bold">From the page</div>
            <div className="flex flex-row flex-wrap gap-2">
              {pageStickers?.map((item, i) => {
                return (
                  <div
                    key={`myStickers-${i}`}
                    style={{ width: "200px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      scrapbookPage.addNewPageSticker(
                        item.image,
                        200,
                        item.linkOut
                      );
                      setShowStickerModal(false);
                    }}
                  >
                    <img src={item.image} />
                  </div>
                );
              })}
            </div>
            <div className=" p-2 text-lg font-bold">Your Stickers</div>
            <div className="flex flex-row flex-wrap gap-2">
              {stickers.map((item, i) => {
                return (
                  <div
                    key={i}
                    style={{ width: "200px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      scrapbookPage.addNewSticker(item.image, 200);
                      setShowStickerModal(false);
                    }}
                  >
                    <img src={item.image} />
                  </div>
                );
              })}
            </div>
          </div>
          <ScrapbookCornerDisplay imgUrl="/tempStickerImage.png" />
        </div>
      )}
      {showTextModal && (
        <div
          className="md:w-limiter w-full h-full bg-white/80 absolute top-0 flex flex-col justify-center  items-center z-50"
          onClick={() => {
            setShowTextModal(false);
          }}
        >
          <div>
            <input type="text" id="textStickerInput"></input>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const textInput = document.querySelector("#textStickerInput");
                scrapbookPage.addNewTextSticker(textInput.value);
                textInput.value = "";
                setShowTextModal(false);
              }}
            >
              Done
            </button>
          </div>

          <ScrapbookCornerDisplay imgUrl="/tape1.png" />
        </div>
      )}
      {reel && (
        <div className="fixed w-full md:w-limiter z-10  bottom-0 left-0 h-fit  overflow-x-auto">
          {makeToolbar()}
        </div>
      )}
      <div
        id="trashZone"
        ref={trashRef}
        className={`fixed w-full md:w-limiter bg-blue-300 left-0 bottom-0 z-10 h-20 flex flex-col justify-center items-center ${
          draggingItem ? "visible" : "invisible"
        }`}
      >
        <div className="font-mono font-bold">TRASH</div>
      </div>
    </div>
  );
}
