"use client";
import { Map, MercatorCoordinate } from "maplibre-gl";
import { useEffect, useState, useRef } from "react";

import client from "../../tina/__generated__/client";

export default function Page() {
  const tags = ["Bridge", "Person", "Neighborhood"];
  const [zoomLevel, setZoomLevel] = useState(11);
  const [center, setCenter] = useState([-122.341077, 47.619161]);

  const [showingContentDiscovery, setShowingContentDiscovery] = useState(false);

  const [posts, setPosts] = useState([]);
  const contentRef = useRef(undefined);

  useEffect(() => {
    const callTina = async () => {
      const { data } = await client.queries.postConnection();
      console.log(data);
      console.log("number of posts:");
      console.log(data.postConnection.edges.length);
      setPosts(data.postConnection.edges);
    };
    callTina();
  }, []);

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
  }, []);
  return (
    <div className="overflow-hidden h-screen flex flex-row">
      <div className="bg-slate-400 w-full h-screen " id="map"></div>
      {showingContentDiscovery && (
        <div className="w-full h-full bg-white absolute z-20">
          <div
            onClick={() => {
              setShowingContentDiscovery(false);
            }}
            className="cursor-pointer"
          >
            Back
          </div>
          <div className="flex gap-2">
            {posts.map((p) => {
              return <div className="w-20 h-20 bg-black">Hello</div>;
            })}
          </div>
        </div>
      )}

      <div className="w-full min-h-10 bg-white fixed self-end">
        <div
          className="w-10 h-10 bg-orange-400 absolute rounded-full -top-5 right-3 cursor-pointer"
          onClick={() => {
            setShowingContentDiscovery(true);
          }}
        ></div>
      </div>
    </div>
  );
}
