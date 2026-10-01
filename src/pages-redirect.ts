const requestedPath = new URLSearchParams(window.location.search).get("__pages_path");
if (requestedPath && requestedPath.startsWith("/") && !requestedPath.startsWith("//")) {
  window.history.replaceState(null, "", import.meta.env.BASE_URL + requestedPath.slice(1));
}
export {};
