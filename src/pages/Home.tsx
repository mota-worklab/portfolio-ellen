import { useRef } from "react";
import { Hero } from "../sections/Hero/Hero";
import { Showreel } from "../sections/Showreel/Showreel";
import { SelectedWork } from "../sections/SelectedWork/SelectedWork";
import { BeforeAfterSection } from "../sections/BeforeAfter/BeforeAfterSection";
import { Process } from "../sections/Process/Process";
import { Services } from "../sections/Services/Services";
import { Vertical } from "../sections/Vertical/Vertical";
import { About } from "../sections/About/About";
import { FinalCTA } from "../sections/FinalCTA/FinalCTA";
import { Contact } from "../sections/Contact/Contact";
import { ScrollStroke } from "../components/ui/svg-follow-scroll";

export function Home() {
  const journeyRef = useRef<HTMLDivElement>(null);

  return (
    <main id="main">
      <Hero />
      <About />
      <Showreel />
      <div ref={journeyRef} className="relative isolate overflow-x-clip">
        <ScrollStroke targetRef={journeyRef} stretch className="absolute inset-0 z-0 h-full w-full opacity-90" />
        <div className="relative z-10">
          <SelectedWork />
          <BeforeAfterSection />
          <Process />
        </div>
      </div>
      <Services />
      <Vertical />

      <FinalCTA />
      <Contact />
    </main>
  );
}
