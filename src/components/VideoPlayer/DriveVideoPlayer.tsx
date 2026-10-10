import { ExternalLink, RotateCw } from "lucide-react";
import { useState } from "react";

interface DriveVideoPlayerProps {
  embedUrl: string;
  title: string;
  format?: "horizontal" | "vertical";
}

/** O Drive controla o play no iframe; os recursos de recuperação ficam fora dele. */
export function DriveVideoPlayer({ embedUrl, title, format = "horizontal" }: DriveVideoPlayerProps) {
  const [attempt, setAttempt] = useState(0);
  const watchUrl = new URL(embedUrl);
  watchUrl.pathname = watchUrl.pathname.replace(/\/preview\/?$/, "/view");

  return (
    <div className="project-stage">
      <div className="project-stage__viewport">
        <div className="project-stage__frame" data-format={format}>
          <iframe
            key={`${embedUrl}:${attempt}`}
            src={embedUrl}
            title={`Assistir ${title}`}
            className="absolute inset-0 block h-full w-full border-0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>

      {/* O evento load não informa se o vídeo tocou: o conteúdo é de outra origem.
          Mantenha a recuperação acessível mesmo quando o player do Google trava. */}
      <div className="flex min-h-11 flex-wrap items-center justify-center gap-x-5 text-xs text-mute">
        <button
          type="button"
          onClick={() => setAttempt((value) => value + 1)}
          className="flex min-h-11 items-center gap-2 hover:text-white"
          aria-label={`Recarregar vídeo: ${title}`}
        >
          <RotateCw size={13} aria-hidden="true" /> Recarregar
        </button>
        <a
          href={watchUrl.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-2 hover:text-white"
          aria-label={`Assistir ${title} no Google Drive (nova aba)`}
        >
          Abrir no Drive <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
