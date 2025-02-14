export default function Comic({ image, position, speechBubbles }) {
  // VVN TODO calculate bubble height and width based on text
  // VVN todo text centering helper
  // VVN TODO making svg bubble helper

  return (
    <div
      className={`flex ${position == "left" ? "flex-row" : "flex-row-reverse"}`}
    >
      <img src={image} className="h-comic select-none" />
      {speechBubbles?.map((sb, i) => {
        return (
          <div key={i} className="w-10 center">
            {/* line break code goes here */}
            {sb.text}
            {/* {Also need to make the text bubble svg} */}
          </div>
        );
      })}
    </div>
  );
}
