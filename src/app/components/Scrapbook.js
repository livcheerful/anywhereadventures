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

  Draggable.create(htmlElem);
  htmlElem.style.left = window.innerWidth / 2;
  htmlElem.style.right = window.innerHeight / 2;
}

function ScrapbookPage(picture) {
  this.topZ = 10;
  this.elements = []; // array for now, maybe diff structure in future
  this.numElems = 0;

  this.picture = picture;

  const placeItHere = document.querySelector("#scrapbookPlayground");
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

    canvas.width = Math.min(480, window.innerWidth);
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
      const currElem = this.elements[i].elem;
      const box = currElem.getBoundingClientRect();
      console.log(box);
      ctx.drawImage(currElem, box.x, box.y, box.width, box.height);
    }

    const dataURL = document
      .getElementById("scrapbookCanvas")
      .toDataURL("image/jpeg", 0.7);
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
      this.topZ
    );
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
  const [scrapbookPage, setScrapbookPage] = useState(new ScrapbookPage());

  const itemsOnWheel = [
    {
      title: "Back to Camera",
      onClickHandler: () => {
        setProcessPhotos(false);
      },
    },
    {
      title: "Save",
      onClickHandler: () => {
        const img = scrapbookPage.flatten();

        var a = document.createElement("a");
        // Set the link to the image so that when clicked, the image begins downloading
        a.href = img;
        // Specify the image filename
        a.download = `loc-${slug}.jpg`;
        // Click on the link to set off download
        a.click();
      },
    },
    {
      title: "Sticker",
      onClickHandler: () => {
        setShowStickerModal(true);
      },
    },
    {
      title: "Finish",
      onClickHandler: () => {
        onFinishedScrapbooking(scrapbookPage.flatten());
      },
    },
  ];
  useEffect(() => {
    // get all saved LC items
    const lcItems = getAllLCItems();
    setStickers(Object.values(lcItems));
    gsap.registerPlugin(Draggable);

    reel.forEach((image, i) => {
      scrapbookPage.addNewSticker(image, 300);
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
    console.log("Hello vivian did we get the page?");
    fetchPost();
  }, [slug]);
  useEffect(() => {
    new Draggable("#scrapbook-tool-wheel", {
      type: "rotation",
    });
  });

  function makeToolwheel() {
    const width = Math.min(480, window.innerWidth) - 30;
    return (
      <div
        className="w-full md:w-limiter flex flex-col items-center fixed z-20"
        id="scrapbook-tool-wheel"
        style={{ bottom: `-${(width / 4) * 3}px` }}
      >
        <svg
          viewBox={`0 0 ${width} ${width}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: `${width}px` }}
        >
          <circle
            className=" fill-slate-200"
            cx={width / 2}
            cy={width / 2}
            z={10}
            r={width / 2}
          />

          {itemsOnWheel.map((item, i) => {
            const degrees = 30 * i;
            const radians = degrees * (Math.PI / 180);
            return (
              <>
                <circle
                  z={2}
                  cx={(Math.cos(radians) * width) / 2 + width / 2}
                  cy={(Math.sin(radians) * width) / 2 + width / 2}
                  r={20}
                  onClick={() => {
                    item.onClickHandler();
                  }}
                />
                <circle
                  className=" fill-blue-800"
                  cx={(Math.cos(radians) * width) / 2 + width / 2}
                  cy={(Math.sin(radians) * width) / 2 + width / 2}
                  r={5}
                />
                <text
                  x={(Math.cos(radians) * width * 0.8) / 2 + width / 2}
                  y={(Math.sin(radians) * width * 0.8) / 2 + width / 2}
                  className="  fill-blue-600  "
                >
                  {item.title}
                </text>
              </>
            );
          })}
        </svg>
      </div>
    );
  }

  console.log(scrapbookPage);
  return (
    <div className="overflow-y-hidden z-30">
      {reel && (
        <div className="flex flex-col  w-full h-full absolute top-0 left-0 bg-black"></div>
      )}
      <canvas className="absolute top-0 left-0" id="scrapbookCanvas" />

      <div
        id="scrapbookPlayground"
        className="w-full h-full top-0 left-0 absolute overflow-clip z-10"
      ></div>
      {reel && (
        <div className="text-white absolute bottom-0  h-fit">
          {makeToolwheel()}
        </div>
      )}
      {showStickerModal && (
        <div
          className="md:w-limiter w-full h-full bg-white/80 absolute top-0 flex flex-col justify-end items-center z-50"
          onClick={() => {
            setShowStickerModal(false);
          }}
        >
          <div className="rounded-t-lg bg-white h-[90%] w-[95%] overflow-y-scroll">
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
                      scrapbookPage.addNewPageSticker(
                        item.image,
                        200,
                        item.linkOut
                      );
                      setShowStickerModal(false);
                      e.stopPropagation();
                    }}
                  >
                    <img src={item.image} />
                  </div>
                );
              })}
            </div>
            <div className=" p-2 text-lg font-bold">Small</div>
            <div className="flex flex-row flex-wrap gap-2">
              {stickers.map((item, i) => {
                return (
                  <div
                    key={i}
                    style={{ width: "200px" }}
                    onClick={(e) => {
                      scrapbookPage.addNewSticker(item.image, 200);
                      setShowStickerModal(false);
                      e.stopPropagation();
                    }}
                  >
                    <img src={item.image} />
                  </div>
                );
              })}
            </div>
            <div className="p-2 text-lg font-bold">Large</div>
            <div className="flex flex-row flex-wrap gap-2">
              {stickers.map((item, i) => {
                return (
                  <div
                    key={i}
                    style={{ width: "400px" }}
                    onClick={(e) => {
                      scrapbookPage.addNewSticker(item.image, 400);
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
