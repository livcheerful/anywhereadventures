"use client";
import { useEffect, useState } from "react";
import { getStamps, getAllSlugs } from "../lib/storageHelpers";

const defaultStamp = "seattle-general-2.svg";
export default function StampbookPage() {
  const [svgPaths, setSvgPaths] = useState(new Map());
  const [slugToSvgIdAndPostInfo, setSlugToSvgIdAndPostInfo] = useState(
    new Map()
  );
  const [stamps, setStamps] = useState();
  const [slugs, setSlugs] = useState();

  async function fetchSVGs(slugs) {
    const pathsSoFar = new Map(svgPaths);
    if (slugToSvgIdAndPostInfo.size == 0) return;
    for (let i = 0; i < slugs.length; i++) {
      const slug = slugs[i];
      const stampId = slugToSvgIdAndPostInfo.get(slug).stampId;

      const file = await fetch(`/stamps/${stampId}`);
      const f = await file.text();
      pathsSoFar.set(stampId, f);
    }
    setSvgPaths(pathsSoFar);
  }

  async function fetchPost(fileName) {
    const file = await fetch(`/content/generated/${fileName}.json`);
    const f = await file.json();
    return f;
  }

  async function fetchSlugToStamp(slugs) {
    const mapSoFar = new Map(slugToSvgIdAndPostInfo);
    for (let i = 0; i < slugs.length; i++) {
      const post = await fetchPost(slugs[i]);
      mapSoFar.set(slugs[i], {
        stampId: post.stampName || defaultStamp,
        title: post.title,
        cardImage: post.cardImage,
      });
    }
    setSlugToSvgIdAndPostInfo(mapSoFar);
  }

  useEffect(() => {
    if (!stamps) return;
    fetchSVGs(Object.keys(stamps));
  }, [slugToSvgIdAndPostInfo]);
  useEffect(() => {
    const allStamps = getStamps();
    const allSlugs = getAllSlugs();
    fetchSlugToStamp(allSlugs);
    setSlugs(allSlugs);
    setStamps(allStamps);
  }, []);

  useEffect(() => {
    if (!stamps) return;

    const stampIds = Object.keys(stamps);
    for (let i = 0; i < stampIds.length; i++) {
      const stampId = stampIds[i];
      const stamp = stamps[stampId];
      const id = stamp.id.substring(0, stamp.id.length - ".svg".length);
      const query = `#${id} [custom='background-color']`;
      const stampElem = document.querySelector(query);
      if (!stampElem) return;
      stampElem.style.fill = stamp.color;
    }
  });

  return (
    <div className="flex flex-col items-center pt-4">
      <div className="font-bold">Visit each location and collect stamps</div>
      <div className="grid gap-2">
        {slugs &&
          slugs.map((slug, i) => {
            const postInfo = slugToSvgIdAndPostInfo.get(slug);
            if (!postInfo) return;
            const stampId = postInfo.stampId;
            let didWeGetStamp = false;
            const stampSlugs = Object.keys(stamps);

            for (let i = 0; i < stampSlugs.length; i++) {
              if (stamps[stampSlugs[i]].slug == slug) {
                didWeGetStamp = true;
              }
            }

            let svgPath = "";
            if (didWeGetStamp) {
              svgPath = svgPaths.get(stampId);
            }
            return (
              <div
                key={i}
                className="relative w-[20rem] h-[20rem] bg-white border-slate-200 border-2 "
                style={{
                  background: `url(${postInfo.cardImage})`,
                  backgroundSize: "cover",
                }}
              >
                <div
                  className={`absolute w-full h-full ${
                    didWeGetStamp
                      ? "backdrop-saturate-100"
                      : "backdrop-saturate-0 backdrop-blur-sm"
                  }`}
                ></div>
                <div
                  className="absolute w-full h-full flex flex-col items-center  justify-center "
                  style={{ boxShadow: "inset 0px 0px 10px 3px #000000" }}
                >
                  {didWeGetStamp && svgPath && (
                    <div
                      className="w-[12rem] h-[12rem] drop-shadow-lg"
                      key={i}
                      id={`${stampId.substring(
                        0,
                        stampId.length - ".svg".length
                      )}`}
                      dangerouslySetInnerHTML={{ __html: svgPath }}
                    ></div>
                  )}
                  <div className="text-center font-bold text-black bg-white/80 w-full h-fit absolute bottom-0">
                    {postInfo.title}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
