import { ArrowDown, Pause, Play } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { site } from "../../config/site";
import { gsap, MQ, SplitText } from "../../lib/gsap";
import { hasVideo } from "../../lib/media";
import { LazyVideo } from "../../components/VideoPlayer/LazyVideo";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Abertura. Vídeo em tela cheia que, ao rolar, sofre zoom e "encolhe" para dentro
 * de um frame — a página corta para a próxima cena.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  // Com movimento reduzido o vídeo começa pausado; o usuário pode iniciar.
  const paused = userPaused ?? reduced;
  const video = site.hero.video;
  // Nome numa linha só: primeiro nome leve, sobrenome pesado, ponto final em destaque.
  const [firstName, ...rest] = site.hero.title;
  const lastName = rest.join(" ");

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);

    mm.add(MQ.motion, () => {
      // Cada letra sobe por trás de uma máscara — o nome "entra em corte".
      const title = SplitText.create("[data-hero-title]", { type: "chars", mask: "chars" });
      // Folga na máscara para não cortar ascendentes/descendentes com o leading apertado.
      title.masks.forEach((m) => {
        const el = m as HTMLElement;
        el.style.padding = "0.12em 0.02em 0.1em";
        el.style.margin = "-0.12em -0.02em -0.1em";
      });
      const intro = gsap.timeline({ delay: 0.15 });
      intro
        .fromTo("[data-hero-open]", { clipPath: "inset(50% 0 50% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 1.3, ease: "expo.inOut" })
        .from("[data-hero-zoom]", { scale: 1.25, duration: 2, ease: "expo.out" }, "<0.2")
        .from(title.chars, { yPercent: 110, duration: 1.1, stagger: 0.035 }, "-=1.3")
        .from("[data-hero-meta]", { opacity: 0, y: 12, stagger: 0.08, duration: 0.8 }, "-=0.9");

      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=100%", scrub: true, pin: true, anticipatePin: 1 },
          defaults: { ease: "none" },
        })
        .to("[data-hero-frame]", { clipPath: "inset(10% 8% 10% 8% round 4px)" }, 0)
        .to("[data-hero-media]", { scale: 1.18 }, 0)
        .to("[data-hero-copy]", { yPercent: -30, opacity: 0 }, 0)
        .to("[data-hero-shade]", { opacity: 0.75 }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="intro" aria-label="Introdução" className="relative h-svh min-h-[560px] overflow-hidden bg-ink">
      <div data-hero-frame className="absolute inset-0 overflow-hidden">
        <div data-hero-open className="absolute inset-0">
          <div data-hero-media className="absolute inset-0">
            <div data-hero-zoom className="absolute inset-0">
              <LazyVideo
                source={video}
                eager
                paused={paused}
                placeholder={{ label: "Vídeo de abertura", hint: "src/config/site.ts → hero.video" }}
              />
            </div>
          </div>
          <div data-hero-shade className="absolute inset-0 bg-ink opacity-45" />
          {/* Escurece a base do quadro, onde fica o título — legibilidade sobre qualquer footage. */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/80 to-transparent" />
        </div>
      </div>

      <div data-hero-copy className="gutter relative z-10 flex h-full flex-col pb-8 pt-24 sm:pb-10">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1
            data-hero-title
            className="whitespace-nowrap font-display text-[clamp(2.75rem,11vw,11rem)] leading-[0.9] tracking-[-0.06em]"
          >
            {/* Espaço via margem: o split por letras e o tracking negativo engolem o espaço de texto. */}
            <span className="font-extrabold">{firstName}</span>
            {lastName && <span className="ml-[0.1em] font-extrabold">{lastName}</span>}
            <span className="font-extrabold text-accent">.</span>
          </h1>
          <p
            data-hero-meta
            className="mt-5 flex items-center gap-3 font-mono text-[clamp(0.75rem,1.1vw,0.95rem)] uppercase tracking-[0.3em] text-white/80 sm:mt-7"
          >
           
            {site.hero.eyebrow}
          </p>
        </div>

        <div data-hero-meta className="flex items-center justify-between">
          <span className="label flex items-center gap-2">
            <ArrowDown size={12} aria-hidden="true" /> Role
          </span>
          {hasVideo(video) && (
            <button
              type="button"
              onClick={() => setUserPaused(!paused)}
              className="label flex min-h-11 items-center gap-2 !text-white/70 hover:!text-white"
              aria-label={paused ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo"}
            >
              {paused ? <Play size={12} /> : <Pause size={12} />}
              {paused ? "Reproduzir" : "Pausar"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
