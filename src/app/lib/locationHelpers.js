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

export const locationData = {
  seattle: {
    name: "Seattle",
    center: [-122.341077, 47.519161],
    zoom: 11,
    locs: seattleLocs,
    byCategory: seattleByCategory,
  },
  sewy: {
    name: "Southeast Wyoming",
    center: [-105.195416, 41.269038],
    zoom: 8,
    locs: seWYLocs,
    byCategory: seWYByCategory,
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
