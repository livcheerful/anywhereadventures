/**
 * slugkey: {
 *     latlon: []
 * }
 */

export const localStorageKey = "savedLocations";

const itemsStorageKey = "savedItems";

const userIdKey = "userId";
const stampKey = "stamps";

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

export function add(slug, content) {
  const locs = getAll(localStorageKey);
  if (!isAdded(localStorageKey, slug)) {
    locs[slug] = {
      latlon: [content.latlon[1], content.latlon[0]],
      timeAdded: new Date(),
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
  if (typeof window !== "undefined");
  localStorage.setItem(itemsStorageKey, JSON.stringify(locs));

  return locs;
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

export function saveStamp(stampList) {
  const stampsSoFar = getAll(stampKey);
  console.log(stampsSoFar);
  for (let i = 0; i < stampList.length; i++) {
    const currStamp = stampList[i];
    stampsSoFar[currStamp.slug] = stampList[i];
  }
  localStorage.setItem(stampKey, JSON.stringify(stampsSoFar));
}

// A randomly assigned number saved in localStorage to differentiate devices from each other
// This way if someone sends a URL to someone else, it'll know whether to load the full page or just their feed...maybe
function giveUserKey() {
  const userKey = Math.random() * 10000;
  localStorage.setItem(userIdKey, userKey);
  return userKey;
}

export function isThisMe(refKey) {
  const storedUser = localStorage.getItem(userIdKey);
  if (!storedUser || storedUser != refKey) return false;
  return true;
}

export function getUserKey() {
  let storedUser = localStorage.getItem(userIdKey);
  if (!storedUser) {
    storedUser = giveUserKey();
  }
  return storedUser;
}
