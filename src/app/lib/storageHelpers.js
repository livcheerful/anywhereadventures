/**
 * slugkey: {
 *     latlon: []
 * }
 */

const localStorageKey = "savedLocations";

export function isAdded(slug) {
  const locs = getAll();
  return Object.keys(locs).includes(slug);
}

export function remove(slug) {
  const locs = getAll();
  delete locs[slug];
  if (typeof window !== "undefined")
    localStorage.setItem(localStorageKey, JSON.stringify(locs));
}

export function add(slug, content) {
  const locs = getAll();
  if (!isAdded(slug)) {
    locs[slug] = { latlon: [content.latlon[1], content.latlon[0]] };

    if (typeof window !== "undefined")
      localStorage.setItem(localStorageKey, JSON.stringify(locs));
  }

  return locs;
}

export function getAllSlugs() {
  const saved = getAll();
  return Object.keys(saved);
}

export function getAll() {
  let saved;

  if (typeof window !== "undefined") {
    saved = localStorage.getItem(localStorageKey);
  } else {
    saved = "";
  }
  const parsed = saved ? JSON.parse(saved) : {};
  return parsed;
}
