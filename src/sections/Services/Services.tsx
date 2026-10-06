import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { services } from "../../data/services";
import { gsap, MQ } from "../../lib/gsap";
import { prefillContact } from "../../lib/events";
import { revealLines } from "../../animations/textReveal";
import { LazyVideo } from "../../components/VideoPlayer/LazyVideo";
import { scrollToTarget, useLenis } from "../../components/SmoothScroll/SmoothScroll";

export function Services() {
  const root = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredMedia = hovered !== null ? services[hovered].media : undefined;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      revealLines("[data-services-title]", { trigger: root.current! });
      gsap.from("[data-service]", {
        y: 40,
        opacity: 0,
        stagger: 0.07,
        duration: 1,
        scrollTrigger: { trigger: "[data-services-list]", start: "top 80%", once: true },
      });
    });

    // Preview flutuante que segue o ponteiro (somente desktop).
    mm.add(`${MQ.finePointer} and ${MQ.desktop}`, () => {
      const el = previewRef.current;
      if (!el) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    });

    return () => mm.revert();
  }, []);

  const choose = (title: string) => {
    prefillContact(title);
    scrollToTarget(lenis, "#contact");
  };

  return (
    <section ref={root} id="services" aria-labelledby="services-title" className="gutter py-24 sm:py-40">
      <div className="mb-12 flex items-end justify-between gap-6 sm:mb-16">
        <h2 id="services-title" data-services-title className="display text-[clamp(2.25rem,4.6vw,4.75rem)]">
          O que eu faço
        </h2>
        <p className="label pb-2">({String(services.length).padStart(2, "0")})</p>
      </div>

      <ul data-services-list className="border-t border-line" onPointerLeave={() => setHovered(null)}>
        {services.map((service, i) => (
          <li key={service.id} data-service className="border-b border-line">
            <button
              type="button"
              onClick={() => choose(service.title)}
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="group/service grid w-full grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 py-6 text-left sm:grid-cols-[4rem_1fr_auto] sm:py-8 lg:grid-cols-[6rem_1fr_minmax(0,22rem)_auto] lg:items-center"
              aria-label={`${service.title} — ${service.description} Falar sobre este serviço.`}
            >
              <span className="font-mono text-xs tabular-nums text-mute transition-colors group-hover/service:text-accent lg:text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="display block text-[clamp(1.5rem,3.2vw,3rem)] transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] group-hover/service:translate-x-3 group-focus-visible/service:translate-x-3 lg:text-white/85 lg:group-hover/service:text-white">
                {service.title}
              </span>
              <ArrowRight
                className="col-start-3 row-start-1 mt-2 size-5 transition-[transform,color] duration-500 group-hover/service:-rotate-45 group-hover/service:text-accent lg:col-start-4 lg:mt-0 lg:size-7"
                strokeWidth={1.25}
                aria-hidden="true"
              />
              <span
                className={`col-start-2 mt-3 max-w-md text-sm leading-relaxed text-mute transition-all duration-500 sm:text-base lg:col-start-3 lg:row-start-1 lg:mt-0 lg:translate-y-2 lg:opacity-0 ${
                  hovered === i ? "lg:translate-y-0 lg:opacity-100" : ""
                }`}
              >
                {service.description}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Preview flutuante — só aparece quando o serviço tem mídia configurada. */}
      <div ref={previewRef} className="pointer-events-none fixed left-0 top-0 z-30 hidden lg:block" aria-hidden="true">
        <div
          className={`relative aspect-[4/5] w-56 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-ink-3 transition-[opacity,transform] duration-500 ${
            hoveredMedia ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          {hoveredMedia && (
            <LazyVideo
              key={hovered}
              source={hoveredMedia.video}
              image={hoveredMedia.image}
              eager
              placeholder={{ label: "" }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
