/**
 * Service worker kill switch, development only.
 *
 * This site has never registered a service worker. But localhost:3000 is
 * shared with every other project run on that port, and a worker left
 * behind by one of them stays registered for the origin and keeps
 * answering requests from its cache. Turbopack's dev chunks keep the same
 * URL when their contents change, so a cache-first worker serves stale
 * JavaScript against fresh server HTML: hydration fails and the page
 * re-renders with old code, and no reload fixes it.
 *
 * The browser re-fetches a registered worker's script on navigation, so
 * answering /sw.js with this script replaces the old worker with one that
 * clears every cache, unregisters itself and reloads the open tabs.
 * Production keeps returning 404: no visitor of the real site has a
 * worker to remove.
 */
const KILL_SWITCH = `
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const tabs = await self.clients.matchAll({ type: "window" });
      tabs.forEach((tab) => tab.navigate(tab.url));
    })(),
  );
});
`;

export function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }
  return new Response(KILL_SWITCH, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
