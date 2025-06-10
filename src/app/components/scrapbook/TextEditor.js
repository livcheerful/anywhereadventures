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
  const highlightColors = [{ hex: "#9e534d" }, { hex: "#b66eff" }];
  const textColors = [{ hex: "#000000" }, { hex: "#560fd1" }];
  return (
    <div
      className="md:w-limiter w-full h-full bg-white/80 absolute top-0 flex flex-col justify-center  items-center z-50"
      onClick={() => {
        const textInput = document.querySelector("#textStickerInput");
        if (editingTextSticker) {
          scrapbookPage.updateTextSticker(
            editingTextSticker,
            textInput.value,
            textStyle
          );
        } else {
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
      <div>
        <input
          type="text"
          id="textStickerInput"
          defaultValue={editingTextSticker?.textSrc}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></input>
      </div>
      <div className="flex flex-row">
        <div
          key={"transparent"}
          className="w-6 h-6 rounded-full border-2 border-black"
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
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: c.hex }}
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
      <div className="flex flex-row">
        {textColors.map((c, i) => {
          return (
            <div
              key={i}
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: c.hex }}
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
