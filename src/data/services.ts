export interface Service {
  id: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    id: "video-editing",
    title: "Edição de Vídeo",
    description: "Transformo material bruto em histórias com ritmo, emoção e intenção.",
  },
  {
    id: "short-form",
    title: "Vídeos Curtos",
    description: "Cortes verticais pensados para o primeiro segundo: gancho, ritmo e retenção.",
  },
  {
    id: "commercials",
    title: "Comerciais",
    description: "Filmes de marca e anúncios editados para dizer uma coisa com clareza, no tempo que você tem.",
  },
  {
    id: "color-grading",
    title: "Colorização",
    description: "Do LOG chapado a um look consistente que carrega o clima da peça.",
  },
  {
    id: "social-media",
    title: "Redes Sociais",
    description: "Edições recorrentes e sistemas de conteúdo adaptados a cada plataforma.",
  },
];
