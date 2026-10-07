import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { site } from "../../config/site";
import { gsap, MQ, ScrollTrigger } from "../../lib/gsap";
import { prefillContact } from "../../lib/events";
import { revealLines, revealUp } from "../../animations/textReveal";
import { HandPhone } from "../../components/HandPhone/HandPhone";
import { scrollToTarget, useLenis } from "../../components/SmoothScroll/SmoothScroll";

const FORMATS = ["Reels", "TikTok", "Shorts"];

/**
 * Formato vertical: no desktop a cena fica fixa enquanto o scroll gira o celular
 * de perfil até ficar de frente para quem assiste.
 */
export function Vertical() {
  const root = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const lenis = useLenis();

  useLayoutEffect(() => {
    // Progresso do scroll pela seção — lido a cada frame pela cena 3D.
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom bottom",
      onUpdate: ({ progress }) => (progressRef.current = progress),
    });

    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      revealLines("[data-vertical-title]", { trigger: root.current! });
      revealUp("[data-vertical-meta]", root.current!, { start: "top 60%" });
    });

    return () => {
      st.kill();
      mm.revert();
    };
  }, []);

  return (
    <section ref={root} id="vertical" aria-labelledby="vertical-title" className="relative lg:h-[180vh]">
      <div className="gutter grid items-center gap-10 py-24 lg:sticky lg:top-0 lg:h-svh lg:grid-cols-12 lg:gap-6 lg:py-0">
        <div className="lg:col-span-5">
          
          <h2 id="vertical-title" data-vertical-title className="display text-[clamp(2.25rem,4.6vw,4.75rem)]">
            Feito para
            <br />a tela que
            <br />
            cabe na mão.
          </h2>
          <p data-vertical-meta className="mt-8 max-w-md text-base leading-relaxed sm:text-[1.0625rem] text-white/80">
            Vídeos curtos pensados para o celular: gancho no primeiro segundo, ritmo de rolagem e legendas que funcionam
            sem som.
          </p>

          <ul data-vertical-meta className="mt-8 flex flex-wrap gap-2" aria-label="Formatos">
            {FORMATS.map((f) => (
              <li key={f} className="flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm">
                {f} <span className="font-mono text-[10px] text-mute">9:16</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            data-vertical-meta
            onClick={() => {
              prefillContact("Vídeos Curtos");
              scrollToTarget(lenis, "#contact");
            }}
            className="group mt-10 inline-flex items-center gap-3 font-display text-lg font-extrabold uppercase tracking-[-0.02em]"
          >
            <span className="border-b-2 border-accent pb-1">Quero um vídeo vertical</span>
            <ArrowRight className="size-5 transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden="true" />
          </button>
        </div>

        <HandPhone
          video={site.vertical.video}
          model={site.vertical.model}
          progressRef={progressRef}
          className="h-[78svh] min-h-[520px] [mask-image:linear-gradient(to_bottom,black_78%,transparent)] lg:col-span-7 lg:h-full min-[1600px]:max-h-[60rem]"
        />
      </div>
    </section>
  );
}
