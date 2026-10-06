import { gsap, SplitText } from "../lib/gsap";

/**
 * Divide o texto em linhas mascaradas. Com line-height apertado, a máscara cortaria
 * acentos (Ã, Í, Ç) — por isso cada máscara ganha folga vertical compensada por margem negativa.
 */
export function splitMaskedLines(targets: gsap.DOMTarget) {
  const split = SplitText.create(targets, { type: "lines", mask: "lines", linesClass: "split-line" });
  split.masks.forEach((m) => {
    const el = m as HTMLElement;
    el.style.padding = "0.14em 0.04em 0.1em";
    el.style.margin = "-0.14em -0.04em -0.1em";
  });
  return split;
}

/**
 * Revela linhas de texto "por baixo de uma máscara", como um título entrando em corte.
 * Deve ser chamado dentro de um gsap.context()/matchMedia para ser revertido corretamente.
 */
export function revealLines(
  targets: gsap.DOMTarget,
  opts: { trigger?: Element | string; delay?: number; stagger?: number; start?: string } = {},
) {
  const split = splitMaskedLines(targets);
  gsap.from(split.lines, {
    yPercent: 110,
    duration: 1.1,
    ease: "expo.out",
    stagger: opts.stagger ?? 0.08,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.trigger ? { trigger: opts.trigger, start: opts.start ?? "top 80%", once: true } : undefined,
  });
  return split;
}

/** Fade + subida curta, para blocos auxiliares (labels, metadados). */
export function revealUp(targets: gsap.TweenTarget, trigger: Element | string, opts: { stagger?: number; start?: string } = {}) {
  gsap.from(targets, {
    y: 24,
    opacity: 0,
    duration: 0.9,
    stagger: opts.stagger ?? 0.06,
    scrollTrigger: { trigger, start: opts.start ?? "top 85%", once: true },
  });
}
