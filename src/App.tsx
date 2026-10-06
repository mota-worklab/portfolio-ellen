import { useEffect } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { SmoothScroll } from "./components/SmoothScroll/SmoothScroll";
import { CustomCursor } from "./components/CustomCursor/CustomCursor";
import { Header } from "./components/Header/Header";
import { ScrollTimeline } from "./components/ScrollTimeline/ScrollTimeline";
import { Footer } from "./components/Footer/Footer";
import { Home } from "./pages/Home";

export default function App() {
  // Fontes e mídias alteram alturas após o primeiro layout; recalcula os triggers.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <SmoothScroll>
      <Header />
      <Home />
      <Footer />
      <ScrollTimeline />
      <CustomCursor />
      <div className="grain" aria-hidden="true" />
    </SmoothScroll>
  );
}
