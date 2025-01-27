"use client";
import { Map } from "maplibre-gl";
import { useEffect, useState } from "react";
export default function MainMap() {
  const [zoomLevel, setZoomLevel] = useState(11);
  const [center, setCenter] = useState([-122.341077, 47.619161]);

  const loadImages = async (map) => {
    const smiley = await map.loadImage("./smiley.png");
    map.addImage("smiley", smiley.data);
  };

  const loadFile = async (filePath) => {
    const resCss = await fetch(`/api/file/styles.css`);
    const res = await fetch(`/api/file/${filePath}`);
    const css = await resCss.json();
    const html = await res.json();

    setLocationContent(`<style>${css.html}</style>\n${html.html}`);
  };

  const addPins = async (map) => {
    const i = await loadImages(map);
    map.addSource("locs", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: locationData.map((l, index) => {
          return {
            type: "Feature",
            properties: {
              id: l.id,
              index: index,
            },
            geometry: {
              type: "Point",
              coordinates: l.coordinates,
            },
          };
        }),
      },
    });

    map.addLayer({
      id: "locs",
      type: "symbol",
      source: "locs",
      layout: {
        "icon-image": "smiley",
        // get the year from the source's "year" property
        "text-field": ["get", "year"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 1.25],
        "text-anchor": "top",
        "icon-size": 0.5,
      },
    });
  };
  useEffect(() => {
    console.log("VVN IN HERE");
    let map = new Map({
      container: "map",
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      zoom: zoomLevel,
      center: center,
    });
    // map.on("load", () => {
    //   addPins(map);
    // });
    // map.on("click", "locs", (e) => {
    //   setShowingLocationId(e.features[0].properties.id);
    //   setShowingLocationIndex(e.features[0].properties.index);
    //   const itemIndex = e.features[0].properties.index;
    //   loadFile(locationData[itemIndex].html);
    // });
  }, []);
  return (
    <div className="w-full">
      <div className="bg-slate-800 w-full h-screen" id="map"></div>
    </div>
  );
}
