import ComicImage from "./ComicImage";
import ComicText from "./ComicText";
export default function ComicSection({ elements }) {
  const images = [];
  const texts = [];
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

    <div className="comic-section w-full h-fit">
      <div className="grid grid-cols-3 auto-rows-[6rem] md: auto-rows[8rem] align-middle">
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
