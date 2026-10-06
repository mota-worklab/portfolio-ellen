import { useEffect, useRef, useState } from "react";
import { chapters, pageDuration } from "../../config/site";
import { ScrollTrigger } from "../../lib/gsap";
import { toTimecode } from "../../lib/timecode";
import { scrollToTarget, useLenis } from "../SmoothScroll/SmoothScroll";

/**
 * Timeline global: a página inteira é tratada como um clip.
 * O playhead acompanha o scroll e os capítulos são marcadores clicáveis.
 */
export function ScrollTimeline() {
  const lenis = useLenis();
  const headRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const [marks, setMarks] = useState<number[]>(() => chapters.map((_, i) => i / chapters.length));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const measure = () => {
      const max = ScrollTrigger.maxScroll(window) || 1;
      setMarks(
        chapters.map(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return 0;
          return Math.min(el.getBoundingClientRect().top + window.scrollY, max) / max;
        }),
      );
    };

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: ({ progress }) => {
        const pct = `${progress * 100}%`;
        if (headRef.current) headRef.current.style.left = pct;
        if (fillRef.current) fillRef.current.style.width = pct;
        if (tcRef.current) tcRef.current.textContent = toTimecode(progress * pageDuration);
      },
      onRefresh: measure,
    });
    measure();
    return () => st.kill();
  }, []);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: ({ progress }) => {
        let idx = 0;
        marks.forEach((m, i) => {
          if (progress + 0.001 >= m) idx = i;
        });
        setCurrent((c) => (c === idx ? c : idx));
      },
    });
    return () => st.kill();
  }, [marks]);

  return (
    <nav
      aria-label="Linha do tempo da página"
      className="gutter pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-ink/90 to-transparent pb-3 pt-6 opacity-80 transition-opacity duration-300 hover:opacity-100 sm:pb-4"
    >
      <div className="pointer-events-auto flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 sm:gap-5">
        <span ref={tcRef} className="tabular-nums text-white" aria-hidden="true">
          00:00:00:00
        </span>

        <div className="relative h-8 flex-1">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
          <div ref={fillRef} className="absolute left-0 top-1/2 h-px w-0 bg-white/70" />
          {marks.map((m, i) => {
            const chapter = chapters[i];
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => scrollToTarget(lenis, `#${chapter.id}`)}
                className={`absolute top-0 flex h-full -translate-x-px items-start gap-1.5 pt-0 transition-colors hover:text-white ${current === i ? "text-white" : ""}`}
                style={{ left: `${m * 100}%` }}
                aria-label={`Ir para ${chapter.label}`}
                aria-current={current === i ? "true" : undefined}
              >
                <span className="mt-[11px] block h-2.5 w-px bg-current" />
                <span className="hidden leading-none md:block">{chapter.label}</span>
              </button>
            );
          })}
          <div ref={headRef} className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
            <div className="size-2 rounded-full bg-accent" />
          </div>
        </div>

        <span className="hidden tabular-nums sm:inline" aria-hidden="true">
          {toTimecode(pageDuration)}
        </span>
      </div>
    </nav>
  );
}
