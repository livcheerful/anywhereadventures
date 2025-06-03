import { useState, useEffect, Suspense } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrapbookElem } from "./ScrapbookElement";

import { getAllLCItems } from "../lib/storageHelpers";

const defaultStickerSize = 300;
function ScrapbookPage(picture) {
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

  this.flatten = function () {
    const canvas = document.querySelector("#scrapbookCanvas");
    var ctx = canvas.getContext("2d");

    const placeItHere = document.querySelector("#scrapbookPlayground");
    canvas.width = placeItHere.getBoundingClientRect().width;
    canvas.height = window.innerHeight;
    ctx.beginPath();
    ctx.fillStyle = "black";
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

    for (let i = 0; i < this.elements.length; i++) {
      const sticker = this.elements[i];
      const currElem = sticker.elem;
      var imgSrc = new Image();
      imgSrc.src = sticker.imgSrc;
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
    }

    const dataURL = document
      .getElementById("scrapbookCanvas")
      .toDataURL("image/jpeg", 0.9);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return dataURL;
  };

  this.addNewPageSticker = function (img, size, linkOut) {
    const imgDiv = this.addNewSticker(img, size);
    if (linkOut) {
      imgDiv.className = imgDiv.className + " refImage";
      imgDiv.setAttribute("linkout", linkOut);
    }
  };
  this.addNewSticker = function (img, size) {
    const placeItHere = document.querySelector("#scrapbookPlayground");
    const imgDiv = document.createElement("img");
    imgDiv.id = `sticker-${this.numElems}`;
    imgDiv.src = img;
    imgDiv.style.position = "absolute";
    imgDiv.style.zIndex = this.topZ;
    imgDiv.style.width = `${size}px`;
    imgDiv.style.top = "0px";
    imgDiv.style.left = "0px";

    const stick = new ScrapbookElem(
      "sticker",
      imgDiv,
      `sticker-${this.numElems}`,
      this.topZ,
      img,
      300,
      168.75
    );
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
  const [scrapbookPage, setScrapbookPage] = useState(new ScrapbookPage());

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
      onClickHandler: () => {},
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
    // get all saved LC items
    const lcItems = getAllLCItems();
    setStickers(Object.values(lcItems));

    reel.forEach((image, i) => {
      scrapbookPage.addNewSticker(image, defaultStickerSize);
    });
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

  function makeToolbar() {
    return (
      <div
        className="w-fit flex flex-row gap-2 -pb-10"
        id="scrapbook-tool-wheel"
      >
        {itemsOnWheel.map((item, i) => {
          return (
            <button
              key={i}
              className="h-48 w-36 flex flex-col pt-2 "
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
              onClick={() => {
                item.onClickHandler();
              }}
            >
              <div className="w-full text-center font-mono font-bold text-gray-700 h-fit ">
                {item.title}
              </div>
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
              onFinishedScrapbooking(scrapbookPage.flatten());
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
          {" "}
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
                      scrapbookPage.addNewPageSticker(photo, 200);
                      setShowMyPhotos(false);
                    }}
                  >
                    <img src={photo}></img>
                  </div>
                );
              })}
            </div>
          </div>
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
        </div>
      )}
      {reel && (
        <div className="w-full md:w-limiter  z-10 fixed bottom-0 left-0 h-fit overflow-clip overflow-x-auto">
          {makeToolbar()}
        </div>
      )}
    </div>
  );
}
