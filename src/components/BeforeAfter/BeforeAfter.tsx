import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { hasVideo, type VideoSource } from "../../lib/media";
import { LazyVideo } from "../VideoPlayer/LazyVideo";

interface BeforeAfterProps {
  before: VideoSource;
  after: VideoSource;
  demo?: boolean;
}

/**
 * Comparador antes/depois. O "depois" fica por cima, recortado pelo divisor.
 * Arraste com mouse/toque ou use as setas do teclado no divisor.
 */
export function BeforeAfter({ before, after, demo = false }: BeforeAfterProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback((x: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(Math.max(((x - rect.left) / rect.width) * 100, 0), 100));
  }, []);

  // Mantém os dois vídeos no mesmo frame.
  useEffect(() => {
    if (!hasVideo(before) || !hasVideo(after)) return;
    const id = window.setInterval(() => {
      const a = afterRef.current;
      const b = beforeRef.current;
      if (a && b && !a.paused && Math.abs(a.currentTime - b.currentTime) > 0.08) b.currentTime = a.currentTime;
    }, 500);
    return () => window.clearInterval(id);
  }, [before, after]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX);
  };

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(p - step, 0));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(p + step, 100));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={frameRef}
      data-cursor="drag"
      className="relative aspect-[4/5] w-full touch-pan-y select-none overflow-hidden bg-ink-3 sm:aspect-video"
      onPointerDown={onPointerDown}
      onPointerMove={(e) => dragging && setFromClientX(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <LazyVideo className={demo ? "saturate-[0.35] contrast-[0.7] brightness-110" : ""} source={before} videoRef={beforeRef} placeholder={{ label: "Bruto — LOG", tone: "flat", hint: "src/data/projects.ts → beforeAfter" }} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <LazyVideo source={after} videoRef={afterRef} placeholder={{ label: "Final — com cor", tone: "graded" }} />
      </div>

      <span className="label pointer-events-none absolute left-4 top-4 bg-ink/60 px-2 py-1 !text-white backdrop-blur sm:left-6 sm:top-6">Antes</span>
      <span className="label pointer-events-none absolute right-4 top-4 bg-ink/60 px-2 py-1 !text-white backdrop-blur sm:right-6 sm:top-6">Depois</span>

      <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${pos}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Divisor antes e depois"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% antes, ${Math.round(100 - pos)}% depois`}
          onKeyDown={onKey}
          className={`pointer-events-auto absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-ink/40 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur transition-transform ${dragging ? "scale-90" : ""}`}
        >
          <span aria-hidden="true">◂ ▸</span>
        </div>
      </div>
    </div>
  );
}
