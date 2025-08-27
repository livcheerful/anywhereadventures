"use client";
import { useEffect, useState, useRef } from "react";
export default function TextEditor({
  scrapbookPage,
  setShowTextModal,
  editingTextSticker,
  setEditingTextSticker,
  setTextStyle,
  textStyle,
  handleEditingTextSticker,
  drawTextToCanvas,
}) {
  const highlightColors = [
    { hex: "#1f96ff" },
    { hex: "#fffc4a" },
    { hex: "#2bff36" },
    { hex: "#ff5c9d" },
  ];
  const textColors = [
    { hex: "#000000" },
    { hex: "#C82800" },
    { hex: "#8F07F0" },
    { hex: "#FFFFFF" },
    { hex: "#5AE3A8" },
    { hex: "#E8F64B" },
    { hex: "#F64BF0" },
  ];

  const fontSizes = [6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];

  const [previewText, setPreviewText] = useState(
    editingTextSticker?.textSrc || ""
  );
  const canvasRef = useRef();

  const fontStyles = [
    { display: "Simple", fontFamily: "Arial" },
    { display: "Serif", fontFamily: "Georgia" },
    { display: "Handwritten", fontFamily: "VivianFont" },
  ];

  useEffect(() => {
    const canvas = document.getElementById("textPreview");
    drawTextToCanvas(canvas, previewText, textStyle);
  }, [previewText, textStyle]);

  useEffect(() => {
    const textInput = document.getElementById("textStickerInput");
    const timer = setTimeout(() => {
      textInput?.focus({ preventScroll: true });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  function onDone() {
    const textInput = document.querySelector("#textStickerInput");
    if (editingTextSticker) {
      scrapbookPage.updateTextSticker(
        editingTextSticker,
        textInput.value,
        textStyle
      );
    } else if (textInput.value != "") {
      scrapbookPage.addNewTextSticker(
        textInput.value,
        textStyle,
        handleEditingTextSticker
      );
      textInput.value = "";
    }
    setShowTextModal(false);
    setEditingTextSticker(undefined);
  }

  const incomingFontSize = fontSizes.findIndex(
    (value) => value == textStyle.fontSize
  );
  console.log(textStyle);
  console.log(incomingFontSize);
  return (
    <div
      className="flex flex-col gap-1  items-center "
      onClick={() => {
        const textInput = document.querySelector("#textStickerInput");
        if (editingTextSticker) {
          scrapbookPage.updateTextSticker(
            editingTextSticker,
            textInput.value,
            textStyle
          );
        } else if (textInput.value != "") {
          scrapbookPage.addNewTextSticker(
            textInput.value,
            textStyle,
            handleEditingTextSticker
          );
          textInput.value = "";
        }
        setShowTextModal(false);
        setEditingTextSticker(undefined);
      }}
    >
      <canvas className="" id="textPreview" ref={canvasRef}></canvas>
      <div className="w-full flex flex-row gap-2 px-2 items-center">
        <input
          type="text"
          id="textStickerInput"
          autoComplete="off"
          autoCapitalize="off"
          onChange={(e) => {
            const textInput = document.querySelector("#textStickerInput");
            setPreviewText(textInput.value);
          }}
          className="w-full text-center p-2 border-2 border-gray-800 "
          style={{
            color: "black",
            backgroundColor: "white",
            font: `Arial`,
          }}
          defaultValue={editingTextSticker?.textSrc}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation;
              onDone();
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></input>
        <button
          className="font-bold p-2"
          onClick={(e) => {
            onDone();
          }}
        >
          Done
        </button>
      </div>

      <div className="font-bold py-2">Text Size</div>
      <input
        type="range"
        min="0"
        max={fontSizes.length - 1}
        step="1"
        className="chunky-slider px-2 pb-4"
        defaultValue={incomingFontSize}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={(e) => {
          const idx = parseInt(e.target.value, 10);

          let newStyle = { ...textStyle };
          newStyle.fontSize = fontSizes[idx];
          setTextStyle(newStyle);
        }}
        list="steplist"
      />

      <datalist id="steplist">
        {fontSizes.map((size, i) => (
          <option key={i} value={i} />
        ))}
      </datalist>
      <hr className="w-full"></hr>
      <div className="font-bold">Font</div>
      <div className="flex flex-row gap-2">
        {fontStyles.map((fs, i) => {
          return (
            <button
              key={i}
              className="p-2 bg-slate-100 rounded-lg"
              style={{ font: `16pt ${fs.fontFamily}` }}
              onClick={(e) => {
                e.stopPropagation();
                let newStyle = { ...textStyle };
                newStyle.fontFamily = fs.fontFamily;
                setTextStyle(newStyle);
              }}
            >
              {fs.display}
            </button>
          );
        })}
      </div>
      <hr className="w-full"></hr>

      <div className="font-bold md:pt-3">Text</div>
      <div className="flex flex-row gap-2">
        {textColors.map((c, i) => {
          return (
            <div
              key={i}
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: c.hex, border: "1px black solid" }}
              onClick={(e) => {
                e.stopPropagation();
                let newStyle = { ...textStyle };
                newStyle.textColor = c.hex;
                setTextStyle(newStyle);
              }}
            ></div>
          );
        })}
      </div>

      <hr className="w-full"></hr>
      <div className="font-bold md:pt-3">Highlight</div>
      <div className="flex flex-row gap-2">
        <div
          key={"transparent"}
          className="w-8 h-8 rounded-full border-2 border-black"
          onClick={(e) => {
            e.stopPropagation();
            let newStyle = { ...textStyle };
            newStyle.backgroundColor = undefined;
            setTextStyle(newStyle);
          }}
        ></div>
        {highlightColors.map((c, i) => {
          return (
            <div
              key={i}
              className="w-8 h-8 rounded-full "
              style={{ backgroundColor: c.hex, border: "1px black solid" }}
              onClick={(e) => {
                e.stopPropagation();
                let newStyle = { ...textStyle };
                newStyle.backgroundColor = c.hex;
                setTextStyle(newStyle);
              }}
            ></div>
          );
        })}
      </div>

      <hr className="w-full"></hr>
    </div>
  );
}
