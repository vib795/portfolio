import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, loadOgFonts } from "@/lib/og";
import { profile } from "@/lib/content";

// Applies to every route without its own card — homepage and /blog.
// /blog/<slug> overrides it with a per-post version.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${profile.name} — ${profile.role}`;

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={profile.role}
        title={profile.name}
        footer="singhcodes.dev"
        meta={profile.location}
      />
    ),
    { ...size, fonts: loadOgFonts() },
  );
}
