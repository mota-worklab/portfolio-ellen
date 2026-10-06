import type { VideoSource } from "../lib/media";
import { demoLandscape, demoVertical } from "./demoMedia";

export interface ProjectMedia {
  type: "image" | "video";
  src: string | VideoSource;
  alt?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  /** Define o enquadramento da galeria e do player. */
  format?: "horizontal" | "vertical";
  year: string;
  description: string;
  /** Imagem de capa (WebP/AVIF). Vazia = frame placeholder. */
  thumbnail: string;
  /** Preview curto e leve (sem áudio), reproduzido no hover. */
  preview?: VideoSource;
  /** Vídeo principal, exibido na página do projeto. */
  video?: VideoSource;
  role: string[];
  client?: string;
  additionalMedia?: ProjectMedia[];
}

/**
 * PLACEHOLDERS — estes itens existem apenas para estruturar o layout.
 * Substitua por projetos reais (título, descrição, mídia) antes de publicar.
 */
export const projects: Project[] = [
  {
    id: "project-01",
    title: "Filme de Moda",
    category: "Editorial · Exemplo",
    year: "2026",
    description: "Vídeo de exemplo para visualizar o portfólio. Trecho de Tears of Steel, da Blender Foundation; não representa um trabalho autoral.",
    thumbnail: demoLandscape.poster!,
    preview: demoLandscape,
    video: demoLandscape,
    role: ["Direção", "Edição"],
  },
  {
    id: "project-02",
    title: "Comercial",
    category: "Publicidade · Exemplo",
    year: "2026",
    description: "Vídeo de exemplo para visualizar o portfólio. Trecho de Tears of Steel, da Blender Foundation; não representa um trabalho autoral.",
    thumbnail: demoLandscape.poster!,
    preview: demoLandscape,
    video: demoLandscape,
    role: ["Edição", "Cor"],
  },
  {
    id: "project-03",
    title: "Videoclipe",
    category: "Música · Exemplo",
    year: "2025",
    description: "Vídeo de exemplo para visualizar o portfólio. Trecho de Tears of Steel, da Blender Foundation; não representa um trabalho autoral.",
    thumbnail: demoLandscape.poster!,
    preview: demoLandscape,
    video: demoLandscape,
    role: ["Edição", "Motion"],
  },
  {
    id: "project-04",
    format: "vertical",
    title: "Vídeo Curto",
    category: "Redes Sociais · Exemplo",
    year: "2025",
    description: "Vídeo de exemplo para visualizar o portfólio. Trecho de Tears of Steel, da Blender Foundation; não representa um trabalho autoral.",
    thumbnail: demoVertical.poster!,
    preview: demoVertical,
    video: demoVertical,
    role: ["Edição", "Som"],
  },
  {
    id: "project-05",
    title: "Reel · Exemplo",
    category: "Redes Sociais · Exemplo",
    format: "vertical",
    year: "2026",
    description: "Espaço demonstrativo para um vídeo vertical. Trecho de Tears of Steel, da Blender Foundation; substituir por um trabalho real.",
    thumbnail: demoVertical.poster!,
    preview: demoVertical,
    video: demoVertical,
    role: ["Edição"],
  },

  {
    id: "project-06",
    title: "Short · Exemplo",
    category: "Redes Sociais · Exemplo",
    format: "vertical",
    year: "2026",
    description: "Espaço demonstrativo para um vídeo vertical. Trecho de Tears of Steel, da Blender Foundation; substituir por um trabalho real.",
    thumbnail: demoVertical.poster!,
    preview: demoVertical,
    video: demoVertical,
    role: ["Edição"],
  },

  {
    id: "project-07",
    title: "Conteúdo Vertical · Exemplo",
    category: "Redes Sociais · Exemplo",
    format: "vertical",
    year: "2026",
    description: "Espaço demonstrativo para um vídeo vertical. Trecho de Tears of Steel, da Blender Foundation; substituir por um trabalho real.",
    thumbnail: demoVertical.poster!,
    preview: demoVertical,
    video: demoVertical,
    role: ["Edição"],
  },

];

/** Comparação antes/depois. Use o mesmo trecho, com mesmo enquadramento e duração. */
export const beforeAfter: { before: VideoSource; after: VideoSource; caption: string; demo: boolean } = {
  before: demoLandscape,
  after: demoLandscape,
  demo: true, // Desative ao substituir pelos arquivos reais de antes/depois.
  caption: "Exemplo ilustrativo · contraste e saturação simulados",
};
