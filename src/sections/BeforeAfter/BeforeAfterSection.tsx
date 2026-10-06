import { useLayoutEffect, useRef } from "react";
import { beforeAfter } from "../../data/projects";
import { gsap, MQ } from "../../lib/gsap";
import { revealLines, revealUp } from "../../animations/textReveal";
import { BeforeAfter } from "../../components/BeforeAfter/BeforeAfter";

export function BeforeAfterSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      revealLines("[data-ba-title]", { trigger: root.current! });
      revealUp("[data-ba-meta]", root.current!);
      // O divisor "varre" o frame uma vez ao entrar, mostrando que é interativo.
      gsap.from("[data-ba-frame]", {
        clipPath: "inset(0 50% 0 50%)",
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: { trigger: "[data-ba-frame]", start: "top 75%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="ba-title" className="gutter py-24 sm:py-40">
      <div className="mb-10 grid gap-6 sm:mb-14 lg:grid-cols-12">
        <h2 id="ba-title" data-ba-title className="display text-[clamp(2.25rem,4.6vw,4.75rem)] lg:col-span-8">
          Antes /<br />
          Depois
        </h2>
        <div className="flex flex-col justify-end gap-3 lg:col-span-4">
          <p data-ba-meta className="max-w-sm text-mute">
            {beforeAfter.demo
              ? "Arraste o divisor para explorar uma simulação de contraste e saturação no mesmo vídeo de exemplo."
              : "Mesmo plano, mesmo frame. Arraste o divisor para ver o que a edição e a cor fazem com o material bruto."}
          </p>
          <p data-ba-meta className="label">{beforeAfter.caption}</p>
        </div>
      </div>

      <div data-ba-frame>
        <BeforeAfter before={beforeAfter.before} after={beforeAfter.after} demo={beforeAfter.demo} />
      </div>

      <div data-ba-meta className="mt-5 flex items-center justify-between">
        <span className="label">{beforeAfter.demo ? "Cor suavizada" : "Bruto"}</span>
        <span className="label flex items-center gap-2 !text-white">
          <span className="h-px w-6 bg-accent" aria-hidden="true" /> Arraste <span className="h-px w-6 bg-accent" aria-hidden="true" />
        </span>
        <span className="label">{beforeAfter.demo ? "Cor original" : "Final"}</span>
      </div>
    </section>
  );
}
