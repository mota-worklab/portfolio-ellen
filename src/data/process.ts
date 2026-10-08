export interface ProcessStep {
  id: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  { id: "edit", title: "Edição", description: "Ritmo primeiro. Cortar, ajustar, reconstruir — até cada frame merecer seu lugar." },
  { id: "color", title: "Cor", description: "Equilibrar, igualar e então construir o look." },
  { id: "sound", title: "Som", description: "Trilha, sound design e mixagem. Metade do que você vê é o que você ouve." },
  { id: "final-cut", title: "Corte Final", description: "Entregas para cada plataforma, revisadas frame a frame." },
];
