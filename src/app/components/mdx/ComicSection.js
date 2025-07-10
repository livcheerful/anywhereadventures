import ComicImage from "./ComicImage";
import ComicText from "./ComicText";
export default function ComicSection({ overlap = 0, cols, elements }) {
  function estimateHeight() {
    return 200;
  }

  return (
    /**
     * Lay things out on a grid
     * Assume standard size for everything -- base cell will be a "standard" speech bubble size
     * Can define larger spans if user thinks it's needed
     */

    /**
     * Comic Section
     * Takes an array or images or text
     * The order will define accessibility reading order
     */

    /**
     * Generic properties on items and text:
     *  - Position on the grid
     *  - width + height (for text + images. just have to contain within)
     */

    /**
     * Text properties: (text won't center fancy. just regular centering.)
     *  - Bubble or no
     *      - where to put speech bubble tail? (tail entrance, tail exit). maybe first step is tail exit follows direction of entrance?
     *  - Text size? Regular or small
     *  - Text font?
     *  - Text contents (MDX)
     *  - Arrow (entrance + exit)
     */

    <div
      className="comic-section relative w-full h-fit"
      style={{
        top: `-${overlap}px`,
      }}
    >
      <div
        className="grid  auto-rows-[6rem] md: auto-rows[8rem] align-middle"
        style={{
          gridTemplateColumns: cols
            ? `repeat(${cols}, minmax(0, 1fr))`
            : `repeat(3, minmax(0, 1fr))`,
        }}
      >
        {elements.map((el, i) => {
          console.log(el);
          return (
            <div
              key={i}
              style={{
                gridRowStart: el.position.row,
                gridColumnStart: el.position.col,
                gridColumnEnd: `span ${el.size.width}`,
                gridRowEnd: `span ${el.size.height}`,
              }}
            >
              {el.type == "image" ? (
                <ComicImage imageInfo={el} />
              ) : (
                <ComicText textInfo={el} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
