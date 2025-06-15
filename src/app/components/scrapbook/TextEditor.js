import ScrapbookCornerDisplay from "../ScrapbookCornerDisplay";
export default function TextEditor({
  scrapbookPage,
  setShowTextModal,
  editingTextSticker,
  setEditingTextSticker,
  setTextStyle,
  textStyle,
  handleEditingTextSticker,
}) {
  const highlightColors = [
    { hex: "#1f96ff" },
    { hex: "#fffc4a" },
    { hex: "#2bff36" },
  ];
  const textColors = [
    { hex: "#000000" },
    { hex: "#560fd1" },
    { hex: "#ffffff" },
    { hex: "#d62409" },
  ];
  return (
    <div
      className="md:w-limiter w-full h-full bg-white/80 absolute top-0 flex flex-col gap-1 justify-center  items-center z-50"
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
      <div className="w-full">
        <input
          type="text"
          id="textStickerInput"
          className="w-full text-center p-2"
          style={{
            color: textStyle.textColor,
            backgroundColor: textStyle.backgroundColor,
            font: "16pt Arial",
          }}
          defaultValue={editingTextSticker?.textSrc}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></input>
      </div>
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

      <ScrapbookCornerDisplay imgUrl="/tape1.png" />
    </div>
  );
}
