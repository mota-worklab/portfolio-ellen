import { useEffect, useRef, useState, type RefObject } from "react";
import type { VideoSource } from "../../lib/media";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import type { HandPhoneScene } from "./handPhoneScene";

interface HandPhoneProps {
  video: VideoSource;
  model?: { src: string; screenMesh: string };
  /** Recebe o progresso do scroll (0–1) da seção; a seção atualiza o `current`. */
  progressRef: RefObject<number>;
  className?: string;
}

const ACCENT = "#ff3d2e";

/**
 * Canvas 3D com a mão segurando o celular. A cena (three.js) só é baixada quando a
 * seção se aproxima da viewport, e o render/vídeo pausam fora dela.
 * Se WebGL não estiver disponível, cai para um celular simples em CSS com o mesmo vídeo.
 */
export function HandPhone({ video, model, progressRef, className = "" }: HandPhoneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<HandPhoneScene | null>(null);
  const [near, setNear] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  // 1. Detecta proximidade para baixar a cena.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 2. Cria a cena.
  useEffect(() => {
    if (!near || failed || !canvasRef.current || !videoRef.current) return;
    let disposed = false;
    let scene: HandPhoneScene | null = null;
    import("./handPhoneScene")
      .then(({ createHandPhoneScene }) =>
        createHandPhoneScene(canvasRef.current!, {
          video: videoRef.current!,
          accent: ACCENT,
          model,
          lowPower: window.innerWidth < 768,
        }),
      )
      .then((s) => {
        if (disposed) return s.dispose();
        scene = s;
        sceneRef.current = s;
        s.setProgress(progressRef.current ?? 0);
        setReady(true);
      })
      .catch((err) => {
        console.warn("[HandPhone] WebGL indisponível, usando fallback.", err);
        setFailed(true);
      });
    return () => {
      disposed = true;
      scene?.dispose();
      sceneRef.current = null;
      setReady(false);
    };
  }, [near, failed, model, progressRef]);

  // 3. Liga/desliga render e vídeo conforme a visibilidade.
  useEffect(() => {
    const el = wrapRef.current;
    const v = videoRef.current;
    if (!el || !v || !ready) return;
    const scene = sceneRef.current!;
    scene.setAnimated(!reduced);
    let syncRaf = 0;
    const sync = () => {
      scene.setProgress(progressRef.current ?? 0);
      syncRaf = requestAnimationFrame(sync);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        scene.start();
        sync();
        if (!reduced) v.play().catch(() => {});
      } else {
        scene.stop();
        cancelAnimationFrame(syncRaf);
        v.pause();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(syncRaf);
      scene.stop();
    };
  }, [ready, reduced, progressRef]);

  // 4. Parallax pelo ponteiro (desktop).
  useEffect(() => {
    if (!finePointer || reduced || !ready) return;
    const onMove = (e: PointerEvent) => {
      sceneRef.current?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [finePointer, reduced, ready]);

  const sources = (
    <>
      {near && video.webm && <source src={video.webm} type="video/webm" />}
      {near && video.mp4 && <source src={video.mp4} type="video/mp4" />}
    </>
  );

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* Fonte do vídeo para a textura (fica fora da tela no modo 3D). */}
      <video
        ref={videoRef}
        key={near ? "on" : "off"}
        muted
        loop
        playsInline
        crossOrigin="anonymous"
        preload={near ? "auto" : "none"}
        poster={video.poster}
        aria-hidden="true"
        className={failed ? "hidden" : "pointer-events-none absolute size-px opacity-0"}
      >
        {sources}
      </video>

      {failed ? (
        <div className="grid h-full place-items-center">
          <div className="relative aspect-[9/19] h-[80%] overflow-hidden rounded-[2.5rem] border-[6px] border-[#141414] bg-black shadow-2xl">
            <video muted loop playsInline autoPlay={!reduced} poster={video.poster} className="h-full w-full object-cover" aria-hidden="true">
              {video.webm && <source src={video.webm} type="video/webm" />}
              {video.mp4 && <source src={video.mp4} type="video/mp4" />}
            </video>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className={`h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
          role="img"
          aria-label="Mão segurando um celular que reproduz um vídeo vertical"
        />
      )}
    </div>
  );
}
