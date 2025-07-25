import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import interact from "interactjs";

import ScrapbookCornerDisplay from "./ScrapbookCornerDisplay";
import { ScrapbookElem } from "./ScrapbookElement";
import TextEditor from "./scrapbook/TextEditor";

import { getAllLCItems, getHomeLocation } from "../lib/storageHelpers";

const defaultStickerWidth = 300;
const defaultStickerHeight = 168.75;
function ScrapbookPage(getDraggingItem, handleDraggingItem, picture) {
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

    function loadImage(src, width, height) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => {
          reject(new Error(` Failed to load image: ${src}:`));
        };
        img.src = src;
        img.width = `${width}px`;
        img.height = `${height}px`;
      });
    }

    for (let i = 0; i < this.elements.length; i++) {
      const sticker = this.elements[i];
      const element = sticker.elem;
      const box = element.getBoundingClientRect();
      const originalWidth = sticker.originalWidth;
      const originalHeight = sticker.originalHeight;
      ctx.save();
      switch (sticker.type) {
        case "sticker":
          const imgSrc = await loadImage(
            sticker.imgSrc,
            originalWidth,
            originalHeight
          );

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

          break;
        case "text":
          ctx.translate(
            sticker.x + originalWidth / 2,
            sticker.y + originalHeight / 2
          );

          if (sticker.props.backgroundColor) {
            ctx.fillStyle = sticker.props.backgroundColor;
            ctx.fillRect(
              -originalWidth / 2,
              -originalHeight / 2,
              originalWidth,
              originalHeight
            );
          }

          ctx.fillStyle = sticker.props.textColor;

          ctx.textBaseline = "hanging";

          ctx.font = "16px Arial";
          ctx.fillText(
            sticker.textSrc,
            -originalWidth / 2 + 1,
            -originalHeight / 2 + 4
          );
          break;
        default:
          console.log("Default");
          break;
      }

      ctx.restore();
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

  function drawTextToCanvas(canvas, text, textStyle) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Arial";
    const width = ctx.measureText(text).width;
    const height = 20;
    canvas.width = width + 2;
    canvas.height = height + 2;

    if (textStyle.backgroundColor) {
      ctx.fillStyle = textStyle.backgroundColor;
      ctx.fillRect(0, 0, width + 2, height + 2);
    }

    ctx.fillStyle = textStyle.textColor;
    ctx.font = "16px Arial";
    ctx.textBaseline = "hanging";

    ctx.fillText(text, 1, 4);
  }

  this.addNewTextSticker = function (
    text,
    textStyle,
    handleEditingTextSticker
  ) {
    const placeItHere = document.querySelector("#scrapbookPlayground");
    const canvas = document.createElement("canvas");
    // position:relative is needed for z-index to work
    canvas.style.position = "relative";
    canvas.id = `sticker-${this.numElems}`;

    drawTextToCanvas(canvas, text, textStyle);

    const stick = new ScrapbookElem({
      handleDraggingItem: handleDraggingItem,
      getDraggingItem: getDraggingItem,
      type: "text",
      htmlElem: canvas,
      id: `sticker-${this.numElems}`,
      z: this.topZ,
      origWidth: canvas.width,
      origHeight: canvas.height,
      textSrc: text,
      props: textStyle,
      onClick: handleEditingTextSticker,
    });
    this.elements.push(stick);
    this.topZ++;
    this.numElems++;

    placeItHere.appendChild(canvas);
  };

  this.updateTextSticker = function (sticker, text, textStyle) {
    sticker.textSrc = text;
    sticker.props = textStyle;
    const canvas = sticker.elem;
    drawTextToCanvas(canvas, text, textStyle);
  };

  this.addNewPageSticker = function (img, width, height, linkOut, title) {
    const imgDiv = this.addNewSticker(img, width, height);
    if (linkOut) {
      imgDiv.className = imgDiv.className + " refImage";
      imgDiv.setAttribute("linkout", linkOut);
    }
    if (title) {
      imgDiv.setAttribute("title", title);
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
    imgDiv.style.height = `${height}px`;
    imgDiv.style.top = "0px";
    imgDiv.style.left = "0px";

    const stick = new ScrapbookElem({
      handleDraggingItem: handleDraggingItem,
      getDraggingItem: getDraggingItem,
      type: "sticker",
      htmlElem: imgDiv,
      id: `sticker-${this.numElems}`,
      z: this.topZ,
      origWidth: width,
      origHeight: height || 168,
      imgSrc: img,
    });
    this.elements.push(stick);
    this.topZ++;
    this.numElems++;

    placeItHere.appendChild(imgDiv);

    return imgDiv;
  };
  this.bringToFront = function (element) {
    this.topZ++;
    element.z = this.topZ;
    element.elem.style.zIndex = this.topZ;
  };
}

