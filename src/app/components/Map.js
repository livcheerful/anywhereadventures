"use client";
import {
  Map as MapLibre,
  Marker,
  Popup,
  NavigationControl,
  LngLatBounds,
} from "maplibre-gl";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { unvisitedMapColor } from "../lib/constants";
import "maplibre-gl/dist/maplibre-gl.css";

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
    case 15:
      shiftValue = 0.02;
      break;
    default:
  }
  return { lon: lon, lat: lat - shiftValue };
}

function makePopup(l, callback) {
  const locationPopup = new Popup();
  const innerHtmlContent = `<div style="color : black;">
          <h4 class="h4Class">${l.title} </h4><img src="${l.cardImage}"/> </div>`;

  const divElement = document.createElement("div");
  const btn = document.createElement("div");
  btn.innerHTML = `<button class="btn btn-success btn-simple text-black" >Go</button>`;
  divElement.innerHTML = innerHtmlContent;
  divElement.appendChild(btn);
  // btn.className = 'btn';
  btn.addEventListener("click", callback);
  locationPopup.setDOMContent(divElement);
  return locationPopup;
}

export function makeNewMarker(color, l, router, addPopup = false) {
  const pin = new Marker({
    color: color || "#1111FF",
  }).setLngLat([l.latlon[1], l.latlon[0]]);
  if (addPopup) {
    const locationPopup = makePopup(l, (e) => {
      // console.log("Button clicked" + l.title);
      router.replace(`/${l.slug}`);
    });
    pin.setPopup(locationPopup);
  }
  pin.addClassName("pin");
  return pin;
}

function AdventureMap(map, router) {
  this.map = map;
  this.currentLayers = new Map(); // Stores latlong -> layerid
  this.tempLayers = [];

  this.groups = new Map();

  this.addLayer = function (layer, group) {
    const l = layer.addTo(this.map);
    if (this.groups.has(group)) {
      const soFar = this.groups.get(group);
      soFar.push(l);
      this.groups.set(group, soFar);
    } else {
      this.groups.set(group, [l]);
    }
    return l;
  };

  this.removeLayerGroup = function (group) {
    const allEm = this.groups.get(group);
    if (!allEm) {
      return;
    }
    allEm.forEach((l) => {
      l.remove();
    });

    this.groups.delete(group);
  };

  this.removeLayer = function (l) {
    l.remove();
  };

  this.updatePins = function (locs) {
    // Remove all the current pins.
    for (const slugToDelete of this.currentLayers.keys()) {
      this.currentLayers.delete(slugToDelete);
      // pinsWeHave.get(slugToDelete).remove();
    }

    // Add back the ones we want
    for (const slug in locs) {
      const pin = new Marker({ color: unvisitedMapColor }).setLngLat(
        locs[slug].latlon
      );
      pin.color = "#5a32a8";
      const locationPopup = makePopup(locs[slug]);

      pin.setPopup(locationPopup);
      const layer = pin.addTo(this.map);
      this.currentLayers.set(slug, layer);
    }
  };

  this.addTemporaryLayer = function (layer) {
    const l = layer.addTo(this.map);
    this.tempLayers.push(l);
    return l;
  };
  this.removeAllTempLayers = function () {
    this.tempLayers.forEach((tl) => {
      tl.remove();
    });
  };
}

export default function MainMap({
  mapCB,
  mapClickHandler,
  post,
  slug,
  exploringContent,
  myLocations,
}) {
  const [zoom, setZoom] = useState(11);
  const [center, setCenter] = useState([-122.341077, 47.519161]);
  const [mainMap, setMainMap] = useState(undefined);

  const router = useRouter();
  const loadImages = async (map) => {
    const smiley = await map.loadImage("./smiley.png");
    map.addImage("smiley", smiley.data);
  };

  function centerOfPoints(points) {
    if (points.length == 0) return center;
    if (points.length == 1) return points[0];
    let llb = new LngLatBounds();
    for (let i = 0; i < points.length; i++) {
      llb.extend([points[i][0], points[i][1]]);
    }
    console.log(llb);
    // return llb.getCenter();
  }

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
      pitch: 60,
    });
    map.on("click", (e) => {
      console.log("hey");
    });
    map.addControl(
      new NavigationControl({
        visualizePitch: true,
        visualizeRoll: false,
        showZoom: true,
        showCompass: true,
      }),
      "top-left"
    );
    const myMap = new AdventureMap(map, router);
    mapCB(myMap);
    setMainMap(myMap);
  }, []);

  // update map view
  useEffect(() => {
    if (!mainMap) return;

    if (!exploringContent) {
      // Only have the pins for the places we saved
      console.log(myLocations);
      if (myLocations == undefined) return;
      const c = centerOfPoints(myLocations);
      mainMap.updatePins(myLocations);
      // zoomToPlace(c, zoom, false);
    } else {
      if (slug == "discover") {
        zoomToPlace([center[1], center[0]], zoom, false);
      } else {
        if (!post) return;
        // Focus in on the place
        zoomToPlace(post.latlon, post.zoom, true);
      }
    }

    function zoomToPlace(coords, zoom, setTempPin = false) {
      mainMap.map.flyTo({
        center: shiftUp(coords[0], coords[1], zoom || 13),
        zoom: zoom || 8,
        speed: 0.4,
      });
      if (setTempPin) {
        const tempPinOnMainMap = makeNewMarker(unvisitedMapColor, {
          latlon: coords,
        });
        const l = mainMap.addTemporaryLayer(tempPinOnMainMap);
      }
    }
  }, [slug, exploringContent, post, myLocations]);
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
