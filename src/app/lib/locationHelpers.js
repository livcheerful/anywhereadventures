import {
  seattleLocs,
  seattleByCategory,
  chicagoLocs,
  chicagoByCategory,
  seWYByCategory,
  seWYLocs,
  allLocs,
  allByCategory,
} from "./MdxQueries";
export function savedLocationToObj(l) {
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
    name: "Seattle",
    center: [-122.341077, 47.519161],
    zoom: 11,
    locs: seattleLocs,
    byCategory: seattleByCategory,
    welcome: {
      thumbnail: "loc/triangle.jpg",
      stickers: [
        "loc/seattle/bridgeAndTunnel/seattleMap.png",
        "loc/seattle/montlakeBridge/tower.png",
      ],
    },
  },
  sewy: {
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
    name: "Chicago",
    center: [-87.633226, 41.871438],
    zoom: 13,
    locs: chicagoLocs,
    byCategory: chicagoByCategory,
  },
  all: {
    name: "World",
    center: [-102.10712, 40.903735],
    zoom: 4,
    locs: allLocs,
    byCategory: allByCategory,
  },
  // All doesn't work for now. Fix this later!
};
