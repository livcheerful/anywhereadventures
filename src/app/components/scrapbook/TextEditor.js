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
  paddingX,
  paddingY,
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

  const [previewText, setPreviewText] = useState(
    editingTextSticker?.textSrc || ""
  );
  const canvasRef = useRef();

  const fontStyles = [
    { display: "Simple", font: "24px Arial" },
    { display: "Serif", font: "24px Georgia" },
    { display: "Handwritten", font: "24px VivianFont" },
  ];
  function drawTextToCanvas(canvas, text, ts) {
    var ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = textStyle.font;
    const width = ctx.measureText(text).width;
    const height = 28;

    canvas.width = (width + paddingX) * dpr;
    canvas.height = (height + paddingY) * dpr;

    ctx.scale(dpr, dpr);
    canvas.style.width = width + "px";

    if (textStyle.backgroundColor) {
      ctx.fillStyle = textStyle.backgroundColor;
      ctx.fillRect(0, 0, width + paddingX, height + paddingY);
    }

    ctx.fillStyle = textStyle.textColor;
    ctx.font = textStyle.font;
    ctx.textBaseline = "hanging";

    ctx.fillText(text, 1 * dpr, 5 * dpr);
  }

  useEffect(() => {
    const canvas = document.getElementById("textPreview");
    drawTextToCanvas(canvas, previewText, textStyle);
  }, [previewText, textStyle]);
  useEffect(() => {
    const textInput = document.getElementById("textStickerInput");
    textInput.focus();
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
  return (
    <div
      className=" flex flex-col gap-1  items-center "
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
      <canvas className="pb-3" id="textPreview" ref={canvasRef}></canvas>
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
            color: textStyle.textColor,
            backgroundColor: textStyle.backgroundColor,
            font: textStyle.font,
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
      <div className="font-bold">Font</div>
      <div className="flex flex-row gap-2">
        {fontStyles.map((fs, i) => {
          return (
            <button
              key={i}
              className="p-2 bg-slate-100 rounded-lg"
              style={{ font: fs.font }}
              onClick={(e) => {
                e.stopPropagation();
                let newStyle = { ...textStyle };
                newStyle.font = fs.font;
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
