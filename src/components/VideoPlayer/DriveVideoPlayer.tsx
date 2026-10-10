interface DriveVideoPlayerProps {
  embedUrl: string;
  title: string;
}

/** Player do Drive dentro do modal, tanto no desktop quanto no mobile. */
export function DriveVideoPlayer({ embedUrl, title }: DriveVideoPlayerProps) {
  return (
    <iframe
      src={embedUrl}
      title={`Assistir ${title}`}
      className="absolute inset-0 block h-full w-full border-0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
