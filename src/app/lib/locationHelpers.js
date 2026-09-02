import {
  seattleLocs,
  seattleByCategory,
  chicagoLocs,
  chicagoByCategory,
  seWYByCategory,
  seWYLocs,
  msLocs,
  pittsburghLocs,
  allLocs,
  allByCategory,
} from "./MdxQueries";
export function savedLocationToObj(l) {
  if (!l) return {};
  const locsArray = Object.keys(locationData).map((name) => {
    return locationData[name];
  });
  const locObj = locsArray.find((loc) => {
    return loc.name == l;
  });
  return locObj;
}

export const worldData = {
  center: [40.49668158884047, -100.10594069434062],
  zoom: 4,
};

export const locationData = {
  seattle: {
    id: "seattle",
    name: "Seattle",
    center: [-122.341077, 47.519161],
    zoom: 11,
    locs: seattleLocs,
    byCategory: seattleByCategory,
    welcome: {
      thumbnail: "/loc/triangle.jpg",
      stickers: [
        "/loc/seattle/bridgeAndTunnel/seattleMap.png",
        "/loc/seattle/montlakeBridge/tower.png",
      ],
    },
  },
  sewy: {
    id: "sewy",
    name: "Southeast Wyoming",
    center: [-105.195416, 41.269038],
    zoom: 8,
    locs: seWYLocs,
    byCategory: seWYByCategory,
    welcome: {
      thumbnail: "loc/sewy/wypack.png",
      stickers: [
        "stickerpacks/sewy/bill.png",
        "stickerpacks/sewy/grahamMarket.png",
      ],
    },
  },
  chicago: {
    id: "chicago",
    name: "Chicago",
    center: [-87.633226, 41.871438],
    zoom: 11,
    locs: chicagoLocs,
    byCategory: chicagoByCategory,
    welcome: {
      thumbnail: "loc/sewy/wypack.png",
      stickers: [
        "loc/chicago/greetingsFromChicago.jpg",
        "loc/chicago/onLeong/eastElevation.png",
      ],
    },
  },
  ms: {
    id: "ms",
    name: "Mississippi Sound",
    center: [-88.9230477473981, 30.401829792956097],
    zoom: 7,
    locs: msLocs,
    welcome: {
      thumbnail: "loc/sewy/wypack.png",
      stickers: [
        "stickerpacks/ms/river.png",
        "stickerpacks/ms/biloxiLight.jpg",
      ],
    },
  },
  pittsburgh: {
    id: "pittsburgh",
    name: "Pittsburgh",
    center: [-79.9757641895949, 40.44508029800718],
    zoom: 12,
    locs: pittsburghLocs,
    welcome: {
      thumbnail: "loc/sewy/wypack.png",
      stickers: [
        "stickerpacks/pittsburgh/citySeal.jpg",
        "stickerpacks/pittsburgh/thePoint.jpg",
      ],
    },
  },
  all: {
    id: "",
    name: "World",
    center: [-102.10712, 40.903735],
    zoom: 4,
    locs: allLocs,
    byCategory: allByCategory,
    welcome: {
      thumbnail: "loc/sewy/wypack.png",
      stickers: [
        "stickerpacks/sewy/bill.png",
        "stickerpacks/sewy/grahamMarket.png",
      ],
    },
  },
  // All doesn't work for now. Fix this later!
};
