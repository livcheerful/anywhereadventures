export function updateRoute(newPath) {
  function removeFirstSlash(str) {
    return str.replace(/^\//, "");
  }
  window.history.pushState({}, "", newPath);
  return removeFirstSlash(newPath);
}
