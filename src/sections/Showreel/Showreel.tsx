import { Play, X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { site } from "../../config/site";
import { gsap, MQ } from "../../lib/gsap";
import { revealUp } from "../../animations/textReveal";
import { LazyVideo } from "../../components/VideoPlayer/LazyVideo";
import { VideoPlayer } from "../../components/VideoPlayer/VideoPlayer";
import { Overlay } from "../../components/Overlay/Overlay";

export function Showreel() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { showreel, year } = site;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      // O título se abre como uma claquete enquanto o frame cresce até ocupar a tela.
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
          defaults: { ease: "none" },
        })
        .fromTo("[data-reel-frame]", { clipPath: "inset(14% 18% 14% 18%)" }, { clipPath: "inset(0% 0% 0% 0%)" }, 0)
        .fromTo("[data-reel-media]", { scale: 1.2 }, { scale: 1 }, 0)
        .fromTo("[data-reel-word='a']", { xPercent: 12 }, { xPercent: 0 }, 0)
        .fromTo("[data-reel-word='b']", { xPercent: -12 }, { xPercent: 0 }, 0);
      revealUp("[data-reel-meta]", root.current!);
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="showreel-title" className="gutter relative py-24 sm:py-32">
      <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
        <h2 id="showreel-title" className="display flex min-w-0 flex-col text-[clamp(2.25rem,5.5vw,5.5rem)]">
          <span data-reel-word="a" className="inline-block">
            Cada frame,
          </span>
          <span data-reel-word="b" className="inline-block">
            uma história
          </span>
        </h2>
        <div data-reel-meta className="label hidden shrink-0 pb-3 text-right sm:block">
          <p className="!text-white">{year}</p>
          {showreel.duration && <p>{showreel.duration}</p>}
        </div>
      </div>

      <button
        type="button"
        data-reel-frame
        data-cursor="play"
        onClick={() => setOpen(true)}
        className="group relative block aspect-video w-full overflow-hidden bg-ink-3"
        aria-label="Assistir showreel"
      >
        <div data-reel-media className="absolute inset-0 transition-[filter] duration-700 group-hover:brightness-110">
          <LazyVideo
            source={showreel.preview}
            image={showreel.video.poster}
            placeholder={{ label: "Showreel", hint: "src/config/site.ts → showreel" }}
          />
        </div>
        <span className="absolute inset-0 grid place-items-center pointer-fine:hidden" aria-hidden="true">
          <span className="flex size-20 items-center justify-center gap-1.5 rounded-full bg-accent font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
            Assistir <Play size={11} fill="currentColor" />
          </span>
        </span>
      </button>

      <div data-reel-meta className="mt-5 flex items-center justify-between">
        <p className="label">{showreel.demo ? "Vídeo de exemplo · Tears of Steel" : `Cortes selecionados — ${year}`}</p>
        <p className="label flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" /> {showreel.demo ? "Demonstração" : "Com som"}
        </p>
      </div>

      {open && (
        <Overlay label="Showreel" onClose={() => setOpen(false)}>
          {(close) => (
            <div className="gutter flex min-h-svh flex-col justify-center gap-6 py-6">
              <div className="flex items-center justify-between">
                <p className="label !text-white">Showreel — {year}</p>
                <button
                  type="button"
                  onClick={close}
                  data-autofocus
                  className="label flex min-h-11 items-center gap-2 !text-white hover:!text-accent"
                >
                  Fechar <span className="text-white/40">ESC</span> <X size={14} aria-hidden="true" />
                </button>
              </div>
              <VideoPlayer source={showreel.video} title="Showreel" autoPlay placeholderHint="src/config/site.ts → showreel.video" />
            </div>
          )}
        </Overlay>
      )}
    </section>
  );
}
