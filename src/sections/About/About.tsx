import { useLayoutEffect, useRef } from "react";
import { site } from "../../config/site";
import { gsap, MQ } from "../../lib/gsap";
import { hasVideo } from "../../lib/media";
import { revealUp } from "../../animations/textReveal";
import { LazyVideo } from "../../components/VideoPlayer/LazyVideo";

const DEV = import.meta.env.DEV;

export function About() {
  const root = useRef<HTMLElement>(null);
  const { about, name, role } = site;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      // A cena trava na tela e a frase avança linha a linha no ritmo do scroll, como um letreiro:
      // a linha atual em destaque, a anterior logo acima e esmaecida, as mais antigas somem.
      const lines = gsap.utils.toArray<HTMLElement>("[data-statement-line]");
      const stack = root.current?.querySelector<HTMLElement>("[data-statement]");
      gsap.set(lines.slice(1), { autoAlpha: 0 });
      const tl = gsap.timeline({
        defaults: { duration: 1 },
        scrollTrigger: {
          trigger: "[data-statement-stage]",
          start: "top top",
          end: () => `+=${window.innerHeight * 0.8 * lines.length}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(lines[0], { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, ease: "power3.out" });
      for (let k = 1; k < lines.length; k++) {
        const at = `line-${k}`;
        tl.addLabel(at, "+=0.6");
        if (k >= 2) {
          // Sobe a pilha uma linha: a anterior ocupa a vaga de cima e a mais antiga sai.
          tl.to(stack ?? [], { y: () => -(lines[k - 1].offsetTop - lines[0].offsetTop), ease: "power3.inOut" }, at);
          tl.to(lines[k - 2], { autoAlpha: 0, ease: "power2.in" }, at);
        }
        tl.to(lines[k - 1], { opacity: 0.22, ease: "power2.out" }, at);
        tl.fromTo(lines[k], { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, ease: "power3.out" }, at);
      }
      tl.to({}, { duration: 0.6 });

      // Cada painel abre com um wipe; o recorte da foto sobe para dentro do quadro.
      gsap.utils.toArray<HTMLElement>("[data-about-media]").forEach((panel) => {
        const tl = gsap
          .timeline({ scrollTrigger: { trigger: panel, start: "top 80%", once: true } })
          .from(panel, { clipPath: "inset(100% 0 0 0)", duration: 1.3, ease: "expo.inOut" });
        const cutout = panel.querySelector("[data-about-cutout]");
        const nameEl = panel.querySelector("[data-about-name]");
        if (cutout) tl.from(cutout, { yPercent: 12, duration: 1.6 }, "-=0.7");
        if (nameEl) tl.from(nameEl, { yPercent: 40, opacity: 0, duration: 1.4 }, "<");
      });

      revealUp("[data-about-intro]", "[data-about-grid]", { start: "top 70%", stagger: 0.08 });
    });

    // Parallax leve só no desktop: o recorte se desloca mais devagar que o quadro.
    mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
      gsap.utils.toArray<HTMLElement>("[data-about-cutout-wrap]").forEach((wrap) => {
        gsap.fromTo(
          wrap,
          { yPercent: 4 },
          { yPercent: -4, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="gutter pb-24 sm:pb-40">
      <div data-statement-stage className="flex min-h-svh flex-col items-center justify-center">
       

        {/* Com movimento: janela de duas linhas por onde a frase passa. Sem movimento: frase inteira. */}
        <div className="display w-full text-center text-[clamp(2.5rem,min(8vw,13svh),9rem)] motion-safe:h-[1.76em]">
          <p data-statement>
            {about.statement.map((block, b) =>
              block.map((line, l) => (
                <span
                  key={line}
                  data-statement-line
                  className={`block ${b > 0 && l === 0 ? "motion-reduce:mt-[0.35em]" : ""}`}
                >
                  {line}
                </span>
              )),
            )}
          </p>
        </div>
      </div>

      {/* Retrato + apresentação */}
      <div data-about-grid className="mt-24 grid gap-10 sm:mt-40 lg:grid-cols-12 lg:gap-6">
        <figure className="lg:col-span-5">
          <div data-about-media className="crop-marks relative aspect-[4/5] overflow-hidden bg-ink-2">
            <span
              data-about-name
              aria-hidden="true"
              className="display absolute inset-x-0 top-[6%] text-center text-[clamp(4rem,11vw,9rem)] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.22)]"
            >
              {name}
            </span>
            <div data-about-cutout-wrap className="absolute inset-0">
              <img
                data-about-cutout
                src={about.portrait.src}
                alt={about.portrait.alt}
                width={about.portrait.width}
                height={about.portrait.height}
                loading="lazy"
                decoding="async"
                className="absolute bottom-0 left-1/2 h-[90%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
              />
            </div>
          </div>
          <figcaption className="label mt-4 flex items-center justify-between">
            <span className="!text-white">{name}</span>
            <span>{role}</span>
          </figcaption>
        </figure>

        <div className="flex flex-col lg:col-span-6 lg:col-start-7 lg:pt-6">
          <p data-about-intro className="label mb-6">
            Quem está por trás do corte
          </p>
          <h3 data-about-intro className="display text-[clamp(2rem,3.6vw,3.5rem)]">
            Prazer,
            <br />
            {name}.
          </h3>

          <div className="mt-10 flex max-w-xl flex-col gap-5 text-base leading-relaxed text-white/85 sm:text-[1.0625rem]">
            {about.bio.length > 0
              ? about.bio.map((paragraph, i) => (
                  <p key={i} data-about-intro>
                    {paragraph}
                  </p>
                ))
              : DEV && (
                  <p data-about-intro className="label border border-dashed border-line p-5 !leading-relaxed">
            
                  </p>
                )}
          </div>
        </div>
      </div>

      {hasVideo(about.video) && (
        <div data-about-media className="relative mt-6 aspect-video overflow-hidden bg-ink-2">
          <LazyVideo source={about.video} placeholder={{ label: "Bastidores" }} />
        </div>
      )}
    </section>
  );
}
