import { useEffect, useRef, useState, type RefObject } from "react";
import { hasVideo, type VideoSource } from "../../lib/media";
import { FramePlaceholder } from "./FramePlaceholder";

interface LazyVideoProps {
  source?: VideoSource;
  /** Imagem usada quando não há poster no `source` (ou não há vídeo). */
  image?: string;
  alt?: string;
  /**
   * ambient: toca em loop enquanto visível.
   * hover:   carrega e toca só quando `active` (preview de projeto).
   * manual:  apenas carrega; o controle fica com quem usa `videoRef`.
   */
  mode?: "ambient" | "hover" | "manual";
  active?: boolean;
  /** Com prefers-reduced-motion, vídeos ambient não tocam sozinhos (exceto se `paused` for controlado). */
  paused?: boolean;
  placeholder: { label: string; hint?: string; tone?: "neutral" | "flat" | "graded" };
  videoRef?: RefObject<HTMLVideoElement | null>;
  className?: string;
  /** Carregar imediatamente (ex.: hero). */
  eager?: boolean;
}

/**
 * Vídeo silencioso com carregamento sob demanda: a fonte só é anexada quando o
 * elemento se aproxima da viewport e a reprodução pausa fora dela.
 */
export function LazyVideo({
  source,
  image,
  alt = "",
  mode = "ambient",
  active = false,
  paused = false,
  placeholder,
  videoRef,
  className = "",
  eager = false,
}: LazyVideoProps) {
  const innerRef = useRef<HTMLVideoElement | null>(null);
  const ref = videoRef ?? innerRef;
  const [near, setNear] = useState(eager);
  const [visible, setVisible] = useState(eager);
  const poster = source?.poster || image || undefined;
  const isVideo = hasVideo(source);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isVideo) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, isVideo]);

  // Hover só carrega na primeira ativação, para não baixar todos os previews.
  const shouldLoad = isVideo && near && (mode !== "hover" || active);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (shouldLoad) setLoaded(true);
  }, [shouldLoad]);

  // <source> é anexado depois da montagem; load() faz o elemento reavaliar as fontes.
  useEffect(() => {
    if (loaded) ref.current?.load();
  }, [ref, loaded]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !loaded) return;
    const wantsPlay = mode === "ambient" ? visible && !paused : mode === "hover" ? active && visible : false;
    if (wantsPlay) {
      el.play().catch(() => {
        /* autoplay bloqueado: mantém o poster */
      });
    } else if (mode !== "manual") {
      el.pause();
      if (mode === "hover") el.currentTime = 0;
    }
  }, [ref, loaded, visible, active, paused, mode]);

  if (!isVideo) {
    if (image) {
      return (
        <img
          src={image}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
        />
      );
    }
    return <FramePlaceholder {...placeholder} />;
  }

  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      poster={poster}
      muted
      loop={mode !== "manual"}
      playsInline
      preload={loaded ? "auto" : "none"}
      aria-hidden={alt ? undefined : true}
      aria-label={alt || undefined}
      disablePictureInPicture
    >
      {loaded && source?.webm && <source src={source.webm} type="video/webm" />}
      {loaded && source?.mp4 && <source src={source.mp4} type="video/mp4" />}
    </video>
  );
}
