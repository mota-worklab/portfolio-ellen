import { Hero } from "../sections/Hero/Hero";
import { Showreel } from "../sections/Showreel/Showreel";
import { SelectedWork } from "../sections/SelectedWork/SelectedWork";
import { BeforeAfterSection } from "../sections/BeforeAfter/BeforeAfterSection";
import { Process } from "../sections/Process/Process";
import { Services } from "../sections/Services/Services";
import { Vertical } from "../sections/Vertical/Vertical";
import { About } from "../sections/About/About";
import { Stats } from "../sections/Stats/Stats";
import { FinalCTA } from "../sections/FinalCTA/FinalCTA";
import { Contact } from "../sections/Contact/Contact";

export function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Showreel />
      <SelectedWork />
      <BeforeAfterSection />
      <Process />
      <Services />
      <Vertical />
      <Stats />
      <FinalCTA />
      <Contact />
    </main>
  );
}
