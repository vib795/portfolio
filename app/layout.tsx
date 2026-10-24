import type { Metadata, Viewport } from "next";
import { Mona_Sans, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { profile } from "@/lib/content";
import GridRails from "@/components/GridRails";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import SocialRail from "@/components/SocialRail";
import CursorTrail from "@/components/CursorTrail";
import "./globals.css";

// Mona Sans carries copy and headings; its width axis lets the slash
// titles run slightly condensed. Roboto Mono is kept for the code-styled
// labels. Both CSS variables are read in globals.css.
const monaSans = Mona_Sans({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-mona-sans",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://singhcodes.dev"),
  title: `${profile.name} — ${profile.role}`,
  description: profile.intro,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.intro,
    url: "https://singhcodes.dev",
    type: "website",
  },
  // The generated card (app/opengraph-image.tsx) is 1200×630; without this X
  // renders it as a small square thumbnail instead of a full-width card.
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.intro,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Matches --paper in each theme so the mobile browser chrome blends
  // into the page instead of banding against it.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9edec" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${monaSans.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        {/* Light is the design's home key. An unset preference resolves
            to light; dark is honoured when the OS or the toggle asks. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();",
          }}
        />
        <GridRails />
        <SmoothScroll />
        <PageTransition />
        <SocialRail />
        <CursorTrail />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
