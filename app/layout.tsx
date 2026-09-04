import type { Metadata, Viewport } from "next";
import { Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { profile } from "@/lib/content";
import GridRails from "@/components/GridRails";
import SmoothScroll from "@/components/SmoothScroll";
import PageWipe from "@/components/PageWipe";
import SocialRail from "@/components/SocialRail";
import "./globals.css";

// The reference sets 100% of its UI in Roboto Mono — body copy, nav,
// labels, stats, all of it. One family, two weights. The display
// wordmark is drawn as SVG (components/Wordmark.tsx) rather than set
// in a typeface, so there is no second font to load.
//
// Both CSS variables point at the same family: --font-space-grotesk
// and --font-jetbrains-mono are still the names globals.css reads, so
// keeping them avoids touching every `font-mono` utility in the tree.
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
    { media: "(prefers-color-scheme: light)", color: "#e4e4e4" },
    { media: "(prefers-color-scheme: dark)", color: "#131313" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={robotoMono.variable} suppressHydrationWarning>
      <body className="antialiased">
        {/* Light is the design's home key — the reference ships light
            only, and the flat #e4e4e4 ground is what the hairline grid
            was drawn against. So an unset preference resolves to light,
            and dark is honoured when the OS or the toggle asks for it. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();",
          }}
        />
        <GridRails />
        <SmoothScroll />
        <PageWipe />
        <SocialRail />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
