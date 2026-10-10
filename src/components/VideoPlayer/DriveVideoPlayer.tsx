interface DriveVideoPlayerProps {
  embedUrl: string;
  title: string;
}

/** Player incorporado do Drive ou YouTube dentro do modal. */
export function DriveVideoPlayer({ embedUrl, title }: DriveVideoPlayerProps) {
  return (
    <iframe
      src={embedUrl}
      title={`Assistir ${title}`}
      className="absolute inset-0 block h-full w-full border-0"
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
