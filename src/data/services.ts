import type { VideoSource } from "../lib/media";
import { demoLandscape, demoVertical } from "./demoMedia";

export interface Service {
  id: string;
  title: string;
  description: string;
  /** Mídia revelada no hover (opcional). */
  media?: { image?: string; video?: VideoSource };
}

export const services: Service[] = [
  {
    id: "video-editing",
    title: "Edição de Vídeo",
    description: "Transformo material bruto em histórias com ritmo, emoção e intenção.",
    media: { video: demoLandscape },
  },
  {
    id: "short-form",
    title: "Vídeos Curtos",
    description: "Cortes verticais pensados para o primeiro segundo — gancho, ritmo e retenção.",
    media: { video: demoVertical },
  },
  {
    id: "commercials",
    title: "Comerciais",
    description: "Filmes de marca e anúncios editados para dizer uma coisa com clareza, no tempo que você tem.",
    media: { video: demoLandscape },
  },
  {
    id: "motion-design",
    title: "Motion Design",
    description: "Tipografia, grafismos e transições que se movem com o corte, não por cima dele.",
    media: { video: demoLandscape },
  },
  {
    id: "color-grading",
    title: "Colorização",
    description: "Do LOG chapado a um look consistente que carrega o clima da peça.",
    media: { video: demoLandscape },
  },
  {
    id: "social-media",
    title: "Redes Sociais",
    description: "Edições recorrentes e sistemas de conteúdo adaptados a cada plataforma.",
    media: { video: demoVertical },
  },
];
