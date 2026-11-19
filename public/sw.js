/* Service worker — l'app doit rester consultable en cavité, sans réseau.
   Stratégie : coquille en cache d'abord, réseau avec repli sur le cache. */

const CACHE = "suspendus-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./images/logo.png",
  "./images/hero-sorties.png",
  "./images/card-matos.png",
  "./images/card-topos.png",
  "./images/card-camp.png",
  "./images/card-carnet.png",
  "./images/card-school.png",
  "./images/card-agenda.png",
  "./images/card-site.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation : réseau d'abord (pour avoir la dernière version), cache en secours.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then((hit) => hit || Response.error()))
    );
    return;
  }

  // Ressources : cache d'abord, puis réseau (et on met en cache au passage).
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request)
          .then((res) => {
            if (res.ok && res.type === "basic") {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(request, copy));
            }
            return res;
          })
          .catch(() => hit || Response.error())
    )
  );
});
