"use client";
import { Map as MapLibre, Marker } from "maplibre-gl";
import { useEffect, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

function AdventureMap(map) {
  this.map = map;
  this.currentLayers = new Map(); // Stores latlong -> layerid
  this.tempLayers = [];
  this.addTemporaryLayer = function (layer) {
    const l = layer.addTo(this.map);
    this.tempLayers.push(l);
    return l;
  };

  this.updatePins = function (locs) {
    const pinsWeHave = new Map(this.currentLayers);

    for (let i = 0; i < locs.length; i++) {
      pinsWeHave.delete(locs[i].slug);
      if (!this.currentLayers.has(locs[i].slug)) {
        const pin = new Marker().setLngLat(locs[i].latlon);
        const layer = pin.addTo(this.map);
        this.currentLayers.set(locs[i].slug, layer);
      }
    }
    for (const slugToDelete of pinsWeHave.keys()) {
      // Also remove it from our current layers map
      this.currentLayers.delete(slugToDelete);
      pinsWeHave.get(slugToDelete).remove();
    }
  };

  this.removeAllTempLayers = function () {
    this.tempLayers.forEach((tl) => {
      tl.remove();
    });
  };
}

export default function MainMap({ mapCB, mapClickHandler }) {
  const [zoom, setZoom] = useState(11);
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

  useEffect(() => {
    let map = new MapLibre({
      container: "map",
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      zoom: zoom,
      center: center,
      attributionControl: false,
    });
    mapCB(new AdventureMap(map));
  }, []);
  return (
    <div
      className="w-full"
      onClick={() => {
        mapClickHandler();
      }}
    >
      <div className="bg-slate-800 w-full h-screen" id="map"></div>
    </div>
  );
}
