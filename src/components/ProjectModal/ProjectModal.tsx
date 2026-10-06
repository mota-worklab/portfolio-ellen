import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { Project } from "../../data/projects";
import { gsap } from "../../lib/gsap";
import { hasVideo } from "../../lib/media";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Overlay } from "../Overlay/Overlay";
import { LazyVideo } from "../VideoPlayer/LazyVideo";
import { VideoPlayer } from "../VideoPlayer/VideoPlayer";

interface ProjectModalProps {
  projects: Project[];
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

export function ProjectModal({ projects, index, onNavigate, onClose }: ProjectModalProps) {
  return (
    <Overlay label={`Projeto: ${projects[index].title}`} onClose={onClose}>
      {(close) => <ProjectView projects={projects} index={index} onNavigate={onNavigate} onClose={close} />}
    </Overlay>
  );
}

function ProjectView({ projects, index, onNavigate, onClose }: ProjectModalProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const project = projects[index];
  const total = projects.length;
  const prev = (index - 1 + total) % total;
  const next = (index + 1) % total;
  const number = String(index + 1).padStart(2, "0");

  // Troca de projeto: corte seco com um flash curto do conteúdo, como um jump cut.
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-pv-item]", { y: 30, opacity: 0, stagger: 0.05, duration: 0.8 });
    }, root);
    root.current?.closest("[role='dialog']")?.scrollTo({ top: 0 });
    return () => ctx.revert();
  }, [index, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("video, [role='slider'], input, textarea")) return;
      if (e.key === "ArrowRight" && e.shiftKey) onNavigate(next);
      if (e.key === "ArrowLeft" && e.shiftKey) onNavigate(prev);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev, onNavigate]);

  return (
    <div ref={root} className="gutter pb-10 pt-5">
      <header className="sticky top-0 z-10 -mx-[clamp(1rem,4vw,3.5rem)] flex items-center justify-between bg-ink/85 px-[clamp(1rem,4vw,3.5rem)] py-3 backdrop-blur">
        <p className="label !text-white">
          Projeto {number} <span className="text-white/40">/ {String(total).padStart(2, "0")}</span>
        </p>
        <button type="button" onClick={onClose} data-autofocus className="label flex min-h-11 items-center gap-2 !text-white hover:!text-accent">
          Fechar <span className="hidden text-white/40 sm:inline">ESC</span> <X size={14} aria-hidden="true" />
        </button>
      </header>

      <div data-pv-item className="mt-4" key={project.id}>
        {hasVideo(project.video) ? (
          <VideoPlayer source={project.video} title={project.title} format={project.format} />
        ) : (
          <div className={`relative overflow-hidden bg-ink-3 ${project.format === "vertical" ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video"}`}>
            <LazyVideo
              source={project.preview}
              image={project.thumbnail}
              alt={project.title}
              eager
              placeholder={{ label: `${number} — ${project.title}`, hint: "src/data/projects.ts → video" }}
            />
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10 sm:mt-16">
        <div className="col-span-12 lg:col-span-7">
          <p data-pv-item className="label mb-4">
            {project.category}
          </p>
          <h2 data-pv-item className="display text-[clamp(2.25rem,4.6vw,4.75rem)]">
            {project.title}
          </h2>
          <p data-pv-item className="mt-8 max-w-xl text-base leading-relaxed sm:text-[1.0625rem] text-white/80">
            {project.description}
          </p>
        </div>

        <dl data-pv-item className="col-span-12 grid grid-cols-2 content-start gap-8 border-t border-line pt-6 lg:col-span-4 lg:col-start-9">
          <div>
            <dt className="label mb-3">Função</dt>
            {project.role.map((r) => (
              <dd key={r} className="text-base">
                {r}
              </dd>
            ))}
          </div>
          <div>
            <dt className="label mb-3">Ano</dt>
            <dd className="font-mono tabular-nums">{project.year}</dd>
            {project.client && (
              <>
                <dt className="label mb-3 mt-8">Cliente</dt>
                <dd>{project.client}</dd>
              </>
            )}
          </div>
        </dl>
      </div>

      {project.additionalMedia && project.additionalMedia.length > 0 && (
        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {project.additionalMedia.map((m, i) => (
            <div key={i} className={`relative aspect-video overflow-hidden bg-ink-3 ${i % 3 === 0 ? "sm:col-span-2" : ""}`}>
              <LazyVideo
                source={typeof m.src === "string" ? undefined : m.src}
                image={typeof m.src === "string" ? m.src : undefined}
                alt={m.alt}
                placeholder={{ label: `Mídia ${i + 1}` }}
              />
            </div>
          ))}
        </div>
      )}

      <nav aria-label="Navegação entre projetos" className="mt-20 grid grid-cols-2 border-t border-line pt-6">
        <button type="button" onClick={() => onNavigate(prev)} className="group flex min-h-11 flex-col items-start gap-2 text-left">
          <span className="label flex items-center gap-2 group-hover:!text-accent">
            <ArrowLeft size={12} aria-hidden="true" /> Anterior
          </span>
          <span className="display text-[clamp(1.125rem,2vw,1.75rem)] text-white/60 transition-colors group-hover:text-white">
            {projects[prev].title}
          </span>
        </button>
        <button type="button" onClick={() => onNavigate(next)} className="group flex min-h-11 flex-col items-end gap-2 text-right">
          <span className="label flex items-center gap-2 group-hover:!text-accent">
            Próximo <ArrowRight size={12} aria-hidden="true" />
          </span>
          <span className="display text-[clamp(1.125rem,2vw,1.75rem)] text-white/60 transition-colors group-hover:text-white">
            {projects[next].title}
          </span>
        </button>
      </nav>
    </div>
  );
}
