# AGENTS.md

## 1. Visão geral do projeto

Este projeto é um **portfólio profissional para um editor de vídeo**.

O objetivo não é criar apenas um site institucional tradicional, mas uma **experiência audiovisual interativa**, na qual o próprio site demonstre conceitos de edição, ritmo, transições, movimento, composição e narrativa visual.

### Conceito principal

> **O site deve se comportar como um vídeo editado.**

O usuário deve sentir que está navegando por uma experiência audiovisual, e não simplesmente percorrendo uma página com textos e cards.

A interface deve transmitir:

* criatividade;
* profissionalismo;
* domínio técnico;
* sofisticação;
* ritmo;
* cinematografia;
* edição;
* movimento;
* atenção aos detalhes.

Evitar aparência de template genérico.

---

# 2. Stack

Utilizar preferencialmente:

* React
* TypeScript
* Vite
* Tailwind CSS
* GSAP
* GSAP ScrollTrigger
* Lenis para smooth scrolling
* Framer Motion quando fizer sentido
* Lucide React para ícones
* Cloudinary para hospedagem/streaming de vídeos

### Regras

Não adicionar bibliotecas desnecessárias.

Priorizar:

1. performance;
2. animações fluidas;
3. acessibilidade;
4. responsividade;
5. código organizado;
6. experiência visual.

Não utilizar Three.js/WebGL apenas por efeito visual.

Three.js só deve ser utilizado se houver uma necessidade real de uma experiência 3D.

---

# 3. Direção visual

## Estética

A estética deve ser:

**cinematográfica + editorial + minimalista + premium + moderna.**

Referências conceituais:

* estúdios de cinema;
* softwares de edição;
* revistas editoriais;
* portfolios de diretores;
* agências criativas premium;
* motion design.

Não utilizar estética excessivamente colorida ou cheia de elementos.

---

## Cores

Base:

```text
Background: #080808
Primary text: #FFFFFF
Secondary text: #A0A0A0
Borders: rgba(255,255,255,0.12)
```

Utilizar uma única cor de destaque definida pelo projeto.

A cor de destaque deve aparecer principalmente em:

* pequenos detalhes;
* hover;
* indicadores;
* progress bars;
* pequenos textos;
* elementos interativos.

Não utilizar gradientes excessivos.

---

# 4. Tipografia

Utilizar uma tipografia moderna e forte.

Preferência:

* uma fonte sans-serif moderna;
* títulos grandes;
* contraste forte entre títulos e textos auxiliares.

Títulos podem ser:

```text
font-size: clamp(...)
font-weight: 700–900
letter-spacing: -0.04em
```

Utilizar tipografia grande como elemento visual.

Exemplo:

```text
I DON'T
JUST EDIT
VIDEOS.

I BUILD
EXPERIENCES.
```

---

# 5. Princípio de interação

Toda animação deve possuir uma finalidade.

Não criar animações apenas para "encher" o site.

As animações devem reforçar:

* narrativa;
* hierarquia;
* ritmo;
* descoberta;
* transição;
* sensação cinematográfica.

Priorizar animações rápidas e precisas.

Evitar:

* bounce exagerado;
* efeitos infantis;
* excesso de parallax;
* animações lentas sem propósito;
* elementos pulando constantemente.

---

# 6. Cursor personalizado

Criar um cursor personalizado no desktop.

Estado padrão:

```text
●
```

Sobre links:

```text
→
```

Sobre projetos:

```text
VIEW
```

Sobre vídeos:

```text
PLAY
▶
```

O cursor deve possuir movimento suave e acompanhar o ponteiro com uma pequena interpolação.

### Mobile

Desativar cursor personalizado em dispositivos touch.

---

# 7. Smooth scrolling

Implementar smooth scrolling utilizando Lenis.

O scroll deve ser:

* suave;
* responsivo;
* sem sensação de atraso excessivo.

Integrar corretamente com GSAP ScrollTrigger.

---

# 8. Estrutura da página

A página principal deve seguir aproximadamente:

