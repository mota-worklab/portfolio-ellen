import type { VideoSource } from "../lib/media";
import { demoLandscape } from "./demoMedia";

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
  /** Player incorporado para vídeos hospedados no Google Drive. */
  embedUrl?: string;
  role: string[];
  client?: string;
  additionalMedia?: ProjectMedia[];
}

/** Projetos reais fornecidos pela Ellen. */
export const projects: Project[] = [
  {
    id: "vanguarda-visual-ep01",
    title: "O Código das Cores — EP 01",
    category: "Vanguarda Visual",
    year: "",
    description: "",
    thumbnail: "/media/vanguarda-visual-ep01.jpg",
    embedUrl: "https://drive.google.com/file/d/1elwxiSjNy_ZC1ARwTVouUHeBRUwlELIU/preview",
    role: [],
  },
  {
    id: "vanguarda-visual-ep02",
    title: "O Código das Cores — EP 02",
    category: "Vanguarda Visual",
    year: "",
    description: "",
    thumbnail: "/media/vanguarda-visual-ep02.jpg",
    embedUrl: "https://drive.google.com/file/d/1nQTJhidZLSb5VTigZmGyP-ZSudJcTo7c/preview",
    role: [],
  },
  {
    id: "vanguarda-visual-ep03",
    title: "O Código das Cores — EP 03",
    category: "Vanguarda Visual",
    year: "",
    description: "",
    thumbnail: "/media/vanguarda-visual-ep03.jpg",
    embedUrl: "https://drive.google.com/file/d/1uxkr-vc8m9GZ3SyDQwPuTk7_5aYqyxIv/preview",
    role: [],
  },
  {
    id: "vanguarda-visual-ep04",
    title: "O Código das Cores — EP 04",
    category: "Vanguarda Visual",
    year: "",
    description: "",
    thumbnail: "/media/vanguarda-visual-ep04.jpg",
    embedUrl: "https://drive.google.com/file/d/1VlIa8ngXAm0p6xrSjKP46ixwuq_A1xdD/preview",
    role: [],
  },
  {
    id: "isaac-acai-horizontal",
    title: "Isaac Açaí",
    category: "Vídeo horizontal",
    year: "",
    description: "",
    thumbnail: "/media/isaac-acai-horizontal.jpg",
    embedUrl: "https://drive.google.com/file/d/1ppdnhF-qfshsrNWGfCYNxrMk-Q1mCOdF/preview",
    role: [],
  },
  {
    id: "minex-hub-hackathon",
    title: "Minex Hub — Aftermovie Hackathon",
    category: "Aftermovie",
    year: "2026",
    description: "",
    thumbnail: "/media/minex-hub-hackathon.jpg",
    embedUrl: "https://drive.google.com/file/d/1XBJHSGh5GGYGd3-NZ-Sg2N38RsC_x2Ke/preview",
    role: [],
  },
  {
    id: "agromix-institucional-colaboradores",
    title: "Agromix — Institucional Colaboradores",
    category: "Institucional",
    year: "2025",
    description: "",
    thumbnail: "/media/agromix-institucional-colaboradores.jpg",
    embedUrl: "https://drive.google.com/file/d/1JrWMUcxhlwthSCUACrLE7mGmEWrtuC9R/preview",
    role: [],
  },
  {
    id: "laboratorio-spalazanni-institucional",
    title: "Laboratório Spalazanni — Institucional",
    category: "Institucional",
    year: "2025",
    description: "",
    thumbnail: "/media/laboratorio-spalazanni-institucional.jpg",
    embedUrl: "https://drive.google.com/file/d/1Nq5WIlKOODNcjS9fnG0wUz1VQTmDN0mm/preview",
    role: [],
  },
  {
    id: "umbu-solidario-minidoc-accabem",
    title: "Umbu Solidário — Minidoc ACCABEM",
    category: "Minidocumentário",
    year: "2025",
    description: "",
    thumbnail: "/media/umbu-solidario-minidoc-accabem.jpg",
    embedUrl: "https://drive.google.com/file/d/1zP5OmfbTCeckG6kec5135fNlcn6Go6Qh/preview",
    role: [],
  },
  {
    id: "santo-natal-vertical",
    title: "Santo Natal",
    category: "Reels",
    format: "vertical",
    year: "2025",
    description: "",
    thumbnail: "/media/santo-natal-vertical.jpg",
    embedUrl: "https://drive.google.com/file/d/1kr_4Wk8zsQkW9hRe4GlNn1SmYQFfnHJa/preview",
    role: [],
  },
  {
    id: "corrida-cidade-jardim-vertical",
    title: "Corrida Cidade Jardim",
    category: "Aftermovie",
    format: "vertical",
    year: "2026",
    description: "",
    thumbnail: "/media/corrida-cidade-jardim-vertical.jpg",
    embedUrl: "https://drive.google.com/file/d/1CQPjpENFuAPICO5YWaB5EW8q2H5hx2oQ/preview",
    role: [],
  },
  {
    id: "isaac-motoclube-fireblade-vertical",
    title: "Isaac — Motoclube Lançamento Fireblade",
    category: "Conteúdo vertical",
    format: "vertical",
    year: "2026",
    description: "",
    thumbnail: "/media/isaac-motoclube-fireblade-vertical.jpg",
    embedUrl: "https://drive.google.com/file/d/1zfoC8fCR84HKx_BKKySJcAydz4_Pu0Ra/preview",
    role: [],
  },
  {
    id: "victoria-bittencourt-apresentacao-vertical",
    title: "Victoria Bittencourt — Apresentação Profissional",
    category: "Reels",
    format: "vertical",
    year: "2026",
    description: "",
    thumbnail: "/media/victoria-bittencourt-apresentacao-vertical.jpg",
    embedUrl: "https://drive.google.com/file/d/18paWzGhZZaLO_KeNbFTGzz4toRJTqiuQ/preview",
    role: [],
  },
  {
    id: "vigilantes-sinais-alerta-vertical",
    title: "Vigilantes — Sinais de Alerta: Violência",
    category: "Conteúdo vertical",
    format: "vertical",
    year: "",
    description: "",
    thumbnail: "/media/vigilantes-sinais-alerta-vertical.jpg",
    embedUrl: "https://drive.google.com/file/d/1gNFgzS2g6pNorIt3nQYqP1cOT0uUqwfz/preview",
    role: [],
  },
  {
    id: "bocazul-depoimento-belle-vertical",
    title: "Bocazul — Depoimento Belle",
    category: "Reels",
    format: "vertical",
    year: "2026",
    description: "",
    thumbnail: "/media/bocazul-depoimento-belle-vertical.jpg",
    embedUrl: "https://drive.google.com/file/d/1wvttwI8ijBpnfDrbpgBQGw4JoK4TGULC/preview",
    role: [],
  },
];

/** Comparação antes/depois. Use o mesmo trecho, com mesmo enquadramento e duração. */
export const beforeAfter: { before: VideoSource; after: VideoSource; caption: string; demo: boolean } = {
  before: demoLandscape,
  after: demoLandscape,
  demo: true, // Desative ao substituir pelos arquivos reais de antes/depois.
  caption: "Cor e contraste",
};
