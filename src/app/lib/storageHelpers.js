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
const journalViewedKey = "journalViewed";
const cameraViewedKey = "cameraViewed";
const settingsKey = "userSettings";
const notificationsKey = "notifications";
const photoReelKey = "photoReel";

export function clearAll() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(localStorageKey);
    localStorage.removeItem(itemsStorageKey);
    localStorage.removeItem(scrapbookPageKey);
    localStorage.removeItem(userIdKey);
    localStorage.removeItem(stampKey);
    localStorage.removeItem(homeLocationKey);
    localStorage.removeItem(journalViewedKey);
    localStorage.removeItem(cameraViewedKey);
    localStorage.removeItem(settingsKey);
    localStorage.removeItem(photoReelKey);
    localStorage.removeItem(notificationsKey);
  }
}

export function addPhotoToReel(locationId, photoObj) {
  let photoData = JSON.parse(localStorage.getItem(photoReelKey));

  if (!photoData || photoData.locationId != locationId) {
    photoData = {
      locationId: locationId,
      photos: [],
    };
  }
  console.log(photoObj);
  photoData.photos.push(photoObj);

  localStorage.setItem(photoReelKey, JSON.stringify(photoData));
}

export function getPhotoReel(locationId) {
  let photoData = JSON.parse(localStorage.getItem(photoReelKey));
  console.log(photoData);
  if (!photoData || photoData.locationId != locationId) {
    return [];
  } else {
    return photoData.photos;
  }
}

export function clearPhotoReel() {
  localStorage.removeItem(photoReelKey);
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

export function updateSettings(key, value) {
  let settings = JSON.parse(localStorage.getItem(settingsKey)) || {};
  settings[key] = value;
  localStorage.setItem(settingsKey, JSON.stringify(settings));
}

export function getSettings() {
  const mediaQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  return (
    JSON.parse(localStorage.getItem(settingsKey)) || { reduceAnims: mediaQuery }
  );
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

export function addNewNotification(type, id, details) {
  const notifsSoFar = JSON.parse(localStorage.getItem(notificationsKey));
  let newNotifs = { ...notifsSoFar };
  newNotifs[id] = { type: type, id: id, ...details };
  localStorage.setItem(notificationsKey, JSON.stringify(newNotifs));
}

export function getNotifications() {
  const notifsSoFar = JSON.parse(localStorage.getItem(notificationsKey));
  return notifsSoFar;
}

export function getNumNotifications() {
  const notifsSoFar = JSON.parse(localStorage.getItem(notificationsKey));
  if (!notifsSoFar) return 0;
  const k = Object.keys(notifsSoFar);
  return k.length;
}

export function removeNotification(id) {
  const notifsSoFar = JSON.parse(localStorage.getItem(notificationsKey));
  let newNotifs = { ...notifsSoFar };
  delete newNotifs[id];

  localStorage.setItem(notificationsKey, JSON.stringify(newNotifs));
}

export function clearNotifications() {
  localStorage.removeItem(notificationsKey);
}

export function setHaveSeenCamera(viewed) {
  localStorage.setItem(cameraViewedKey, viewed);
}

export function haveSeenCamera() {
  return localStorage.getItem(cameraViewedKey);
}

export function setHaveSeenJournal(viewed) {
  localStorage.setItem(journalViewedKey, viewed);
}

export function haveSeenJournal() {
  return localStorage.getItem(journalViewedKey);
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

export function saveLCItem(lcItem, image, caption, type, slug) {
  const locs = getAll(itemsStorageKey);
  if (!isAdded(itemsStorageKey, lcItem)) {
    locs[lcItem] = {
      link: lcItem,
      image: image,
      caption: caption,
      fromSlug: slug,
      timeAdded: new Date(),
      type: type,
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
