"use client";
import {
  Map as MapLibre,
  Marker,
  Popup,
  NavigationControl,
  LngLatBounds,
} from "maplibre-gl";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "maplibre-gl/dist/maplibre-gl.css";
import { getMdx } from "../lib/clientPostHelper";
import MapPin from "./MapPin";
import { getSettings, hasLocationBeenVisited } from "../lib/storageHelpers";

function updateMarkerTabAccess(visible) {
  if (visible) {
    const allMarkers = [...document.querySelectorAll(".maplibregl-marker")];
    allMarkers.forEach((marker) => {
      marker.tabIndex = 0;
    });
  } else {
    const allMarkers = [...document.querySelectorAll(".maplibregl-marker")];
    allMarkers.forEach((marker) => {
      marker.tabIndex = -1;
    });
  }
}
export function shiftUp(lat, lon, zoom) {
  // returns a location that is shifted up to make center in the top of the screen
  let shiftValue = 0.1;
  switch (zoom) {
    case 10:
      shiftValue = 0.1;
      break;
    case 11:
      shiftValue = 0.2;
      break;
    case 12:
      shiftValue = 0.13;
      break;
    case 13:
      shiftValue = 0.074;
      break;
    case 14:
      shiftValue = 0.04;
      break;
    case 15:
      shiftValue = 0.02;
      break;
    default:
  }
  return { lon: lon, lat: lat - shiftValue };
}

function MapManager(map, router) {
  this.map = map;
  this.currentLayers = new Map(); // Stores latlong -> layerid
  this.exploreMarkers = new Map(); // Not MapLibre map, the CS object Map

  // Returns the pin from currentlayers
  this.getPinFromSlug = function (slug) {
    this.currentLayers.get(slug);
  };

  this.deleteExploreMarkerFromSlug = function (slugToDelete) {
    this.exploreMarkers.get(slugToDelete).remove();
    this.exploreMarkers.delete(slugToDelete);
  };

  this.deleteAllPins = function () {
    for (const slugToDelete of this.currentLayers.keys()) {
      this.currentLayers.get(slugToDelete).remove();
      this.currentLayers.delete(slugToDelete);
    }
  };

  this.deleteAllExploreMarkers = function () {
    for (const slug of this.exploreMarkers.keys()) {
      this.exploreMarkers.get(slug).remove();
      this.exploreMarkers.delete(slug);
    }
  };

  this.addExploreMarker = function (slug, markerInfo, latlon, image, cb) {
    const el = document.createElement("div");
    el.className =
      "marker rounded-full border-gray-800 bg-white drop-shadow-2xl cursor-pointer";
    el.style.backgroundImage = `url(${image})`;
    el.style.backgroundSize = `cover`;
    el.style.borderWidth = "1px";
    el.style.width = `3rem`;
    el.style.height = `3rem`;
    const marker = new Marker({ element: el }).setLngLat([
      latlon[1],
      latlon[0],
    ]);

    el.addEventListener("click", () => {
      cb(markerInfo, marker);
    });
    marker.addTo(this.map);
    addAccessibilityAttrs(el, marker, markerInfo, cb);
    this.exploreMarkers.set(slug, marker);
  };

  function addAccessibilityAttrs(el, pin, markerInfo, onClickFunc) {
    el.setAttribute(
      "aria-label",
      `${markerInfo.title}${
        markerInfo.neighborhood ? ` - ${markerInfo.neighborhood}` : ""
      }}`
    );
    el.setAttribute("role", "button");
    el.addEventListener("keydown", (e) => {
      if (e.code == "Enter") {
        onClickFunc(markerInfo, pin);
      }
    });
  }

  function makeMarker(info, onClickCb, image) {
    const el = document.createElement("div");
    el.className =
      "marker rounded-full border-gray-800 bg-white drop-shadow-2xl cursor-pointer";
    el.style.backgroundImage = `url(${image})`;
    el.style.backgroundPosition = "center";
    el.style.backgroundSize = `cover`;
    el.style.width = `4rem`;
    el.style.height = `4rem`;

    const hasBeenVisited = hasLocationBeenVisited(info.slug);
    el.style.filter = hasBeenVisited ? " brightness(90%) contrast(40%)" : "";
    el.style.borderColor = hasBeenVisited ? "gray" : "rgb(217 249 157)";
    el.style.borderWidth = hasBeenVisited ? "1px" : "0px";
    el.style.zIndex = hasBeenVisited ? "1" : "2";
    el.style.boxShadow = hasBeenVisited
      ? ""
      : "0 0 10px 4px rgba(255, 255, 0, 0.1)";

    const marker = new Marker({ element: el }).setLngLat([
      info.latlon[1],
      info.latlon[0],
    ]);

    marker.getElement().addEventListener("click", () => {
      onClickCb(info, marker);
    });
    return marker;
  }

  this.flyTo = function (center, zoom, shift = true) {
    const reduceAnim = getSettings().reduceAnims;
    if (reduceAnim) {
      this.map.jumpTo({
        center: shift
          ? shiftUp(center[1], center[0], zoom || 13)
          : { lat: center[1], lon: center[0] },
        zoom: zoom || 13,
      });
    } else {
      this.map.flyTo({
        center: shift
          ? shiftUp(center[1], center[0], zoom || 13)
          : { lat: center[1], lon: center[0] },
        zoom: zoom || 13,
        speed: 0.9,
      });
    }
  };

  this.updatePins = function (pinCb, chosenLocation, router) {
    if (!chosenLocation) return;
    console.log(chosenLocation);

    const locs = chosenLocation.locs;
    this.deleteAllPins();
    for (const slug in locs) {
      const markerInfo = locs[slug];
      const pin = makeMarker(markerInfo, pinCb, markerInfo.cameraImage);
      const layer = pin.addTo(this.map);
      const el = pin.getElement();

      addAccessibilityAttrs(el, pin, markerInfo, pinCb);
      this.currentLayers.set(slug, layer);
    }
  };

  this.updateStyle = function (style, pinCb, locs) {
    // Delete all pins and replace with new style
    this.deleteAllPins();
    for (const slug in locs) {
      const markerInfo = locs[slug];
      const pin = makeMarker(markerInfo, pinCb, markerInfo.cameraImage);
      const layer = pin.addTo(this.map);
      const el = pin.getElement();

      addAccessibilityAttrs(el, pin, markerInfo, pinCb);
      this.currentLayers.set(slug, layer);
    }
    this.map.setStyle(style);
  };
}

