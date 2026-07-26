import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { homeSchema, jsonLd } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homeSchema()) }}
      />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Experience />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
