"use client";
import {
  Map as MapLibre,
  Marker,
  Popup,
  NavigationControl,
  LngLatBounds,
} from "maplibre-gl";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { unopinionatedMapColor, unvisitedMapColor } from "../lib/constants";
import "maplibre-gl/dist/maplibre-gl.css";
import { getMdx } from "../lib/clientPostHelper";
import MapPin from "./MapPin";
import MapBrochures from "./MapBrochures";
import MapExploreMarker from "./MapExploreMarker";
import { hasLocationBeenVisited } from "../lib/storageHelpers";

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

  this.addExploreMarker = function (slug, title, latlon, image, cb) {
    const el = document.createElement("div");
    el.className =
      "marker rounded-full border-gray-800 bg-white drop-shadow-2xl cursor-pointer";
    el.style.backgroundImage = `url(${image})`;
    el.style.backgroundSize = `cover`;
    el.style.borderWidth = "1px";
    el.style.width = `3rem`;
    el.style.height = `3rem`;
    console.log(el);
    const marker = new Marker({ element: el }).setLngLat([
      latlon[1],
      latlon[0],
    ]);

    el.addEventListener("click", () => {
      cb();
    });
    marker.addTo(this.map);
    el.setAttribute("aria-label", title);
    el.setAttribute("role", "button");
    this.exploreMarkers.set(slug, marker);
  };

  function makeMarker(info, onClickCb) {
    const pin = new Marker({
      color: hasLocationBeenVisited(info.slug)
        ? unopinionatedMapColor
        : unvisitedMapColor,
    }).setLngLat(info.latlon);
    pin.getElement().addEventListener("click", () => {
      onClickCb(info, pin);
    });
    return pin;
  }

  this.flyTo = function (center, zoom, shift = true) {
    this.map.flyTo({
      center: shift
        ? shiftUp(center[1], center[0], zoom || 13)
        : { lat: center[1], lon: center[0] },
      zoom: zoom || 13,
      speed: 0.9,
    });
  };

  this.updatePins = function (locs, pinCb, router) {
    // Remove all the current pins.
    this.deleteAllPins();
    // Add back the ones we want
    for (const slug in locs) {
      const markerInfo = locs[slug];
      const pin = makeMarker(markerInfo, pinCb);
      const layer = pin.addTo(this.map);

      const el = pin.getElement();
      el.setAttribute("aria-label", info.title);
      el.setAttribute("role", "button");
      this.currentLayers.set(slug, layer);
    }
  };

  this.updateStyle = function (style, pinCb, locs) {
    // Delete all pins and replace with new style
    this.deleteAllPins();
    for (const slug in locs) {
      const markerInfo = locs[slug];
      console.log(markerInfo);
      const pin = makeMarker(markerInfo, pinCb);
      const layer = pin.addTo(this.map);
      const el = pin.getElement();
      el.setAttribute(
        "aria-label",
        `${markerInfo.title} ${
          markerInfo.neighborhood ? `- ${markerInfo.neighborhood}` : ""
        }}`
      );
      el.setAttribute("role", "button");
      this.currentLayers.set(slug, layer);
    }
    // asdf
    this.map.setStyle(style);
  };
}