```text
HERO
↓
SHOWREEL
↓
SELECTED WORK
↓
BEFORE / AFTER
↓
PROCESS
↓
SERVICES
↓
ABOUT
↓
FINAL SHOWREEL / CTA
↓
CONTACT
↓
FOOTER
```

---

# 9. HERO

O Hero deve ocupar praticamente toda a viewport.

Estrutura:

```text
┌─────────────────────────────────┐
│                                 │
│          FULLSCREEN VIDEO       │
│                                 │
│          EDITOR DE VÍDEO        │
│                                 │
│       I TURN IDEAS INTO         │
│           IMAGES.               │
│                                 │
│             ↓ SCROLL            │
│                                 │
└─────────────────────────────────┘
```

## Comportamento

Utilizar vídeo de fundo.

Características:

* autoplay;
* muted;
* loop;
* playsInline;
* poster;
* carregamento otimizado.

Durante o scroll:

* aplicar zoom progressivo;
* aplicar pequena mudança de escala;
* revelar a próxima seção;
* criar sensação de transição cinematográfica.

O vídeo não deve prejudicar a performance.

---

# 10. SHOWREEL

Criar uma seção de destaque para o showreel.

Título:

```text
SHOWREEL
```

O vídeo deve ocupar grande parte da tela.

Ao passar o mouse:

```text
PLAY
```

Ao clicar:

* abrir modo fullscreen/lightbox;
* reproduzir vídeo;
* permitir fechar facilmente;
* permitir ESC para sair.

Criar controles minimalistas.

---

# 11. SELECTED WORK

Esta é uma das seções mais importantes.

Não utilizar apenas cards tradicionais.

Criar uma apresentação editorial dos projetos.

Exemplo:

```text
01

[ LARGE VIDEO ]

FASHION FILM

Director / Editor

2026
```

Outro:

```text
02

[ LARGE VIDEO ]

COMMERCIAL

Editing / Color

2026
```

## Hover

Quando o usuário passar sobre um projeto:

* iniciar preview do vídeo;
* aumentar levemente escala;
* mostrar cursor `VIEW`;
* revelar informações;
* alterar discretamente o contraste;
* criar sensação de profundidade.

Não utilizar efeitos exagerados.

---

# 12. Página/modal do projeto

Cada projeto pode abrir em uma experiência dedicada.

Estrutura:

```text
PROJECT 01

[ HERO VIDEO ]

PROJECT NAME

Description

Role
Editing
Color
Motion

Year
2026

[ ADDITIONAL MEDIA ]

← PREVIOUS
NEXT →
```

O vídeo deve ser o elemento principal.

A navegação entre projetos deve ser simples.

---

# 13. Before / After

Criar uma seção demonstrando a transformação causada pela edição.

Estrutura:

```text
BEFORE                  AFTER

[ RAW VIDEO ]          [ FINAL VIDEO ]

────────────●────────────
            ↑
         DRAG
```

Implementar slider horizontal.

O usuário deve conseguir arrastar o divisor.

Essa seção deve ser altamente visual.

---

# 14. Process

Criar uma timeline visual:

```text
01
IDEA

↓

02
STORY

↓

03
EDIT

↓

04
COLOR

↓

05
SOUND

↓

06
FINAL CUT
```

Ao entrar no viewport:

* revelar cada etapa progressivamente;
* utilizar linhas e pequenos indicadores;
* aplicar animações sincronizadas.

Na etapa `EDIT`, pode existir uma timeline fictícia:

```text
VIDEO ━━━━━━━━━━━━━━━━━━━━━

AUDIO ━━━━━━━━━━━━━━━━━━━━━

SFX   ━━━━━━━    ━━━━━━━━━━

TEXT  ━━━━       ━━━━━━━━━━
```

O playhead pode se movimentar durante a animação.

---

# 15. Services

Não utilizar cards convencionais.

Preferir lista editorial:

```text
WHAT I DO

01  VIDEO EDITING        →
02  SHORT FORM           →
03  COMMERCIALS          →
04  MOTION DESIGN        →
05  COLOR GRADING        →
06  SOCIAL MEDIA         →
```

## Hover

Ao passar sobre um serviço:

