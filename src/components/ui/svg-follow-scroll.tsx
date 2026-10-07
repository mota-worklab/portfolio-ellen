import { useEffect, useId, useRef, type RefObject } from "react";
import { gsap, MQ, ScrollTrigger } from "../../lib/gsap";

type SvgFollowScrollProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  closing?: string;
};

const line = "M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89";
const journeyLine = "M1080 0 C1000 180 540 230 330 430 S880 780 1030 970 S280 1310 245 1510 S900 1800 1020 1990 S600 2210 330 2319";

export function ScrollStroke({ targetRef, className = "", stretch = false }: { targetRef: RefObject<HTMLElement | null>; className?: string; stretch?: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const revealRef = useRef<SVGRectElement>(null);
  const revealId = `scroll-stroke-${useId().replace(/:/g, "")}`;

  // The target belongs to our parent: its ref is attached after child layout
  // effects. A passive effect waits until both DOM refs are available.
  useEffect(() => {
    const section = targetRef.current;
    const path = pathRef.current;
    if (!section || !path) return;

    const mm = gsap.matchMedia(section);
    mm.add(MQ.motion, () => {
      if (stretch) {
        const reveal = revealRef.current;
        if (!reveal) return;

        // This path travels strictly downward. Revealing it by height keeps
        // its drawing tip at 72% of the viewport, even across long galleries.
        // Clipping also preserves the constant 14px non-scaling stroke.
        const update = (progress: number) => {
          reveal.setAttribute("height", String(2319 * Math.max(0, Math.min(1, progress))));
        };
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 72%",
          end: "bottom 72%",
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => update(progress),
          onRefresh: ({ progress }) => update(progress),
        });
        update(trigger.progress);
        gsap.set(path, { autoAlpha: 1 });

        let refreshFrame = 0;
        const observer = new ResizeObserver(() => {
          cancelAnimationFrame(refreshFrame);
          refreshFrame = requestAnimationFrame(() => trigger.refresh());
        });
        observer.observe(section);

        return () => {
          cancelAnimationFrame(refreshFrame);
          observer.disconnect();
          trigger.kill();
          reveal.setAttribute("height", "0");
        };
      }

      const length = path.getTotalLength();
      gsap.set(path, { autoAlpha: 1, strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: () => `+=${window.innerHeight * 1.2}`,
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });
    });
    mm.add(MQ.reduce, () => {
      if (stretch) {
        revealRef.current?.setAttribute("height", "2319");
        gsap.set(path, { autoAlpha: 1 });
      } else {
        gsap.set(path, { autoAlpha: 1, strokeDasharray: path.getTotalLength(), strokeDashoffset: 0 });
      }
    });
    return () => mm.revert();
  }, [targetRef, stretch]);

  return (
    <svg
      viewBox="0 0 1278 2319"
      preserveAspectRatio={stretch ? "none" : "xMidYMid slice"}
      fill="none"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {stretch && (
        <defs>
          <clipPath id={revealId} clipPathUnits="userSpaceOnUse">
            <rect ref={revealRef} width="1278" height="0" />
          </clipPath>
        </defs>
      )}
      {!stretch && <path d={line} stroke="white" strokeWidth="20" opacity="0.1" fill="none" />}
      <path
        ref={pathRef}
        d={stretch ? journeyLine : line}
        clipPath={stretch ? `url(#${revealId})` : undefined}
        style={{ visibility: "hidden" }}
        stroke="#ff3d2e"
        strokeWidth={stretch ? 14 : 20}
        vectorEffect={stretch ? "non-scaling-stroke" : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Skiper19({
  eyebrow = "Narrativa em movimento",
  title = "Cada corte conduz o olhar.",
  description = "Da primeira ideia ao último frame, o ritmo dá forma à história.",
  closing = "O próximo frame é seu.",
}: SvgFollowScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} aria-labelledby="svg-follow-scroll-title" className="relative h-[180svh] overflow-clip border-y border-line bg-ink text-white">
      <div className="gutter sticky top-0 flex h-svh flex-col justify-between overflow-hidden py-20 sm:py-24">
        <ScrollStroke targetRef={sectionRef} className="absolute inset-0 h-full w-full opacity-45 sm:opacity-70" />

        <div className="relative z-10 max-w-3xl">
          <p className="label mb-7 !text-accent">{eyebrow}</p>
          <h2 id="svg-follow-scroll-title" className="display text-[clamp(2.75rem,6.5vw,7rem)]">{title}</h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>
        </div>

        <div className="relative z-10 ml-auto w-fit border-t border-white/30 pt-4 text-right">
          <span className="label !text-white/50">Fim da sequência · Início da próxima</span>
          <p className="mt-3 font-display text-[clamp(1.25rem,2.5vw,2rem)] font-extrabold tracking-[-0.03em]">{closing}</p>
        </div>
      </div>
    </section>
  );
}
