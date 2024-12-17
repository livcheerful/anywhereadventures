"use client";
import { Map, MercatorCoordinate } from "maplibre-gl";
import { useEffect, useState, useRef } from "react";

const locationData = [
  {
    id: "SEA-01",
    title: "Regrade",
    html: "regrade.html",
    coordinates: [-122.343483, 47.613994],
  },
  {
    id: "SEA-02",
    title: "Dr. Jose P Rizal Bridge",
    html: "rizal.html",
    coordinates: [-122.31739583840579, 47.59551148591616],
  },
];

export default function Page() {
  const tags = ["Bridge", "Person", "Neighborhood"];
  const [zoomLevel, setZoomLevel] = useState(11);
  const [center, setCenter] = useState([-122.341077, 47.619161]);

  const [showingLocationId, setShowingLocationId] = useState(undefined);
  const [showingLocationIndex, setShowingLocationIndex] = useState(undefined);
  const [locationContent, setLocationContent] = useState(undefined);
  const contentRef = useRef(undefined);

  const loadImages = async (map) => {
    const bushTile = await map.loadImage("./bushtile.png");
    const carTile = await map.loadImage("./cartile.png");
    const waterTile = await map.loadImage("./watertile.png");
    const smiley = await map.loadImage("./smiley.png");
    map.addImage("bush", bushTile.data);
    map.addImage("car", carTile.data);
    map.addImage("water", waterTile.data);
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
    let map = new Map({
      container: "map",
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      zoom: zoomLevel,
      center: center,
    });

    map.on("load", () => {
      addPins(map);
    });
    map.on("click", "locs", (e) => {
      setShowingLocationId(e.features[0].properties.id);
      setShowingLocationIndex(e.features[0].properties.index);
      const itemIndex = e.features[0].properties.index;
      loadFile(locationData[itemIndex].html);
    });

    // setMapView(map);
  }, []);
  return (
    <div className="overflow-hidden h-screen flex flex-col md:flex-row">
      <div className="bg-slate-400 w-full h-screen " id="map">
        <div
          style={{ backgroundImage: "url(./paperbkgd.png)" }}
          className={`absolute bg-cover top-0 left-0 w-full md:w-1/3 md:min-w-[30rem] pt-8 drop-shadow-2xl h-3/4 md:h-full bg-white overflow-y-scroll `}
        >
          {/* {!showingLocationId && (
            <div>
              <div>Anywhere Adventures</div>
              <div className="flex flex-row flex-wrap gap-3">
                {tags.map((t, i) => {
                  return (
                    <div
                      className="border-purple-700 p-1 border-2 rounded-2xl bg-white cursor-pointer"
                      key={i}
                    >
                      {t}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {showingLocationId && <div>Back</div>} */}
          {showingLocationId && (
            <div
              id="content"
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: locationContent }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}
