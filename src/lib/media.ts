/**
 * Fonte de vídeo. WebM é preferido quando disponível; MP4 é o fallback.
 * Todos os campos são opcionais: sem fonte, o componente exibe um frame placeholder.
 */
export interface VideoSource {
  webm?: string;
  mp4?: string;
  poster?: string;
}

export const hasVideo = (src?: VideoSource) => Boolean(src && (src.webm || src.mp4));

/**
 * Helper para Cloudinary. Defina `VITE_CLOUDINARY_CLOUD` no `.env` e use o public id do vídeo:
 *
 *   video: cloudinaryVideo("portfolio/fashion-film")
 *
 * Gera WebM + MP4 com qualidade automática e um poster do primeiro frame.
 */
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD as string | undefined;

export function cloudinaryVideo(publicId: string, opts: { width?: number } = {}): VideoSource {
  if (!CLOUD) {
    if (import.meta.env.DEV) console.warn("[media] VITE_CLOUDINARY_CLOUD não definido.");
    return {};
  }
  const base = `https://res.cloudinary.com/${CLOUD}/video/upload`;
  const w = opts.width ? `,w_${opts.width}` : "";
  return {
    webm: `${base}/q_auto,vc_vp9${w}/${publicId}.webm`,
    mp4: `${base}/q_auto,vc_h264${w}/${publicId}.mp4`,
    poster: `${base}/so_0,q_auto,f_auto${w}/${publicId}.jpg`,
  };
}
