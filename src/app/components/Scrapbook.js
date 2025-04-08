import { useState, useEffect } from "react";
import { getAllLCItems } from "../lib/storageHelpers";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

function ScrapbookElem(type, htmlElem, id, z) {
  htmlElem.className = "cursor-pointer";
  this.type = type;
  this.z = z;
  this.id = id;
  this.elem = htmlElem;

  console.log(this.id);
  Draggable.create(htmlElem, { bounds: "#scrapbookPlayground" });
  // htmlElem.addEventListener("drag", (e) => {
  //   e.stopPropagation();
  //   console.log(e);
  //   if (!this.dragProps) {
  //     this.dragProps = { mouseOffsetX: 0, mouseOffsety: 0 }; // Offset of mouse from top left on initial drag
  //   }
  // });
}

function ScrapbookPage() {
  this.topZ = 10;
  this.elements = []; // array for now, maybe diff structure in future
  this.numElems = 0;

  this.addNewSticker = function (img) {
    const placeItHere = document.querySelector("#scrapbookPlayground");
    const imgDiv = document.createElement("img");
    imgDiv.id = `sticker-${this.numElems}`;
    imgDiv.src = img;
    imgDiv.style.zIndex = this.topZ;
    imgDiv.style.width = "100px";
    imgDiv.style.top = "0";

    const stick = new ScrapbookElem(
      "sticker",
      imgDiv,
      `sticker-${this.numElems}`,
      this.topZ
    );
    this.elements.push(stick);
    this.topZ++;
    this.numElems++;

    placeItHere.appendChild(imgDiv);
    console.log(imgDiv);

    return imgDiv;
  };

  this.flatten = function () {
    // This takes all the layers and flattens down to an image
  };
}
export default function Scrapbook({ picture }) {
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [currentTool, setCurrentTool] = useState();
  const [stickers, setStickers] = useState([]);
  const [scrapbookPage, setScrapbookPage] = useState(new ScrapbookPage());

  useEffect(() => {
    const lcItems = getAllLCItems();
    setStickers(Object.values(lcItems));
    gsap.registerPlugin(Draggable);
  }, []);

  return (
    <div>
      {picture && (
        <div id="picture" className="output flex flex-col relative w-full ">
          <img className="" src={picture} />
        </div>
      )}
      <canvas className="absolute top-0 left-0" id="scrapbookCanvas" />

      <div
        id="scrapbookPlayground"
        className="w-full h-full top-0 left-0 absolute"
      ></div>
      {picture && (
        <div className="text-white absolute bottom-0 p-2 h-fit">
          <div>Tools</div>
          <div className="overflow-x-auto">
            <button
              className="bg-pink-300 p-2 rounded-lg cursor-pointer"
              onClick={() => {
                setShowStickerModal(true);
              }}
            >
              Sticker
            </button>
          </div>
        </div>
      )}
      {showStickerModal && (
        <div
          className="md:w-limiter w-full h-full bg-white/80 absolute top-0 flex flex-col justify-end items-center"
          onClick={() => {
            setShowStickerModal(false);
          }}
        >
          <div className="rounded-t-lg bg-white h-[90%] w-[95%] ">
            <svg
              className="w-4 "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              onClick={(e) => {
                console.log("VVn stop it");
                e.stopPropagation();
              }}
            >
              <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
            </svg>
            <div className="flex flex-row flex-wrap gap-2">
              {stickers.map((item, i) => {
                return (
                  <div
                    className="w-1/3"
                    onClick={(e) => {
                      scrapbookPage.addNewSticker(item.image);
                      setShowStickerModal(false);
                      e.stopPropagation();
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
    </div>
  );
}
