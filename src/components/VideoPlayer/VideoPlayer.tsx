import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { hasVideo, type VideoSource } from "../../lib/media";
import { toClock } from "../../lib/timecode";
import { FramePlaceholder } from "./FramePlaceholder";

interface VideoPlayerProps {
  source?: VideoSource;
  title: string;
  format?: "horizontal" | "vertical";
  autoPlay?: boolean;
  className?: string;
  placeholderHint?: string;
}

/** Player com controles minimalistas e acessíveis (teclado: espaço/K, ←/→, M, F). */
export function VideoPlayer({ source, title, format = "horizontal", autoPlay = false, className = "", placeholderHint }: VideoPlayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<number | undefined>(undefined);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, []);

  const seekBy = (delta: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration || 0);
  };

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => {});
  };

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const v = videoRef.current;
    v?.play().catch(() => {
      // Navegador bloqueou autoplay com som: tenta mudo.
      if (!v) return;
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  }, [autoPlay]);

  const wake = () => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2200);
  };
  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  const onKey = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.getAttribute("role") === "slider" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) return;
    const k = e.key.toLowerCase();
    if (k === " " || k === "k") {
      if (target.tagName === "BUTTON" && k === " ") return;
      e.preventDefault();
      toggle();
    } else if (k === "arrowright") seekBy(5);
    else if (k === "arrowleft") seekBy(-5);
    else if (k === "m") setMuted((m) => !m);
    else if (k === "f") toggleFullscreen();
    wake();
  };

  const scrub = (e: PointerEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1) * duration;
  };

  const portrait = format === "vertical";

  if (!hasVideo(source)) {
    return (
      <div className={`relative w-full bg-ink-3 ${portrait ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video"} ${className}`}>
        <FramePlaceholder label={title} hint={placeholderHint} />
      </div>
    );
  }

  const progress = duration ? (time / duration) * 100 : 0;
  const hideUi = playing && idle;

  return (
    <div
      ref={wrapRef}
      className={`group relative w-full overflow-hidden bg-black ${fullscreen ? "h-full" : portrait ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video"} ${hideUi ? "cursor-none" : ""} ${className}`}
      onPointerMove={wake}
      onKeyDown={onKey}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        poster={source?.poster}
        playsInline
        preload="metadata"
        muted={muted}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        aria-label={title}
        data-cursor={playing ? "pause" : "play"}
      >
        {source?.webm && <source src={source.webm} type="video/webm" />}
        {source?.mp4 && <source src={source.mp4} type="video/mp4" />}
      </video>

      <div
        className={`absolute inset-x-0 bottom-0 flex items-center ${portrait ? "gap-2 px-2" : "gap-4 px-4 sm:px-6"} bg-gradient-to-t from-black/80 to-transparent pb-4 pt-12 transition-opacity duration-500 ${hideUi ? "opacity-0" : "opacity-100"}`}
      >
        <button
          type="button"
          onClick={toggle}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:border-accent hover:text-accent"
          aria-label={playing ? "Pausar" : "Reproduzir"}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <span className="font-mono text-[11px] tabular-nums text-white/70">{toClock(time)}</span>

        <div
          role="slider"
          tabIndex={0}
          aria-label="Posição do vídeo"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${toClock(time)} de ${toClock(duration)}`}
          className="group/bar relative flex h-11 flex-1 cursor-pointer items-center"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            scrub(e);
          }}
          onPointerMove={(e) => e.buttons === 1 && scrub(e)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") seekBy(5);
            if (e.key === "ArrowLeft") seekBy(-5);
          }}
        >
          <div className="h-px w-full bg-white/20 transition-[height] group-hover/bar:h-[3px]">
            <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <div className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${progress}%` }} />
        </div>

        <span className={`${portrait ? "hidden" : ""} font-mono text-[11px] tabular-nums text-white/40`}>{toClock(duration)}</span>

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="grid size-11 shrink-0 place-items-center hover:text-accent"
          aria-label={muted ? "Ativar som" : "Silenciar"}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="hidden size-11 shrink-0 place-items-center hover:text-accent sm:grid"
          aria-label={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
        >
          {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </div>
    </div>
  );
}
