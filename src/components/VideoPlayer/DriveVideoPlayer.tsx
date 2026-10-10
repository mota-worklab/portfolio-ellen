import { useLayoutEffect, useRef } from "react";

interface DriveVideoPlayerProps {
  embedUrl: string;
  title: string;
  poster: string;
  format?: "horizontal" | "vertical";
}

/** Player incorporado do Drive, ajustado ao formato do projeto. */
export function DriveVideoPlayer({ embedUrl, title, format = "horizontal" }: DriveVideoPlayerProps) {
  const isVertical = format === "vertical";

  const frameRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || !isVertical) return;
    // Preserva um viewport interno suficiente para o Drive não cortar o vídeo.
    const resize = () => frame.style.setProperty("--drive-scale", String(frame.clientWidth / 360));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [isVertical]);

  return (
    <div className="project-stage">
      <div className="project-stage__viewport">
        <div
          ref={frameRef}
          className={`project-stage__frame${isVertical ? " drive-embed" : ""}`}
          data-format={format}
          data-provider="drive"
        >
          <iframe
            key={embedUrl}
            src={embedUrl}
            title={`Assistir ${title}`}
            className={`drive-player absolute inset-0 block border-0${isVertical ? "" : " h-full w-full"}`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}
