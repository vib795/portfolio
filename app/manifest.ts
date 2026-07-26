import type { MetadataRoute } from "next";
import { profile } from "@/lib/content";

// Served at /manifest.webmanifest and linked automatically. Icons are the
// committed PNGs from `npm run icons` — a manifest referencing only an SVG
// gets ignored by some Android launchers.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.first,
    description: profile.intro,
    start_url: "/",
    display: "standalone",
    background_color: "#15120e",
    theme_color: "#15120e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        // Padded so Android's circular crop cannot clip the chevron.
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
