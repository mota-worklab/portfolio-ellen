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
      className="gutter pointer-events-none fixed inset-x-0 bottom-3 z-40 sm:bottom-5"
    >
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center gap-3 rounded-xl border border-white/15 bg-ink/85 px-3 py-2.5 font-mono text-[10px] tracking-[0.05em] text-white/55 shadow-[0_12px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:gap-4 sm:px-4">
        <div className="flex shrink-0 items-center gap-2.5 border-r border-white/10 pr-3 sm:pr-4">
          <span className="grid size-7 place-items-center rounded-full bg-accent text-ink" aria-hidden="true">
            <svg width="9" height="10" viewBox="0 0 9 10" fill="currentColor">
              <path d="M8.2 4.15a1 1 0 0 1 0 1.7L1.55 9.92A1 1 0 0 1 0 9.07V.93A1 1 0 0 1 1.55.08L8.2 4.15Z" />
            </svg>
          </span>
          <div className="min-w-[5.5rem] leading-tight">
            <span className="mb-1 block text-[8px] uppercase text-white/35">Reproduzindo</span>
            <span className="block truncate text-white/90">{chapters[current]?.label}</span>
          </div>
        </div>

        <span ref={tcRef} className="hidden min-w-[5.5rem] tabular-nums text-white sm:inline" aria-hidden="true">
          00:00:00:00
        </span>

        <div className="relative h-9 min-w-0 flex-1">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
            <div ref={fillRef} className="h-full w-0 rounded-full bg-accent" />
          </div>
          {marks.map((m, i) => {
            const chapter = chapters[i];
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => scrollToTarget(lenis, `#${chapter.id}`)}
                className={`group absolute top-0 flex h-full -translate-x-1/2 items-start justify-center transition-colors hover:text-white ${current === i ? "text-white" : "text-white/35"}`}
                style={{ left: `${m * 100}%` }}
                aria-label={`Ir para ${chapter.label}`}
                aria-current={current === i ? "true" : undefined}
              >
                <span className={`mt-[14px] block rounded-full border border-ink transition-all group-hover:scale-125 ${current === i ? "size-2.5 bg-accent" : "size-2 bg-white/65"}`} />
                <span className="sr-only">{chapter.label}</span>
              </button>
            );
          })}
          <div ref={headRef} className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
            <div className="size-3 rounded-full border-[3px] border-ink bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.35)]" />
          </div>
        </div>

        <span className="hidden shrink-0 tabular-nums text-white/40 md:inline" aria-hidden="true">
          {toTimecode(pageDuration)}
        </span>
      </div>
    </nav>
  );
}
