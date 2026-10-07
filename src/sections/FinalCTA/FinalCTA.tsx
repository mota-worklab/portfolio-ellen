import { ArrowRight } from "lucide-react";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, MQ } from "../../lib/gsap";
import { splitMaskedLines } from "../../animations/textReveal";
import { scrollToTarget, useLenis } from "../../components/SmoothScroll/SmoothScroll";

const PlasmaWave = lazy(() => import("../../components/PlasmaWave/PlasmaWave").then(({ PlasmaWave }) => ({ default: PlasmaWave })));

/**
 * O último frame do filme. A frase entra, segura, e as barras de letterbox
 * fecham a imagem até o preto — corte para o contato.
 */
export function FinalCTA() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [near, setNear] = useState(false);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: "400px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      // A frase entra antes do pin, para o frame nunca ficar vazio.
      const split = splitMaskedLines("[data-cta-title]");
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 55%", once: true } })
        .from(split.lines, { yPercent: 105, stagger: 0.1, duration: 1.2 })
        .from("[data-cta-link], [data-cta-meta]", { opacity: 0, y: 20, stagger: 0.08 }, "-=0.7");

      // Fixado, o frame segura e as barras de letterbox fecham até o preto.
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=90%", scrub: true, pin: true, anticipatePin: 1 },
          defaults: { ease: "power2.in" },
        })
        .to({}, { duration: 0.35 })
        .to("[data-bar='top']", { scaleY: 1, duration: 0.65 })
        .to("[data-bar='bottom']", { scaleY: 1, duration: 0.65 }, "<");
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="cta-title" className="gutter relative flex h-svh min-h-[560px] flex-col justify-center overflow-hidden">
      {near && <div className="pointer-events-none absolute inset-0 opacity-65" aria-hidden="true"><Suspense fallback={null}><PlasmaWave /></Suspense></div>}
      <div data-bar="top" className="absolute inset-x-0 top-0 z-10 h-1/2 origin-top scale-y-0 bg-black" aria-hidden="true" />
      <div data-bar="bottom" className="absolute inset-x-0 bottom-0 z-10 h-1/2 origin-bottom scale-y-0 bg-black" aria-hidden="true" />

   

      <h2 id="cta-title" data-cta-title className="display relative text-[clamp(2.75rem,8vw,9rem)]">
        Vamos criar
        <br />
        algo
        <br />
        juntos?
      </h2>

      <a
        data-cta-link
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          scrollToTarget(lenis, "#contact");
        }}
        className="group relative mt-10 inline-flex w-fit items-center gap-4 font-display text-[clamp(1.125rem,1.8vw,1.5rem)] font-extrabold tracking-[-0.02em]"
      >
        <span className="border-b-2 border-accent pb-1">Vamos conversar</span>
        <ArrowRight className="size-[1.2em] transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.5} aria-hidden="true" />
      </a>
    </section>
  );
}
