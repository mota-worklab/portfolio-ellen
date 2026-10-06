import { useLayoutEffect, useRef } from "react";
import { site } from "../../config/site";
import { gsap, MQ } from "../../lib/gsap";

const format = (n: number) => String(Math.round(n)).padStart(2, "0");

export function Stats() {
  const root = useRef<HTMLElement>(null);
  const { metrics } = site;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-count]");
      els.forEach((el, i) => {
        const target = Number(el.dataset.count);
        const counter = { v: 0 };
        el.textContent = format(0);
        gsap.to(counter, {
          v: target,
          duration: 1.8,
          delay: i * 0.1,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = format(counter.v);
          },
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
      });
      return () => els.forEach((el) => (el.textContent = format(Number(el.dataset.count))));
    });
    return () => mm.revert();
  }, []);

  if (!metrics.length) return null;

  return (
    <section ref={root} aria-label="Números" className="gutter border-y border-line py-16 sm:py-24">
      <dl className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col-reverse gap-3 border-l border-line pl-4 sm:pl-6">
            <dt className="label">{m.label}</dt>
            <dd className="display text-[clamp(2.5rem,4.5vw,4.5rem)] tabular-nums">
              <span className="sr-only">
                {m.value}
                {m.suffix}
              </span>
              <span aria-hidden="true">
                <span data-count={m.value}>{format(m.value)}</span>
                {m.suffix && <span className="text-accent">{m.suffix}</span>}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
