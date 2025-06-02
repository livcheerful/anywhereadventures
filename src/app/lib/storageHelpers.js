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

export function remove(slug) {
  const locs = getAll(localStorageKey);
  delete locs[slug];
  if (typeof window !== "undefined")
    localStorage.setItem(localStorageKey, JSON.stringify(locs));
}

export function isLocationAdded(slug) {
  return isAdded(localStorageKey, slug);
}

export function add(slug, content) {
  const locs = getAll(localStorageKey);
  if (!isAdded(localStorageKey, slug)) {
    locs[slug] = {
      latlon: [content.latlon[1], content.latlon[0]],
      timeAdded: new Date(),
      title: content.title,
      cameraType: content.cameraType || "kodak",
      frameImage: content.frameImage,
      slug: content.slug,
      tags: content.tags,
      locationTitle: content.locationTitle,
      neighborhood: content.neighborhood,
    };

    if (typeof window !== "undefined")
      localStorage.setItem(localStorageKey, JSON.stringify(locs));
  }

  return locs;
}

export function getAllSlugs() {
  const saved = getAll(localStorageKey);
  return Object.keys(saved);
}

export function getAllContent() {
  const saved = getAll(localStorageKey);
  return saved;
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
  console.log(`in savePage(), slug: [${slug}]`);
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
  console.log(stampsSoFar);
  for (let i = 0; i < stampList.length; i++) {
    const currStamp = stampList[i];
    stampsSoFar[currStamp.slug] = stampList[i];
  }
  if (typeof window != "undefined")
    localStorage.setItem(stampKey, JSON.stringify(stampsSoFar));
}

// A randomly assigned number saved in localStorage to differentiate devices from each other
// This way if someone sends a URL to someone else, it'll know whether to load the full page or just their feed...maybe
function giveUserKey() {
  const userKey = Math.random() * 10000;
  if (typeof window != "undefined") localStorage.setItem(userIdKey, userKey);
  return userKey;
}

export function isThisMe(refKey) {
  if (typeof window != "undefined") {
    const storedUser = localStorage.getItem(userIdKey);
    if (!storedUser || storedUser != refKey) return false;
    return true;
  }
}

export function getUserKey() {
  if (typeof window != "undefined") {
    let storedUser = localStorage.getItem(userIdKey);
    if (!storedUser) {
      storedUser = giveUserKey();
    }
    return storedUser;
  }
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
