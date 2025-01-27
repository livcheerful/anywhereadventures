"use client";

import { Map, MercatorCoordinate } from "maplibre-gl";
import { useEffect, useState } from "react";

export default function PixelMap({ centerStart, zoom = 3 }) {
  const [zoomLevel, setZoomLevel] = useState(zoom);
  const [mapView, setMapView] = useState(undefined);
  const [mapSources, setMapSources] = useState([]);
  const [center, setCenter] = useState(centerStart);
  const [mapLayers, setMapLayers] = useState([]);

  const getEnclosing = async (long, lat) => {
    var result = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      // The body contains the query
      // to understand the query language see "The Programmatic Query Language" on
      // https://wiki.openstreetmap.org/wiki/Overpass_API#The_Programmatic_Query_Language_(OverpassQL)
      body:
        "data=" +
        encodeURIComponent(`
              [out:json];
                is_in(47.629359, -122.335322);
              out;
          `),
    }).then((data) => data.json());
    console.log(result);
    console.log("VVN in enclosing");
  };

  const splitGrid = (start, width, height) => {
    let waterSquares = [];
    let landSquares = [];
    for (let xDiff = 0; xDiff < 40; xDiff++) {
      for (let yDiff = 0; yDiff < 40; yDiff++) {
        const long = start[0] + xDiff * width;
        const lat = start[1] + yDiff * height;
        const s = buildSquare(long, lat, width, height);

        // const typeOfTile = getEnclosing(long, lat);
        if (Math.random() < 0.5) {
          waterSquares.push(s);
        } else {
          landSquares.push(s);
        }
      }
    }
    // return [[], []];
    return [waterSquares, landSquares];
  };

  const loadImages = async (map) => {
    const bushTile = await map.loadImage("./bushtile.png");
    const carTile = await map.loadImage("./cartile.png");
    const waterTile = await map.loadImage("./watertile.png");
    map.addImage("bush", bushTile.data);
    map.addImage("car", carTile.data);
    map.addImage("water", waterTile.data);
  };
  const buildSquare = (x, y, width, height) => {
    return [
      [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
        [x, y],
      ],
    ];
  };

  const buildGrid = () => {
    let gridCount = 40;
    let gridSpace = 15 / Math.pow(2, zoomLevel);
    let yGridSpace = 10 / Math.pow(2, zoomLevel);
    let start = [
      center[0] - (gridSpace * gridCount) / 2,
      center[1] - (yGridSpace * gridCount) / 2,
    ];
    let grid = [];
    for (let xDiff = 0; xDiff < gridCount; xDiff++) {
      // console.log(xDiff);
      let newX = start[0] + xDiff * gridSpace;
      let newY = start[1] + xDiff * yGridSpace;
      grid.push(
        [
          [newX, start[1] - yGridSpace * gridCount],
          [newX, start[1] + yGridSpace * gridCount],
        ],
        [
          [start[0] - gridSpace * gridCount, newY],
          [start[0] + gridSpace * gridCount, newY],
        ]
      );
    }
    console.log(grid);
    return grid;
  };

  const updateGrid = (map) => {
    // Remove old Sources and Layers
    for (let i = 0; i < mapLayers.length; i++) {
      map.removeLayer(mapLayers[i]);
    }
    for (let i = 0; i < mapSources.length; i++) {
      map.removeSource(mapSources[i]);
    }
    if (map.getLayer("grid")) {
      map.removeLayer("grid");
      map.removeSource("grid");
    }

    const gridCount = 40;
    let gridSpace = 15 / Math.pow(2, zoomLevel);
    let yGridSpace = 10 / Math.pow(2, zoomLevel);
    let start = [
      center[0] - (gridSpace * gridCount) / 2,
      center[1] - (yGridSpace * gridCount) / 2,
    ];
    const multiSquares = splitGrid(start, gridSpace, yGridSpace);
    const newSources = [];
    const newLayers = [];
    for (let i = 0; i < multiSquares.length; i++) {
      newSources.push(`square${zoomLevel}-${center[0]},${center[1]}-${i}`);
      map.addSource(`square${zoomLevel}-${center[0]},${center[1]}-${i}`, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "MultiPolygon",
            coordinates: multiSquares[i],
          },
        },
      });

      newLayers.push(`square${zoomLevel}-${center[0]},${center[1]}-${i}`);
      const patterns = ["water", "bush"];
      map.addLayer({
        id: `square${zoomLevel}-${center[0]},${center[1]}-${i}`,
        type: "fill",
        source: `square${zoomLevel}-${center[0]},${center[1]}-${i}`,
        paint: {
          "fill-pattern": `${patterns[i]}`,
        },
      });
    }
    setMapSources(newSources);
    setMapLayers(newLayers);

    map.addSource("grid", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "MultiLineString",
          coordinates: buildGrid(),
        },
      },
    });
    map.addLayer({
      id: "grid",
      type: "line",
      source: "grid",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#888",
        "line-width": 0.8,
      },
    });
  };
  useEffect(() => {
    let map = new Map({
      container: "map",
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
      zoom: zoomLevel,
      center: center,
    });

    map.on("zoomend", () => {
      setZoomLevel(map.getZoom());
      console.log(map.getZoom());
    });

    map.on("moveend", () => {
      const newCenter = map.getCenter();
      setCenter([newCenter.lng, newCenter.lat]);
    });

    map.on("load", () => {
      loadImages(map);
      updateGrid(map);
    });

    setMapView(map);
  }, []);

  useEffect(() => {
    if (!mapView) return;
    updateGrid(mapView);
  }, [zoomLevel, center]);

  return (
    <div className="w-[30rem] h-[50rem] " id="map">
      {/* <img src="/bushtile.png" /> */}
    </div>
  );
}
