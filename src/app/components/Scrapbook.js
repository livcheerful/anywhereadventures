import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import interact from "interactjs";

import ScrapbookCornerDisplay from "./ScrapbookCornerDisplay";
import { ScrapbookElem } from "./ScrapbookElement";
import ScrapbookToolMenu from "./ScrapbookToolMenu";
import TextEditor from "./scrapbook/TextEditor";

import { getAllLCItems, getHomeLocation } from "../lib/storageHelpers";

const backgroundOptions = [
  {
    type: "image",
    src: "/defaultpaper.png",
    snippet: "/defaultpapersnippet.png",
  },
  { type: "color", hex: "#ffffff" },
  { type: "color", hex: "#F5EB7E" },
  { type: "color", hex: "#E8D7F1" },
  { type: "color", hex: "#DBFEB8" },
  {
    type: "image",
    src: "/musicpaper.png",
    snippet: "/musicpapersnippet.png",
  },
  {
    type: "image",
    src: "/loc/sba-journal-blank.jpg",
    snippet: "/loc/sba-journal-blank.jpg",
  },
  {
    type: "image",
    src: "/magazineBack.png",
    snippet: "/magazineBacksnippet.png",
  },
];

const defaultStickerWidth = 300;
const defaultStickerHeight = 168.75;
function ScrapbookPage(getDraggingItem, handleDraggingItem) {
  this.topZ = 10;
  this.elements = []; // array for now, maybe diff structure in future
  this.numElems = 0;

  this.startFlatten = async function (onFlattenEnd) {
    const [dataUrl, compressed] = await this.flatten();
    onFlattenEnd(dataUrl, compressed);
  };

  this.flatten = async function () {
    const canvas = document.querySelector("#scrapbookCanvas");
    var ctx = canvas.getContext("2d");

    const placeItHere = document.querySelector("#scrapbookPlayground");
    canvas.width = placeItHere.getBoundingClientRect().width;
    canvas.height = placeItHere.getBoundingClientRect().height;
    ctx.beginPath();
    ctx.fillStyle = placeItHere.style.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
    // Handle background image
    const bgImgStyle = placeItHere.style.backgroundImage;
    if (bgImgStyle && bgImgStyle !== "none") {
      // Extract URL from style string like: url(".../image.png")
      const urlMatch = bgImgStyle.match(/url\("?([^")]+)"?\)/);
      if (urlMatch) {
        const bgImgUrl = urlMatch[1];
        console.log(
          `trying to load ${bgImgUrl}. match: ${urlMatch}, from: ${bgImgStyle}`
        );
        const bgImage = await new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous"; // in case it's needed
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = bgImgUrl;
        });

        // Draw background image to cover canvas
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      }
    }

    const leftOff = placeItHere.getBoundingClientRect().left;
    const topOff = placeItHere.getBoundingClientRect().top;
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

          ctx.translate(
            box.left + box.width / 2 - leftOff,
            box.top + box.height / 2 - topOff
          );
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

          ctx.font = sticker.props.font;
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
      .toDataURL("image/jpeg", 1);

    const dataURLCompressed = document
      .getElementById("scrapbookCanvas")
      .toDataURL("image/jpeg", 0.8);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return [dataURL, dataURLCompressed];
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
    ctx.font = textStyle.font;
    const width = ctx.measureText(text).width;
    const height = 28;
    canvas.width = width + 2;
    canvas.height = height + 2;

    if (textStyle.backgroundColor) {
      ctx.fillStyle = textStyle.backgroundColor;
      ctx.fillRect(0, 0, width + 2, height + 2);
    }

    ctx.fillStyle = textStyle.textColor;
    ctx.font = textStyle.font;
    ctx.textBaseline = "hanging";

    ctx.fillText(text, 1, 5);
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
    imgDiv.style.top = `${Math.random() * 40}px`;
    imgDiv.style.left = `${Math.random() * 40}px`;

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
    const cropped = this.elements.filter((e) => {
      return e != element;
    });
    cropped.push(element);
    this.elements = cropped;
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
  const [scrapbookBackgroundIdx, setScrapbookBackgroundIdx] = useState(0);

  const [textStyle, setTextStyle] = useState({
    backgroundColor: undefined,
    textColor: "#000000",
    font: "24px Arial",
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
      display: (
        <button
          className="h-36 w-44 overflow-clip relative "
          onClick={() => {
            setShowStickerModal(true);
          }}
        >
          <img
            className="absolute w-24 top-1 -rotate-2 left-0 drop-shadow-lg"
            src="/illustrations/sticker1.png"
          />
          <img
            className="absolute w-28 rotate-3 -top-2 right-0 drop-shadow-lg"
            src="/illustrations/sticker2.png"
          />
          <img
            className="absolute w-28 rotate-3 bottom-10 right-3 drop-shadow-lg"
            src="/illustrations/sticker3.png"
          />
        </button>
      ),
      onClickHandler: () => {
        setShowStickerModal(true);
      },
    },
    {
      title: "Text",
      image: "/text.png",
      onClickHandler: () => {
        setShowTextModal(true);
      },
    },
  ];

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
      const home = getHomeLocation();
      const fileNames = Object.keys(f);
      const stickers = fileNames.map((fn, i) => {
        return { image: fn, ...f[fn] };
      });
      const homeStickers = stickers.filter((o) => o.location == home);
      setDefaultStickerMetaInfo(homeStickers);
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
    setShowTextModal(true);
    setEditingTextSticker(sticker);
  }

  function makeToolbar() {
    return (
      <div
        className="w-full overflow-x-auto flex flex-row  gap-2 pl-2"
        id="scrapbook-tool-wheel"
      >
        {itemsOnWheel.map((item, i) => {
          return item.display ? (
            item.display
          ) : (
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

  const bg = backgroundOptions[scrapbookBackgroundIdx];
  const backgroundColor = bg.hex;
  const backgroundImage = bg.src && `url(${bg.src})`;

  return (
    <div className="overflow-y-hidden z-30">
      {reel && (
        <div
          className="flex flex-col  w-full h-full absolute top-0 left-0 bg-yellow-100"
          style={{
            backgroundSize: "cover",
          }}
        ></div>
      )}
      <canvas
        className="absolute top-0 left-0 w-4/5 h-fit"
        style={{ aspectRatio: 3 / 4 }}
        id="scrapbookCanvas"
      />
      <div className="absolute w-full h-full top-0 left-0 flex flex-col items-center gap-6 md:pt-10 ">
        <div
          id="scrapbookPlayground"
          style={{
            aspectRatio: 3 / 4,
            backgroundColor,
            backgroundImage,
            backgroundSize: "cover",
          }}
          className=" w-11/12 h-fit overflow-clip z-10 touch-none select-none  drop-shadow-2xl"
        ></div>
        <div className="text-lg font-bold px-5 p-2 rounded-lg bg-white uppercase drop-shadow-2xl text-gray-800">
          Create your travel log entry
        </div>
      </div>
      {showMyPhotos && (
        <ScrapbookToolMenu
          title={"Your photos"}
          onClose={(e) => {
            setShowMyPhotos(false);
            e.stopPropagation();
          }}
        >
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
        </ScrapbookToolMenu>
      )}
      {showStickerModal && (
        <ScrapbookToolMenu
          onClose={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowStickerModal(false);
          }}
          title={"Add a sticker to your collage"}
        >
          {pageStickers && pageStickers.length > 0 && (
            <div>
              <div className="p-4 pt-0 text-lg font-bold">From the story</div>
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
                          htmlEl.getBoundingClientRect().width,
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
          <hr></hr>
          <div className="p-4 text-lg font-bold">Home stickers</div>
          <div className="px-4 pb-4 flex flex-row flex-wrap gap-2 ">
            {defaultStickerMetaInfo.map((stickerInfo, i) => {
              return (
                <div
                  key={`myStickers-${i}`}
                  style={{ width: "200px" }}
                  onClick={(e) => {
                    const htmlEl = e.target;
                    e.stopPropagation();
                    e.preventDefault();
                    scrapbookPage.addNewPageSticker(
                      stickerInfo.image,
                      htmlEl.getBoundingClientRect().width,
                      htmlEl.getBoundingClientRect().height,
                      stickerInfo.linkOut,
                      stickerInfo.title
                    );
                    setShowStickerModal(false);
                  }}
                >
                  <img src={stickerInfo.image} />
                </div>
              );
            })}
          </div>
          <hr></hr>
          <div className="p-4 text-lg font-bold">
            Stickers from your saved items
          </div>
          {!stickers ||
            (stickers.length == 0 && (
              <div className="px-4 text-black opacity-40 flex flex-col items-center gap-4 pt-3">
                <div className="text-center text-lg italic font-bold">
                  You don't have any saved items yet.
                </div>
                <img
                  src="/illustrations/saveItems.png"
                  className="w-60 rounded-2xl"
                />

                <div className="text-sm italic text-center">
                  Collect archive items as you read stories. Items you save will
                  appear here for you to use in your travel log entries.
                </div>
              </div>
            ))}
          <div className="flex flex-row flex-wrap gap-2 px-4 pb-4">
            {stickers.map((item, i) => {
              console.log(item);
              return (
                <div
                  key={i}
                  style={{ width: "200px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const htmlEl = e.target;
                    scrapbookPage.addNewSticker(
                      item.image,
                      htmlEl.getBoundingClientRect().width,
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
        </ScrapbookToolMenu>
      )}
      {showTextModal && (
        <ScrapbookToolMenu
          title="Add text"
          onClose={(e) => {
            setShowTextModal(false);
            setEditingTextSticker(undefined);
          }}
        >
          <TextEditor
            scrapbookPage={scrapbookPage}
            setShowTextModal={setShowTextModal}
            setEditingTextSticker={setEditingTextSticker}
            editingTextSticker={editingTextSticker}
            setTextStyle={setTextStyle}
            textStyle={textStyle}
            handleEditingTextSticker={handleEditingTextSticker}
          />
        </ScrapbookToolMenu>
      )}
      {reel && (
        <div className="fixed w-full md:w-limiter z-10 bg-white bottom-0 left-0 h-fit ">
          <div className="flex flex-row p-2 pr-0 gap-4 stretch items-center w-full overflow-clip">
            <div className="text-md font-bold shrink-0 text-gray-800">
              Background:
            </div>
            <div className="flex flex-row gap-3 grow overflow-x-auto">
              {backgroundOptions.map((op, i) => {
                return (
                  <button
                    key={i}
                    className="w-10 h-10 shrink-0 rounded-full border-2"
                    style={{
                      backgroundColor: op.hex || "white",
                      backgroundImage: op.snippet && `url(${op.snippet})`,
                      backgroundSize: "cover",
                      borderColor:
                        i == scrapbookBackgroundIdx ? "red" : "#cccccc",
                    }}
                    onClick={() => {
                      setScrapbookBackgroundIdx(i);
                    }}
                  ></button>
                );
              })}
            </div>
          </div>
          {makeToolbar()}
        </div>
      )}
      <div
        id="trashZone"
        ref={trashRef}
        className={`fixed w-full md:w-limiter bg-blue-300 text-black left-0 bottom-0 z-10 h-20 flex flex-col justify-center items-center ${
          draggingItem ? "visible" : "invisible"
        }`}
      >
        <div className="font-mono font-bold">TRASH</div>
      </div>
    </div>
  );
}