* alterar escala/tipografia;
* revelar uma imagem ou vídeo;
* mostrar descrição;
* movimentar discretamente o cursor.

Exemplo:

```text
VIDEO EDITING

I transform raw footage
into stories with rhythm,
emotion and intention.
```

---

# 16. About

Evitar uma seção tradicional de "Sobre mim".

Utilizar uma frase de impacto:

```text
I DON'T
JUST EDIT
VIDEOS.

I BUILD
EXPERIENCES.
```

Depois apresentar:

* foto;
* pequeno vídeo;
* descrição;
* experiência;
* especialidades.

Texto curto.

Evitar blocos enormes de texto.

---

# 17. Métricas

Criar uma seção minimalista com números.

Exemplo:

```text
03+
YEARS EDITING

120+
PROJECTS

35
CLIENTS

08
COUNTRIES
```

Os números devem utilizar animação de count-up ao entrarem no viewport.

Os valores devem ser facilmente alteráveis por configuração.

Não inventar métricas reais.

Usar placeholders caso os números ainda não tenham sido fornecidos.

---

# 18. Timeline global

Criar, se fizer sentido no layout final, uma timeline visual representando a navegação pelo site.

Exemplo:

```text
00:00 ━━━━━━━●━━━━━━━━━━━━ 01:24
             ↑
          YOU ARE HERE
```

A timeline pode representar:

```text
00:00 INTRO
00:15 WORK
00:38 PROCESS
00:57 ABOUT
01:10 CONTACT
```

O indicador deve acompanhar o progresso do scroll.

Esse elemento deve ser discreto.

---

# 19. CTA final

A chamada final deve parecer o último frame de um filme.

Exemplo:

```text
READY TO
CREATE
SOMETHING?

LET'S TALK →
```

Utilizar bastante espaço negativo.

Criar uma transição forte para o contato.

---

# 20. Contact

Formulário minimalista.

Campos:

```text
NAME

EMAIL

PROJECT

TELL ME ABOUT IT...

[ SEND PROJECT ]
```

Também disponibilizar:

* WhatsApp;
* Instagram;
* Behance;
* Vimeo;
* LinkedIn, se aplicável.

Não inventar links.

---

# 21. Footer

Minimalista.

Exemplo:

```text
© 2026 NAME

INSTAGRAM
BEHANCE
VIMEO

MADE WITH
PASSION + CODE
```

Adicionar pequena interação no logo/nome.

---

# 22. Responsividade

O site deve ser desenvolvido pensando primeiro em desktop e depois adaptado cuidadosamente para mobile.

## Desktop

Pode utilizar:

* cursor personalizado;
* hover;
* parallax;
* vídeos grandes;
* horizontal scroll;
* efeitos avançados.

## Mobile

Simplificar:

* remover cursor personalizado;
* reduzir parallax;
* reduzir efeitos pesados;
* manter vídeos;
* manter transições;
* adaptar grids para coluna;
* aumentar áreas clicáveis.

Nunca simplesmente esconder elementos importantes no mobile.

---

# 23. Performance

Performance é prioridade.

## Vídeos

Utilizar:

* WebM quando disponível;
* MP4 como fallback;
* poster;
* compressão adequada;
* lazy loading quando possível;
* preload apenas quando necessário.

Não carregar todos os vídeos simultaneamente.

Vídeos fora da viewport devem ser carregados de forma inteligente.

---

## Imagens

Utilizar:

* WebP;
* AVIF quando possível;
* lazy loading;
* dimensões corretas;
* `width` e `height` definidos.

Evitar imagens gigantes.

---

# 24. Acessibilidade

Garantir:

* navegação por teclado;
* foco visível;
* `aria-label` quando necessário;
* textos alternativos;
* contraste adequado;
* controles de vídeo acessíveis;
* `prefers-reduced-motion`.

Se o usuário possuir:

```css
prefers-reduced-motion: reduce
```

reduzir drasticamente:

* parallax;
* scroll animations;
* cursor animations;
* transições complexas.

A experiência deve continuar funcional.

---

# 25. Arquitetura

Organizar componentes de forma modular.

Exemplo:

