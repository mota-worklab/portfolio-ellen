import { useLayoutEffect, useRef } from "react";
import { processSteps } from "../../data/process";
import { gsap, MQ } from "../../lib/gsap";
import { toTimecode } from "../../lib/timecode";
import { revealLines } from "../../animations/textReveal";
import { EditTimeline } from "../../components/ProcessTimeline/EditTimeline";

export function Process() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);

    mm.add(MQ.motion, () => {
      revealLines("[data-process-title]", { trigger: root.current! });

      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");

      // Um único trigger desenha a linha e acende as etapas conforme o scroll.
      gsap.fromTo(
        "[data-process-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-steps]",
            start: "top 60%",
            end: "bottom 60%",
            scrub: true,
            onUpdate: ({ progress }) => {
              const active = Math.min(Math.floor(progress * steps.length + 0.15), steps.length - 1);
              steps.forEach((s, i) => s.toggleAttribute("data-active", i <= active && progress > 0));
            },
          },
        },
      );

      // Timeline da etapa EDIT: clips entram em sequência e o playhead percorre a sequência.
      const tc = root.current!.querySelector("[data-playhead-tc]");
      gsap.from("[data-clip]", {
        scaleX: 0,
        stagger: 0.03,
        duration: 0.7,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-step='edit']", start: "top 70%", once: true },
      });
      gsap.fromTo(
        "[data-playhead]",
        { left: "0%" },
        {
          left: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-step='edit']",
            start: "top 65%",
            end: "bottom 25%",
            scrub: 0.4,
            onUpdate: ({ progress }) => {
              if (tc) tc.textContent = toTimecode(progress * 30);
            },
          },
        },
      );
    });

    mm.add(MQ.reduce, () => {
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((s) => s.setAttribute("data-active", ""));
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="process" aria-labelledby="process-title" className="gutter py-24 sm:py-40">
      <div className="mb-16 grid gap-6 border-b border-line pb-6 sm:mb-24 lg:grid-cols-12">
        <h2 id="process-title" data-process-title className="display text-[clamp(2.25rem,4.6vw,4.75rem)] lg:col-span-8">
          Processo
        </h2>
       </div>

      <ol data-steps className="relative ml-1 lg:ml-[8.333%]">
        <span className="absolute bottom-0 left-0 top-0 w-px bg-line" aria-hidden="true" />
        <span data-process-line className="absolute bottom-0 left-0 top-0 w-px origin-top bg-accent" aria-hidden="true" />

        {processSteps.map((step, i) => (
          <li
            key={step.id}
            data-step={step.id}
            className="group/step relative grid gap-3 pb-16 pl-8 opacity-30 transition-opacity duration-700 last:pb-0 data-[active]:opacity-100 sm:pb-24 sm:pl-14 lg:grid-cols-12 lg:gap-6"
          >
            <span
              className="absolute -left-[4px] top-3 size-[9px] rounded-full border border-white/40 bg-ink transition-colors duration-500 group-data-[active]/step:border-accent group-data-[active]/step:bg-accent"
              aria-hidden="true"
            />
            <p className="font-mono text-xs tabular-nums text-accent lg:col-span-1 lg:pt-4">{String(i + 1).padStart(2, "0")}</p>
            <div className="lg:col-span-10">
              <h3 className="display text-[clamp(1.75rem,3.2vw,3rem)]">{step.title}</h3>
              <p className="mt-4 max-w-md text-mute">{step.description}</p>
              {step.id === "edit" && <EditTimeline />}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
