"use client";
import MapBrochure from "./MapBrochure";
import { categoryInfo } from "../content/meta";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Observer from "gsap/src/Observer";
import { useRef } from "react";

import { useState, useEffect } from "react";
export default function MapBrochures({
  brochureViewOpen,
  setBrochureViewOpen,
  viewingExploreCategory,
  setViewingExplorePin,
  chosenLocation,
  mapManager,
  viewingBrochureIndex,
  setViewingBrochureIndex,
  handleCloseBrochureView,
}) {
  function makeCategoriesIntoArray(categories) {
    let catArr = [];
    for (let i = 0; i < Object.keys(categories).length; i++) {
      const category = categories[i];

      catArr.push({
        tag: category.tag,
        posts: category.posts,
        ...categoryInfo[category.tag],
      });
    }
    return catArr;
  }

  const [categories, setCategories] = useState(
    makeCategoriesIntoArray(chosenLocation.byCategory)
  );

  useGSAP(() => {
    const mapWidth = document
      .getElementById("map")
      .getBoundingClientRect().width;
    // console.log(document.getElementById("map").getBoundingClientRect().width);
    gsap.registerPlugin(Observer);
    // Observer.create({
    //   target: "#allBrochures",
    //   dragMinimum: 10,
    //   tolerance: 200,
    //   scrollX: (self) => {
    //     console.log("VVN change x ");
    //     console.log(self);
    //     setViewingBrochureIndex(viewingBrochureIndex + 1);
    //     if (viewingBrochureIndex < categories.length - 1) {
    //     }
    //   },
    // });
  }, []);

  useEffect(() => {
    if (brochureViewOpen) {
      // Scroll the preview into view
      const brochures = document.querySelectorAll(".brochure");
      const elementWeWant = brochures[viewingBrochureIndex];
      const amountToScroll = elementWeWant.getBoundingClientRect().left;
      console.log(elementWeWant);
      document.getElementById("allBrochures").scroll({
        left: amountToScroll,
      });
    }
  }, [viewingBrochureIndex]);

  useEffect(() => {
    console.log("seting viewing explore category");

    categories.forEach((c, i) => {
      if (c.tag == viewingExploreCategory) {
        setViewingBrochureIndex(i);
      }
    });
  }, [viewingExploreCategory]);

  return (
    <div>
      {/* Keep one in the corner */}
      {brochureViewOpen == false && (
        <div
          tabIndex={0}
          className="w-full h-fit absolute -right-1/3 top-1/2 rotate-[10deg] scale-75 "
        >
          <MapBrochure
            category={categories[viewingBrochureIndex]}
            setBrochureViewOpen={setBrochureViewOpen}
            setViewingExplorePin={setViewingExplorePin}
            isPreviewBrochure={true}
            chosenLocation={chosenLocation}
            mapManager={mapManager}
          />
        </div>
      )}

      {brochureViewOpen && (
        <div
          id="allBrochures"
          className="flex flex-row w-full overflow-x-auto absolute top-1/4 h-full snap-x snap-mandatory gap-4 "
        >
          {categories.map((category, i) => {
            return (
              <div
                categorytag={category.tag}
                className="brochure w-10/12  h-3/4  shrink-0 snap-start snap-always pl-2"
                key={i}
                id={category.tag}
              >
                <MapBrochure
                  brochureViewOpen={brochureViewOpen}
                  setBrochureViewOpen={setBrochureViewOpen}
                  category={category}
                  setViewingExplorePin={setViewingExplorePin}
                  chosenLocation={chosenLocation}
                  mapManager={mapManager}
                  handleCloseBrochureView={handleCloseBrochureView}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