```text
src/
├── components/
│   ├── Header/
│   ├── CustomCursor/
│   ├── VideoPlayer/
│   ├── Showreel/
│   ├── ProjectCard/
│   ├── ProjectModal/
│   ├── BeforeAfter/
│   ├── ProcessTimeline/
│   ├── Services/
│   ├── About/
│   ├── Stats/
│   ├── Contact/
│   └── Footer/
│
├── sections/
│   ├── Hero/
│   ├── SelectedWork/
│   ├── Process/
│   └── ...
│
├── data/
│   ├── projects.ts
│   ├── services.ts
│   └── social.ts
│
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useMousePosition.ts
│   └── useReducedMotion.ts
│
├── animations/
│   ├── hero.ts
│   ├── projects.ts
│   ├── textReveal.ts
│   └── scroll.ts
│
├── pages/
│   └── Home.tsx
│
└── App.tsx
```

---

# 26. Dados dos projetos

Projetos devem ser separados do componente visual.

Exemplo:

```ts
export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  thumbnail: string;
  video?: string;
  role: string[];
}
```

Exemplo:

```ts
export const projects: Project[] = [
  {
    id: "project-01",
    title: "Fashion Film",
    category: "Editorial",
    year: "2026",
    description: "Descrição do projeto.",
    thumbnail: "/projects/fashion/thumb.webp",
    video: "/projects/fashion/video.mp4",
    role: ["Editing", "Color"]
  }
];
```

Não espalhar informações dos projetos dentro dos componentes.

---

# 27. GSAP

Centralizar animações complexas.

Utilizar:

```ts
gsap.context()
```

e limpar animações corretamente.

Sempre evitar memory leaks.

Quando utilizar React:

```tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // animations
  });

  return () => ctx.revert();
}, []);
```

---

# 28. ScrollTrigger

Utilizar ScrollTrigger para:

* reveal de textos;
* scale de vídeos;
* parallax;
* progress indicators;
* horizontal scroll;
* timeline;
* transições entre seções.

Não criar dezenas de ScrollTriggers desnecessários.

---

# 29. Regras de UX

O usuário deve sempre entender:

* onde está;
* o que pode clicar;
* o que é vídeo;
* como voltar;
* como fechar modal;
* como entrar em contato.

A estética não pode comprometer usabilidade.

---

# 30. Regras importantes para o agente

### NÃO fazer

* Não criar um template genérico.
* Não utilizar excesso de cards.
* Não usar gradientes aleatórios.
* Não exagerar nas animações.
* Não adicionar elementos apenas porque "parecem legais".
* Não utilizar lorem ipsum na versão final.
* Não inventar clientes.
* Não inventar métricas.
* Não inventar projetos.
* Não inventar redes sociais.
* Não alterar conteúdo fornecido pelo usuário sem autorização.
* Não utilizar imagens/vídeos protegidos sem verificar licença.

### Fazer

* Priorizar vídeos.
* Priorizar composição.
* Priorizar tipografia.
* Priorizar espaço negativo.
* Criar animações cinematográficas.
* Manter excelente performance.
* Criar experiência responsiva.
* Manter componentes reutilizáveis.
* Manter o código tipado.
* Testar em desktop e mobile.
* Respeitar `prefers-reduced-motion`.

---

# 31. Filosofia de implementação

O site deve seguir a seguinte lógica:

```text
CONTENT
   ↓
DESIGN
   ↓
MOTION
   ↓
INTERACTION
```

Nunca:

```text
EFFECT
   ↓
EFFECT
   ↓
EFFECT
```

A animação deve servir ao conteúdo.

O vídeo deve ser o protagonista.

A interface deve desaparecer quando necessário e deixar o trabalho do editor falar por si.

---

# 32. Resultado esperado

Ao finalizar, o site deve passar a sensação de:

> "Essa pessoa sabe editar."

e não apenas:

> "Essa pessoa fez um site bonito."

O portfólio deve funcionar como uma **demonstração prática das habilidades do editor de vídeo**.

A experiência ideal é:

**ENTRAR → DESCOBRIR → ASSISTIR → INTERAGIR → CONHECER → CONTRATAR.**