export default function Scrapbook({
  reel,
  slug,
  onFinishedScrapbooking,
  setProcessPhotos,
}) {
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [pageStickers, setPageStickers] = useState([]);
  const [showMyPhotos, setShowMyPhotos] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [editingTextSticker, setEditingTextSticker] = useState(undefined);
  const [scrapbookPage, setScrapbookPage] = useState(
    new ScrapbookPage(getDraggingItem, handleDraggingItem)
  );
  const [defaultStickerMetaInfo, setDefaultStickerMetaInfo] =
    useState(undefined);
  const [draggingItem, setDraggingItem] = useState(undefined);
  const draggingItemRef = useRef(undefined);

  const [textStyle, setTextStyle] = useState({
    backgroundColor: undefined,
    textColor: "#000000",
  });

  const trashRef = useRef();
  function getDraggingItem() {
    return draggingItemRef.current;
  }
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
  ];

  useEffect(() => {
    if (!showTextModal) return;
    const textInput = document.getElementById("textStickerInput");
    textInput.focus();
  }, [showTextModal]);
  useEffect(() => {
    // get all saved LC items
    const lcItems = getAllLCItems();
    setStickers(Object.values(lcItems));

    reel.forEach((imageObj, i) => {
      scrapbookPage.addNewSticker(
        imageObj.img,
        defaultStickerWidth,
        defaultStickerHeight
      );
    });
    const fetchStickerInfo = async () => {
      const file = await fetch("/content/stickerinfo.json");
      const f = await file.json();
      setDefaultStickerMetaInfo(f);
    };
    fetchStickerInfo();
  }, []);

  useEffect(() => {
    if (!trashRef.current) return;

    const dropZone = interact("#trashZone").dropzone({
      accept: ".trashable",
      overlap: "pointer",
      ondropactivate: (event) => {},
      ondropenter: (event) => {},
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

  function handleDraggingItem(element) {
    if (element) {
      draggingItemRef.current = element;
      scrapbookPage.bringToFront(element);
      setDraggingItem(element);
    } else {
      setTimeout(() => {
        draggingItemRef.current = undefined;
      }, 0);
      setDraggingItem(undefined);
    }
  }

  function handleEditingTextSticker(sticker) {
    console.log("hello vivian in handle editing text sticker");
    setShowTextModal(true);
    setEditingTextSticker(sticker);
  }

  function getDefaultStickerPack() {
    const defaultStickers = [];
    // Get sticker packs depending on location :)
    const home = getHomeLocation();
    let fileNames = [];
    switch (home) {
      case "Southeast Wyoming":
        fileNames = [
          "/stickerpacks/sewy/bill.png",
          "/stickerpacks/sewy/grahamMarket.png",
        ];
        break;
      case "Seattle":
        fileNames = ["/stickerpacks/seattle/pano.jpg"];
        break;
      case "Chicago":
        break;
    }
    fileNames.forEach((fn, i) => {
      defaultStickers.push({ ...defaultStickerMetaInfo[fn], img: fn });
    });
    return defaultStickers;
  }

  function makeToolbar() {
    return (
      <div className="w-fit flex flex-row gap-2 pl-2" id="scrapbook-tool-wheel">
        {itemsOnWheel.map((item, i) => {
          return (
            <button
              key={i}
              className="h-36 w-36 flex flex-col pt-2 "
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
          className="md:w-limiter w-full h-full bg-white/80 absolute top-0 flex flex-col justify-end items-center z-50 shadow-t-lg"
          onClick={() => {
            setShowMyPhotos(false);
          }}
        >
          <div className="rounded-t-lg bg-white h-[90%] w-[95%] overflow-y-auto dark:text-black">
            <div className="w-full  p-2 flex flex-row justify-end">
              <svg
                className="w-4 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                onClick={(e) => {
                  setShowMyPhotos(false);
                  e.stopPropagation();
                }}
              >
                <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
              </svg>
            </div>
            <div className="p-4 text-2xl font-bold">Your Photos</div>
            <div className="flex flex-row flex-wrap gap-2 items-center justify-center p-2">
              {reel?.map((photoObj, i) => {
                return (
                  <div
                    key={i}
                    style={{ width: "300px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      scrapbookPage.addNewPageSticker(
                        photoObj.img,
                        defaultStickerWidth,
                        defaultStickerHeight
                      );
                      setShowMyPhotos(false);
                    }}
                  >
                    <img src={photoObj.img}></img>
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
            <div className="w-full  p-2 flex flex-row justify-end">
              <svg
                className="w-4 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                onClick={(e) => {
                  setShowStickerModal(false);
                  e.stopPropagation();
                }}
              >
                <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
              </svg>
            </div>
            {pageStickers && pageStickers.length > 0 && (
              <div>
                <div className=" p-4 text-2xl font-bold">From the page</div>
                <div className="flex flex-row flex-wrap gap-2 px-4 pb-4">
                  {pageStickers?.map((item, i) => {
                    return (
                      <div
                        key={`myStickers-${i}`}
                        style={{ width: "200px" }}
                        onClick={(e) => {
                          const htmlEl = e.target;
                          e.stopPropagation();
                          e.preventDefault();
                          scrapbookPage.addNewPageSticker(
                            item.image,
                            200,
                            htmlEl.getBoundingClientRect().height,
                            item.linkOut,
                            item.title
                          );
                          setShowStickerModal(false);
                        }}
                      >
                        <img src={item.image} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="px-4 pb-4 text-2xl font-bold">Stickers</div>
            <div className="px-4 pb-4 flex flex-row flex-wrap gap-2 ">
              {getDefaultStickerPack().map((stickerInfo, i) => {
                return (
                  <div
                    key={`myStickers-${i}`}
                    style={{ width: "200px" }}
                    onClick={(e) => {
                      const htmlEl = e.target;
                      console.log(htmlEl.getBoundingClientRect());
                      e.stopPropagation();
                      e.preventDefault();
                      scrapbookPage.addNewPageSticker(
                        stickerInfo.img,
                        200,
                        htmlEl.getBoundingClientRect().height,
                        stickerInfo.linkOut,
                        stickerInfo.title
                      );
                      setShowStickerModal(false);
                    }}
                  >
                    <img src={stickerInfo.img} />
                  </div>
                );
              })}
            </div>
            <div className="p-4 text-2xl font-bold">Your Stickers</div>
            <div className="flex flex-row flex-wrap gap-2 px-4 pb-4">
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
        <TextEditor
          scrapbookPage={scrapbookPage}
          setShowTextModal={setShowTextModal}
          setEditingTextSticker={setEditingTextSticker}
          editingTextSticker={editingTextSticker}
          setTextStyle={setTextStyle}
          textStyle={textStyle}
          handleEditingTextSticker={handleEditingTextSticker}
        />
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
