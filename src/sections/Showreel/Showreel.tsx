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
       
      </div>

      <button
        type="button"
        data-reel-frame
        data-cursor="play"
        onClick={() => setOpen(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-ink-3"
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
          <span className="flex size-20 items-center justify-center gap-1.5 rounded-full bg-accent font-mono text-[11px] uppercase tracking-[0.05em] text-ink">
            Assistir <Play size={11} fill="currentColor" />
          </span>
        </span>
      </button>

      

      {open && (
        <Overlay label="Showreel" onClose={() => setOpen(false)}>
          {(close) => (
            <div className="gutter mx-auto flex min-h-dvh w-full max-w-[110rem] flex-col gap-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:gap-5 sm:py-5">
              <div className="flex items-center justify-between gap-4 border-b border-line pb-2">
                <p className="label !text-white">Showreel {year}</p>
                <button
                  type="button"
                  onClick={close}
                  data-autofocus
                  className="label flex min-h-11 items-center gap-2 !text-white hover:!text-accent"
                >
                  Fechar <span className="text-white/40">ESC</span> <X size={14} aria-hidden="true" />
                </button>
              </div>
              <div className="flex min-w-0 shrink-0 items-center justify-center sm:min-h-0 sm:flex-1">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black sm:max-w-[max(16rem,calc(177.78dvh_-_14.22rem))]">
                  <VideoPlayer source={showreel.video} title="Showreel" autoPlay fitContainer placeholderHint="src/config/site.ts → showreel.video" />
                </div>
              </div>
            </div>
          )}
        </Overlay>
      )}
    </section>
  );
}
