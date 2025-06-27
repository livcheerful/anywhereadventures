export default function ComicText({ textInfo }) {
  /**
   * Style options:
   *  - text font
   *  - bubble options
   *    - tail start degree -- right is 0 deg, going clockwise
   *  - text alignment
   */

  function makeBubble() {
    const tailDegree = textInfo.bubbleStyle?.tailDegree;
    const tailRadians = (tailDegree * Math.PI) / 180;

    let xOffset = 0;
    let yOffset = 0;

    const margin = 8;
    const bubbleWidth = 100;
    const bubbleHeight = 32 + margin * 2;
    const bubbleWid = bubbleWidth / 2;
    const bubbleHei = bubbleHeight / 2;
    const bubbleDrop = 5; // Curve size
    const tailLength = 10;
    const tailGap = 10;
    const strokeWidth = textInfo.size.width > 1 ? 1 : 2;
    const absStrokeWidth = 2;

    const viewboxWidth = bubbleWidth + tailLength + absStrokeWidth;
    const viewboxHeight = bubbleHeight + absStrokeWidth + tailLength;

    const radianTurn = Math.atan(viewboxHeight / viewboxWidth);
    const degreeTurn = (radianTurn * 180) / Math.PI;

    let x = 0;
    let y = 0;
    let w = viewboxWidth / 2;
    let h = viewboxHeight / 2;

    if (tailDegree) {
      if (tailDegree < degreeTurn) {
        x = w - 3;
        y = x * Math.tan(tailRadians);
      } else if (tailDegree < 180 - degreeTurn) {
        y = h - 3;
        x = y / Math.tan(tailRadians);
      } else if (tailDegree < degreeTurn + 180) {
        x = -1 * (w - 3);
        y = x * Math.tan(tailRadians);
      } else if (tailDegree < 360 - degreeTurn) {
        y = -1 * (h - 3);
        x = y / Math.tan(tailRadians);
      } else {
        x = w - 3;
        y = x * Math.tan(tailRadians);
      }
    }
    if (tailDegree) {
      xOffset = tailLength * Math.cos(Math.PI + tailRadians);
      yOffset = tailLength * Math.sin(Math.PI + tailRadians);
    }

    const viewboxCenterX = viewboxWidth / 2;
    const viewboxCenterY = viewboxHeight / 2;
    const a = (tailGap / 2) * Math.sin(tailRadians);
    const b = -1 * (tailGap / 2) * Math.cos(tailRadians);
    const c = -1 * a;
    const d = -1 * b;
    console.log(`(a,b), (x,y), (c,d): (${a},${b}) (${x}, ${y}) (${c}, ${d})`);
    return (
      <svg
        className="absolute stroke-black w-full h-full"
        preserveAspectRatio="none"
        strokeLinejoin="round"
        viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      >
        {tailDegree && (
          <path
            d={`m${a + viewboxCenterX} ${b + viewboxCenterY} l${x - a} ${
              y - b
            } l${c - x} ${d - y}`}
            strokeLinejoin="round"
            style={{ strokeWidth: `${2}px` }}
            className="fill-white"
          />
        )}
        <path
          d={`m${
            viewboxCenterX + xOffset
          } ${yOffset} c${bubbleWid} 0, ${bubbleWid} ${bubbleDrop}, ${bubbleWid} ${bubbleHei} c0 ${
            bubbleHei - bubbleDrop - 0
          }, -${bubbleDrop} ${bubbleHei - 0}, -${bubbleWid} ${
            bubbleHei - 0
          } c-${
            bubbleWid - bubbleDrop
          } 0, -${bubbleWid} -${bubbleDrop}, -${bubbleWid} -${bubbleHei} c0 -${
            bubbleHei - bubbleDrop
          }, ${bubbleDrop} -${bubbleHei}, ${bubbleWid} -${bubbleHei}`}
          style={{ strokeWidth: `${strokeWidth}px` }}
          className="fill-white  "
        />
        {tailDegree && (
          <path
            d={`m${a + viewboxCenterX} ${b + viewboxCenterY} l${x - a} ${
              y - b
            } l${c - x} ${d - y}`}
            style={{ strokeWidth: `${2}px` }}
            className="fill-white stroke-transparent"
          />
        )}
      </svg>
    );
  }

  function calculateOffset() {
    return {
      left: "0px",
      top: "-10px",
    };
  }

  function createTextStyles() {
    let offSet = textInfo.style.outline == "bubble" ? calculateOffset() : {};
    let alignStyle = {};
    if (textInfo.style.outline != "bubble") {
      switch (textInfo.style.textAlign) {
        case "left":
          alignStyle = { alignItems: "flex-start" };
          break;
        case "center":
          alignStyle = { alignItems: "center" };
          break;
        case "right":
          alignStyle = { alignItems: "flex-end" };
          break;
        default:
          alignStyle = { alignItems: "flex-start" };
      }
    }
    return { ...offSet, ...alignStyle };
  }
  function createBubbleStyles() {
    let borderStyles = {};
    switch (textInfo.style.outline) {
      case "bubble":
        break;
      case "box":
        borderStyles = { border: "2px black solid" };
        break;
      case "none":
        borderStyles = {};
        break;
      default:
        borderStyles = {};
        break;
    }

    return {
      fontFamily: `Overpass`,
      fontWeight: "bold",
      padding: "3px",
      margin: "2px",
      ...borderStyles,
    };
  }
  return (
    <div
      className={`relative  ${
        textInfo.style.outline == "bubble" ? "w-full h-full" : "w-full h-fit"
      }`}
      style={createBubbleStyles()}
    >
      {textInfo.style.outline == "bubble" && makeBubble()}
      <div
        className={`flex flex-col ${
          textInfo.style.outline == "bubble"
            ? "absolute items-center justify-center w-full h-full"
            : "w-full"
        }`}
        style={createTextStyles()}
      >
        <div
          className="w-fit h-fit"
          style={{ fontSize: textInfo.style.fontSize }}
        >
          {textInfo.src}
        </div>
      </div>
    </div>
  );
}
