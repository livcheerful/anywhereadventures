/**
 * slugkey: {
 *     latlon: []
 * }
 */

export const localStorageKey = "savedLocations";

const itemsStorageKey = "savedItems";
const scrapbookPageKey = "scrapbook";
const userIdKey = "userId";
const stampKey = "stamps";
const homeLocationKey = "homeLoc";

export function clearAll() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(localStorageKey);
    localStorage.removeItem(itemsStorageKey);
    localStorage.removeItem(scrapbookPageKey);
    localStorage.removeItem(userIdKey);
    localStorage.removeItem(stampKey);
    localStorage.removeItem(homeLocationKey);
  }
}

function getAll(key) {
  let saved;
  if (typeof window !== "undefined") {
    saved = localStorage.getItem(key);
  } else {
    saved = "";
  }
  const parsed = saved ? JSON.parse(saved) : {};
  return parsed;
}

export function isAdded(storageKey, key) {
  const locs = getAll(storageKey);
  return Object.keys(locs).includes(key);
}

export function getAllLCItems() {
  const saved = getAll(itemsStorageKey);
  return saved;
}

export function removeLCItem(lcItem) {
  const locs = getAll(itemsStorageKey);

  delete locs[lcItem];
  if (typeof window !== "undefined") {
    localStorage.setItem(itemsStorageKey, JSON.stringify(locs));
  }

  return locs;
}

export function getAllPages() {
  return getAll(scrapbookPageKey);
}

export function numberOfPages() {
  return Object.keys(getAllPages()).length;
}

export function hasLocationBeenVisited(slug) {
  return !!getPage(slug);
}

export function getPage(slug) {
  const pages = getAllPages();

  return pages[slug];
}

export function savePage(slug, imgData, date) {
  const pages = getAllPages();

  pages[slug] = { image: imgData, date: date };
  if (typeof window !== "undefined")
    localStorage.setItem(scrapbookPageKey, JSON.stringify(pages));
}

export function saveLCItem(lcItem, image, caption, slug) {
  const locs = getAll(itemsStorageKey);
  if (!isAdded(itemsStorageKey, lcItem)) {
    locs[lcItem] = {
      link: lcItem,
      image: image,
      caption: caption,
      fromSlug: slug,
      timeAdded: new Date(),
    };

    if (typeof window !== "undefined")
      localStorage.setItem(itemsStorageKey, JSON.stringify(locs));
  }

  return locs;
}

export function getStamps() {
  const stampsSoFar = getAll(stampKey);
  return stampsSoFar;
}

export function getNumberOfStamps() {
  const stamps = getStamps();
  return Object.keys(stamps).length;
}

export function saveStamp(stampList) {
  const stampsSoFar = getAll(stampKey);
  for (let i = 0; i < stampList.length; i++) {
    const currStamp = stampList[i];
    stampsSoFar[currStamp.slug] = stampList[i];
  }
  if (typeof window != "undefined")
    localStorage.setItem(stampKey, JSON.stringify(stampsSoFar));
}

export function setHomeLocation(locName) {
  if (typeof window != "undefined") {
    localStorage.setItem(homeLocationKey, locName);
  }
}

export function getHomeLocation() {
  if (typeof window != "undefined") {
    return localStorage.getItem(homeLocationKey);
  }
}