export default function MyMap({
  mapCB,
  mapClickHandler,
  myLocations,
  setMyLocations,
  defaultLocation,
  paneOpen,
  setExploringContent,
  viewingPin,
  setViewingPin,
  chosenLocation,
  mapState,
  setMapState,
  viewingExploreCategory,
  setViewingExploreCategory,
  brochureViewOpen,
  setBrochureViewOpen,
}) {
  const router = useRouter();
  const [zoom, setZoom] = useState(defaultLocation.zoom);
  const [center, setCenter] = useState(defaultLocation.center);
  const [mapManager, setMapManager] = useState();
  const [viewingExplorePin, setViewingExplorePin] = useState(undefined);
  const [viewingBrochureIndex, setViewingBrochureIndex] = useState(0);
  const navControlRef = useRef();
  const exploreMapMouseHandler = useCallback(() => {
    setViewingExplorePin(undefined);
    handleCloseBrochureView();
  }, [setViewingExplorePin, brochureViewOpen]);

  function updateExploreMarkers() {}

  // Initialize
  useEffect(() => {
    let map = new MapLibre({
      container: "map",
      style:
        mapState == "myMap"
          ? "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
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
    console.log("------Navigation control:------");
    console.log(navControl);
    console.log("------Navigation control------");
    navControlRef.current = navControl;
    map.addControl(navControl, "top-left");
    const myMap = new MapManager(map, router);
    mapCB(myMap);
    setMapManager(myMap);
  }, []);
  function addExploreMarkerWithAnims(location) {
    console.log(location);
    mapManager.addExploreMarker(
      location.slug,
      location.title,
      location.latlon,
      location.cameraImage || location.cardImage,
      (marker) => {
        setViewingExploreCategory(undefined);
        setBrochureViewOpen(false);
        mapManager.flyTo(
          [location.latlon[1], location.latlon[0]],
          location.zoom
        );

        mapManager.map.dragPan.disable();

        mapManager.map.once("moveend", () => {
          setViewingExplorePin({ mdx: location, marker: marker });
          mapManager.map.dragPan.enable();
        });
      }
    );
  }

  // Update Map State between explore and my map
  useEffect(() => {
    if (!mapManager) return;
    if (mapState == "myMap") {
      // Clean up from Explore View
      mapManager.deleteAllExploreMarkers();
      mapManager.map.off("click", exploreMapMouseHandler);
      mapManager.map.off("dragstart", exploreMapMouseHandler);

      setViewingExplorePin(undefined);
      setViewingExploreCategory(undefined);
      handleCloseBrochureView();

      // Set up My Map View
      mapManager.updateStyle(
        "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
        myMapPinClickHandler,
        myLocations
      );
    } else {
      // Undo state from My Map view
      setViewingPin(undefined);
      mapManager.deleteAllPins();
      mapManager.map.dragPan.enable();

      // set up new view
      mapManager.flyTo(defaultLocation.center, defaultLocation.zoom, false);
      mapManager.updateStyle(
        "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        exploreMapPinClickHandler,
        myLocations
      );

      // Add custom map markers for all locations we don't already have added
      for (let i = 0; i < chosenLocation.locs.length; i++) {
        const location = chosenLocation.locs[i];

        if (myLocations[location.slug] == undefined) {
          addExploreMarkerWithAnims(location);
        }
      }

      // Add a listener for map touch to unset pins
      mapManager.map.on("click", exploreMapMouseHandler);
      mapManager.map.on("dragstart", exploreMapMouseHandler);
    }
  }, [mapState, mapManager]);

  useEffect(() => {
    if (!mapManager) return;
    if (viewingExploreCategory != undefined) {
      mapManager.flyTo(
        defaultLocation.center,
        defaultLocation.zoom,
        location.zoom
      );
    }
  }, [viewingExploreCategory]);

  // Update Map pins based on saved locations
  useEffect(() => {
    if (!mapManager) return;

    if (myLocations == undefined) return;

    mapManager.updatePins(myLocations, myMapPinClickHandler, router);
  }, [myLocations]);

  // Change map controls depending on if map is open or not
  useEffect(() => {
    if (mapState == "myMap") {
      updateMarkerTabAccess(!paneOpen);
    } else {
      updateMarkerTabAccess(true);
    }
  }, [paneOpen, mapState]);

  function exploreCategoryClickHander(category) {
    setViewingExplorePin(undefined);
    setViewingExploreCategory(category);
    setBrochureViewOpen(true);
  }

  function myMapPinClickHandler(info, pin) {
    function cb(mdxArr) {
      setViewingPin(undefined);
      const mdxInfo = mdxArr[0];
      mapManager.map.dragPan.disable();
      mapManager.flyTo(
        [mdxInfo.latlon[1], mdxInfo.latlon[0]],
        mdxInfo.zoom,
        true
      );

      mapManager.map.once("moveend", () => {
        setViewingPin({ mdx: mdxInfo, pin: pin });
      });
    }

    getMdx([info.slug], cb);
  }
  function exploreMapPinClickHandler(info, pin) {
    console.log("In explore map");
    console.log(info);
  }

  function handleCloseBrochureView() {
    // VVN TODO grab brochure state
    const brochures = document.querySelectorAll(".brochure");
    brochures.forEach((b, i) => {
      if (Math.abs(b.getBoundingClientRect().left) < 2) {
        setViewingBrochureIndex(i);
      }
    });

    setBrochureViewOpen(false);
  }

  return (
    <div
      className="w-full"
      onClick={() => {
        mapClickHandler();
      }}
    >
      <div className="bg-slate-800 w-full h-dvh" id="map"></div>
      <button
        aria-label="Add locations to Map"
        className="absolute top-2 right-2 w-16 h-16 bg-white rounded-full flex flex-row items-center justify-center drop-shadow-lg"
        onClick={() => {
          if (mapState == "myMap") {
            setMapState("explore");
            setExploringContent(true);
          } else {
            setMapState("myMap");
            setExploringContent(false);
          }
        }}
      >
        <div className=" select-none" aria-hidden="true" focusable="false">
          {mapState == "myMap" ? "+" : "x"}
        </div>
      </button>
      {viewingPin && (
        <MapPin
          mdx={viewingPin.mdx}
          pin={viewingPin.pin}
          onCloseCB={() => {
            setViewingPin(undefined);
            mapManager.map.dragPan.enable();
          }}
        />
      )}

      {viewingExplorePin && (
        <MapExploreMarker
          mdx={viewingExplorePin.mdx}
          marker={viewingExplorePin.marker}
          mapManager={mapManager}
          addExploreMarkerWithAnims={addExploreMarkerWithAnims}
          setMyLocations={setMyLocations}
          exploreCategoryClickHander={exploreCategoryClickHander}
          setViewingExplorePin={setViewingExplorePin}
        />
      )}
      {mapState == "explore" && (
        <MapBrochures
          brochureViewOpen={brochureViewOpen}
          setBrochureViewOpen={setBrochureViewOpen}
          viewingExploreCategory={viewingExploreCategory}
          setViewingExploreCategory={setViewingExploreCategory}
          setViewingExplorePin={setViewingExplorePin}
          chosenLocation={chosenLocation}
          mapManager={mapManager}
          handleCloseBrochureView={handleCloseBrochureView}
          viewingBrochureIndex={viewingBrochureIndex}
          setViewingBrochureIndex={setViewingBrochureIndex}
        />
      )}
      {mapState == "explore" && (
        <div className="absolute w-1/3 top-2 left-12 bg-white p-2 border-2 text-gray-900 border-gray-900 font-bold drop-shadow-xl">
          Discover new locations to add to your map
        </div>
      )}
    </div>
  );
}
