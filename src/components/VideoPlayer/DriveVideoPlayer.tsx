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
    const resize = () => {
      if (format === "vertical") {
        // Mantém o enquadramento vertical já aprovado.
        frame.style.setProperty("--drive-scale", String(frame.clientWidth / playerWidth));
        return;
      }

      // Horizontal: viewport amplo no Drive, reduzido para caber no celular.
      // No desktop, acompanha a largura real sem ampliar os controles.
      const width = Math.max(playerWidth, frame.clientWidth);
      frame.style.setProperty("--horizontal-player-width", `${width}px`);
      frame.style.setProperty("--horizontal-player-height", `${width * 9 / 16}px`);
      frame.style.setProperty("--horizontal-player-scale", String(frame.clientWidth / width));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [format, playerWidth]);

  return (
    <div className="project-stage">
      <div className="project-stage__viewport">
        <div
          ref={frameRef}
          className="project-stage__frame drive-embed"
          data-format={format}
          data-provider="drive"
          style={format === "horizontal" ? { aspectRatio: "16 / 9", minHeight: 0 } : undefined}
        >
          <iframe
            key={embedUrl}
            src={embedUrl}
            title={`Assistir ${title}`}
            className="drive-player absolute inset-0 block border-0"
            style={{
              width: format === "vertical" ? playerWidth : "var(--horizontal-player-width, 960px)",
              height: format === "vertical" ? playerHeight : "var(--horizontal-player-height, 540px)",
              transform: format === "vertical"
                ? "scale(var(--drive-scale, 1))"
                : "scale(var(--horizontal-player-scale, 1))",
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
