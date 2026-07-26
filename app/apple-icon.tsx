import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og";

// Without this, iOS uses a screenshot of the page for a home-screen bookmark.
// app/icon.svg covers desktop browsers, but Safari/iOS wants a raster icon.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = "Utkarsh Singh";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2efe7",
          fontFamily: "Space Grotesk",
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: -4,
          color: "#1b1613",
        }}
      >
        {">"}
        <span style={{ color: "#e8400c" }}>_</span>
      </div>
    ),
    { ...size, fonts: loadOgFonts() },
  );
}
