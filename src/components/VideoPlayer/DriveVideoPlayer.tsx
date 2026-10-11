import { useLayoutEffect, useRef } from "react";

interface DriveVideoPlayerProps {
  embedUrl: string;
  title: string;
  poster: string;
  format?: "horizontal" | "vertical";
}

// Configurações independentes: ajustes no horizontal não alteram o vertical.
const DRIVE_VIEWPORT = {
  vertical: { width: 640, height: 640 * 16 / 9 },
  horizontal: { width: 960, height: 540 },
} as const;

/** Player incorporado do Drive, ajustado ao formato do projeto. */
export function DriveVideoPlayer({ embedUrl, title, format = "horizontal" }: DriveVideoPlayerProps) {
  const { width: playerWidth, height: playerHeight } = DRIVE_VIEWPORT[format];

  const frameRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    // O Drive precisa de espaço interno para o vídeo e seus controles.
    // Escala o iframe inteiro para caber no frame, mantendo a proporção.
    const resize = () => frame.style.setProperty("--drive-scale", String(frame.clientWidth / playerWidth));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [playerWidth, playerHeight]);

  return (
    <div className="project-stage">
      <div className="project-stage__viewport">
        <div
          ref={frameRef}
          className="project-stage__frame drive-embed"
          data-format={format}
          data-provider="drive"
        >
          <iframe
            key={embedUrl}
            src={embedUrl}
            title={`Assistir ${title}`}
            className="drive-player absolute inset-0 block border-0"
            style={{
              width: playerWidth,
              height: playerHeight,
              transform: "scale(var(--drive-scale, 1))",
              transformOrigin: "top left",
            }}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}