export default function MyMap({
  mapCB,
  mapClickHandler,
  defaultLocation,
  paneOpen,
  setPaneOpen,
  viewingPin,
  setViewingPin,
  chosenLocation,
  setCurrentSlug,
}) {
  const router = useRouter();
  const [zoom, setZoom] = useState(defaultLocation.zoom);
  const [center, setCenter] = useState(defaultLocation.center);
  const [mapManager, setMapManager] = useState();
  const navControlRef = useRef();

  // Initialize
  useEffect(() => {
    let map = new MapLibre({
      container: "map",
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      zoom: zoom,
      center: center,
      attributionControl: false,
      pitch: 60,
    });
    const navControl = new NavigationControl({
      visualizePitch: true,
      visualizeRoll: false,
      showZoom: true,
      showCompass: true,
    });
    navControlRef.current = navControl;
    map.addControl(navControl, "top-left");
    const myMap = new MapManager(map, router);
    mapCB(myMap);
    setMapManager(myMap);
  }, []);

  // Update Map State between explore and my map
  useEffect(() => {
    if (!mapManager) return;
    // Clean up from Explore View
    mapManager.deleteAllExploreMarkers();

    // Set up My Map View
    mapManager.updateStyle(
      "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      myMapPinClickHandler,
      chosenLocation.locs
    );
  }, [mapManager]);

  // Update Map pins based on saved locations
  useEffect(() => {
    if (!mapManager) return;

    mapManager.updatePins(myMapPinClickHandler, chosenLocation, router);
  }, [chosenLocation]);

  // Change map controls depending on if map is open or not
  useEffect(() => {
    updateMarkerTabAccess(!paneOpen);
  }, [paneOpen]);

  function myMapPinClickHandler(info, pin) {
    function cb(mdxArr) {
      setViewingPin(undefined);
      const mdxInfo = mdxArr[0];
      mapManager.map.dragPan.disable();
      mapManager.flyTo(
        [mdxInfo.latlon[1], mdxInfo.latlon[0]],
        mdxInfo.zoom,
        false
      );

      // Update reading pane
      setCurrentSlug(mdxInfo.slug);

      mapManager.map.once("moveend", () => {
        setViewingPin({ mdx: mdxInfo, pin: pin });
      });
    }

    getMdx([info.slug], cb);
  }

  return (
    <div
      className="w-full overflow-clip"
      onClick={() => {
        mapClickHandler();
        mapManager.map.dragPan.enable();
      }}
    >
      <div className="bg-slate-800 w-full h-dvh" id="map"></div>
      {viewingPin && (
        <MapPin
          mdx={viewingPin.mdx}
          setPaneOpen={setPaneOpen}
          onCloseCB={() => {
            setViewingPin(undefined);
            mapManager.map.dragPan.enable();
          }}
        />
      )}
    </div>
  );
}
