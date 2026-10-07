import type { VideoSource } from "../lib/media";
import { demoLandscape } from "../data/demoMedia";

/**
 * Configuração central do site.
 * Tudo marcado com TODO precisa ser preenchido com conteúdo real antes da
 * publicação — nada aqui deve ser inventado.
 */
export const site = {
  name: "Ellen",
  role: "Editora de vídeo",
  year: new Date().getFullYear(),

  hero: {
    eyebrow: "Editora de vídeo",
    title: ["Ellen", "Dumont"],
    /**
     * TESTE — trecho de "Tears of Steel" (© Blender Foundation, CC-BY 3.0, mango.blender.org).
     * Substitua pelo seu vídeo (curto, sem áudio, 8–15s em loop, ~2–4 MB).
     */
    video: {
      webm: "/media/hero-test.webm",
      mp4: "/media/hero-test.mp4",
      poster: "/media/hero-test.jpg",
    } as VideoSource,
  },

  /** Seção "Formato vertical" — mão 3D segurando um celular que toca um vídeo 9:16. */
  vertical: {
    /** TESTE — recorte vertical de "Tears of Steel" (© Blender Foundation, CC-BY 3.0). */
    video: {
      webm: "/media/vertical-test.webm",
      mp4: "/media/vertical-test.mp4",
      poster: "/media/vertical-test.jpg",
    } as VideoSource,
    /**
     * Opcional: modelo .glb de mão + celular. Sem ele, a cena usa a mão "esculpida" em código.
     * `screenMesh` é o nome da malha da tela do celular no modelo (onde o vídeo é aplicado).
     */
    model: undefined as { src: string; screenMesh: string } | undefined,
  },

  showreel: {
    // Exemplo temporário; substituir pelo showreel completo.
    video: demoLandscape,
    /** Trecho curto e leve, sem áudio, que toca em loop no frame da seção. */
    preview: demoLandscape,
    demo: true,
    /** Ex.: "01:24". Vazio = não exibe. */
    duration: "",
  },

  about: {
    statement: [
      ["Eu não", "só edito", "vídeos."],
      ["Eu crio", "experiências."],
    ],
    /** Retrato principal (recorte com fundo transparente). */
    portrait: {
      src: "/media/perfil-2.webp",
      alt: "Ellen sorrindo, com fones de ouvido no pescoço e uma câmera nas mãos",
      width: 1000,
      height: 1270,
    },
    /** Foto de bastidores, trabalhando. */
    workImage: {
      src: "/media/perfil-1.webp",
      alt: "Ellen editando no notebook, com fones de ouvido",
      width: 1000,
      height: 1258,
    },
    /** Vídeo curto opcional (bastidores). Vazio = não exibe. */
    video: {} as VideoSource,

    /** Texto sobre você. Cada item do array vira um parágrafo. */
    bio: [
      "Sou Ellen Dumont, editora de vídeo, publicitária e filmmaker nas horas vagas. Há pouco mais de 3 anos no audiovisual, edito vídeos institucionais, depoimentos, aftermovies de eventos e conteúdos para YouTube sempre para prender a atenção e cumprir seu propósito.",
      "Também atuo na captação, o que me dá uma visão clara do que o material precisa para funcionar, mas meu foco é a pós-produção. O color grading é estudo constante: acredito que a cor constrói a atmosfera e a identidade de um projeto.",
      "Formada em Publicidade e Propaganda, uno estratégia de comunicação e narrativa visual. Busca uma edição com identidade, ritmo e narrativa sólida? Vamos conversar.",
    ],

    // Ficha informativa. Campos vazios não aparecem no site publicado.
    location: "", // ex.: "São Paulo, Brasil"
    availability: "", // ex.: "Disponível para projetos freelance"
    languages: [] as string[], // ex.: ["Português", "Inglês"]
    tools: [] as string[], // ex.: ["Premiere Pro", "DaVinci Resolve", "After Effects"]
    specialties: [] as string[],
    experience: [] as { period: string; title: string; place?: string }[],
  },

  /**
   * Métricas — PLACEHOLDERS (valores de exemplo). Substitua pelos números reais
   * ou deixe o array vazio para ocultar a seção.
   */
  metrics: [
    { value: 3, suffix: "+", label: "Anos editando" },
    { value: 120, suffix: "+", label: "Projetos" },
    { value: 35, suffix: "", label: "Clientes" },
    { value: 8, suffix: "", label: "Países" },
  ],

  contact: {
    // TODO: e-mail de contato. Usado como fallback (mailto) quando não há endpoint.
    email: "",
    /** Opcional: endpoint que aceita POST JSON (Formspree, Getform, função serverless...). */
    formEndpoint: "",
  },
};

/**
 * Capítulos da timeline global. `id` precisa bater com o id da seção.
 * O tempo de cada capítulo é calculado a partir da posição real da seção na página.
 */
export const chapters = [
  { id: "intro", label: "Início" },
  { id: "about", label: "Sobre" },
  { id: "work", label: "Trabalhos" },
  { id: "process", label: "Processo" },
  { id: "contact", label: "Contato" },
] as const;

/** Duração simbólica da página (segundos) — usada no timecode da timeline global. */
export const pageDuration = 84;
