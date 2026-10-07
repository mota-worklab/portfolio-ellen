import { ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type CursorMode = "default" | "link" | "view" | "play" | "pause" | "drag" | "hidden";

const INTERACTIVE = "a, button, [role='button'], [role='slider'], label, select, summary";

/**
 * Cursor personalizado (somente desktop com ponteiro fino).
 * Estados definidos via `data-cursor` no elemento: view | play | pause | drag | hidden.
 * Links e botões assumem "link" automaticamente.
 */
export function CustomCursor() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    document.documentElement.classList.add("has-custom-cursor");

    const duration = reduced ? 0 : 0.35;
    const xTo = gsap.quickTo(ref.current, "x", { duration, ease: "power3.out" });
    const yTo = gsap.quickTo(ref.current, "y", { duration, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      xTo(e.clientX);
      yTo(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const tagged = target?.closest<HTMLElement>("[data-cursor]");
      if (tagged) return setMode(tagged.dataset.cursor as CursorMode);
      if (target?.closest("input, textarea")) return setMode("hidden");
      setMode(target?.closest(INTERACTIVE) ? "link" : "default");
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, reduced]);

  if (!enabled) return null;

  const labelled = mode === "view" || mode === "play" || mode === "pause" || mode === "drag";
  const size = mode === "default" ? 10 : mode === "link" ? 44 : labelled ? 112 : 0;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ opacity: visible && mode !== "hidden" ? 1 : 0, transition: "opacity 200ms" }}
    >
      <div
        className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-[width,height,background-color,border-color] duration-300 ease-[var(--ease-out-expo)] ${
          labelled
            ? "bg-accent text-ink"
            : mode === "link"
              ? "border border-white/60 bg-transparent text-white backdrop-blur-[2px]"
              : "bg-white mix-blend-difference"
        }`}
        style={{ width: size, height: size }}
      >
        {mode === "link" && <ArrowRight size={16} strokeWidth={1.5} />}
        {labelled && (
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.05em]">
            {mode === "view" && "Ver"}
            {mode === "play" && (
              <>
                Assistir <Play size={11} fill="currentColor" />
              </>
            )}
            {mode === "pause" && (
              <>
                Pausar <Pause size={11} fill="currentColor" />
              </>
            )}
            {mode === "drag" && "← Arraste →"}
          </span>
        )}
      </div>
    </div>
  );
}
