import { useLayoutEffect, useRef, useState } from "react";
import { projects } from "../../data/projects";
import { gsap, MQ, ScrollTrigger } from "../../lib/gsap";
import { revealLines } from "../../animations/textReveal";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { ProjectModal } from "../../components/ProjectModal/ProjectModal";

export function SelectedWork() {
  const root = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "vertical" | "horizontal">("all");
  const [limit, setLimit] = useState(8);
  const filtered = projects.filter((project) => filter === "all" || (project.format ?? "horizontal") === filter);
  const vertical = filtered.filter((project) => project.format === "vertical").slice(0, limit);
  const horizontal = filtered.filter((project) => project.format !== "vertical").slice(0, limit);
  const shown = vertical.length + horizontal.length;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, (context) => {
      revealLines("[data-work-title]", { trigger: "[data-work-title]" });

      // Cada frame entra com um wipe de baixo para cima; um único batch para todos os projetos.
      gsap.set("[data-project-frame]", { clipPath: "inset(100% 0 0 0)" });
      ScrollTrigger.batch("[data-project]", {
        start: "top 80%",
        once: true,
        onEnter: context.add("revealProjects", (batch: Element[]) =>
          batch.forEach((el, i) => {
            gsap
              .timeline({ delay: i * 0.12 })
              .to(el.querySelector("[data-project-frame]"), { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "expo.inOut" })
              .from(el.querySelectorAll("[data-project-number], h3, dl, .label"), { y: 20, opacity: 0, stagger: 0.05 }, "-=0.6");
          }),
        ) as (batch: Element[]) => void,
      });
    });
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(refresh); mm.revert(); };
  }, [filter, limit]);

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="gutter relative isolate py-24 sm:py-40">
      <div className="relative z-10 mb-8 flex items-end justify-between gap-6 border-b border-line pb-6">
        <h2 id="work-title" data-work-title className="display text-[clamp(2.25rem,4.6vw,4.75rem)]">
          Trabalhos
          <br />
          Selecionados
        </h2>
        <p className="label pb-2">({String(projects.length).padStart(2, "0")})</p>
      </div>

      <div className="relative z-10 mb-12 flex flex-wrap items-center justify-between gap-5 sm:mb-16">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar trabalhos por formato">
          {([
            { value: "all", label: "Todos" },
            { value: "vertical", label: "Verticais · 9:16" },
            { value: "horizontal", label: "Horizontais · 16:9" },
          ] as const).map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => { setFilter(item.value); setLimit(8); }}
              className={`min-h-11 rounded-lg border px-4 font-mono text-[10px] uppercase tracking-wider transition-colors ${filter === item.value ? "border-white bg-white text-ink" : "border-line text-mute hover:border-white/50 hover:text-white"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p role="status" className="label">{filtered.length} vídeos</p>
      </div>

      {vertical.length > 0 && (
        <div className="relative z-10 mb-20 sm:mb-28">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-tight">Na vertical</h3>
            <p className="label">Reels / Shorts / Redes sociais</p>
          </div>
          <div className="mx-auto grid max-w-sm gap-x-5 gap-y-10 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vertical.map((project) => {
              const index = filtered.findIndex((item) => item.id === project.id);
              return <ProjectCard key={project.id} project={project} index={index} onOpen={() => setOpenIndex(index)} />;
            })}
          </div>
        </div>
      )}

      {horizontal.length > 0 && (
        <div className="relative z-10">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-tight">Em tela aberta</h3>
            <p className="label">Filmes / Campanhas / Histórias</p>
          </div>
          <div className="flex flex-col gap-20 sm:gap-28">
            {horizontal.map((project) => {
              const index = filtered.findIndex((item) => item.id === project.id);
              return <ProjectCard key={project.id} project={project} index={index} onOpen={() => setOpenIndex(index)} />;
            })}
          </div>
        </div>
      )}

      {shown < filtered.length && (
        <div className="mt-16 flex justify-center">
          <button type="button" onClick={() => setLimit((value) => value + 8)} className="min-h-12 rounded-lg border border-line px-8 font-mono text-xs uppercase tracking-wider transition-colors hover:border-accent hover:text-accent">
            Mostrar mais trabalhos ({filtered.length - shown})
          </button>
        </div>
      )}
      {filtered.length === 0 && <p className="py-12 text-mute">Nenhum vídeo neste formato por enquanto.</p>}

      {openIndex !== null && (
        <ProjectModal projects={filtered} index={openIndex} onNavigate={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}
