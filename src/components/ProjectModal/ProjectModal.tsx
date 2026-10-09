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
  const portrait = project.format === "vertical";

  // Troca de projeto: corte seco com um flash curto do conteúdo, como um jump cut.
  useLayoutEffect(() => {
    root.current?.closest('[role="dialog"]')?.scrollTo(0, 0);
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-pv-item]", { y: 30, opacity: 0, stagger: 0.05, duration: 0.8 });
    }, root);
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
    <div ref={root} className="gutter mx-auto flex min-h-dvh w-full max-w-[110rem] flex-col gap-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:gap-5 sm:py-5">
      <header className="flex items-center justify-between gap-4 border-b border-line pb-2">
        <p className="label !text-white">
          Projeto {number} <span className="text-white/40">/ {String(total).padStart(2, "0")}</span>
        </p>
        <button type="button" onClick={onClose} data-autofocus className="label flex min-h-11 items-center gap-2 !text-white hover:!text-accent">
          Fechar <span className="hidden text-white/40 sm:inline">ESC</span> <X size={14} aria-hidden="true" />
        </button>
      </header>

      <div data-pv-item className="flex min-w-0 shrink-0 items-center justify-center sm:min-h-0 sm:flex-1" key={project.id}>
        <div className={`relative w-full overflow-hidden rounded-lg bg-black ${portrait ? "aspect-[9/16] max-w-[min(100%,calc(56.25svh_-_6.75rem))] sm:max-w-[max(9rem,calc(56.25dvh_-_6.75rem))]" : project.embedUrl
          ? "aspect-[4/3] min-h-60 sm:aspect-video sm:min-h-0 sm:max-w-[max(16rem,calc(177.78dvh_-_23.11rem))]"
          : "aspect-video sm:max-w-[max(16rem,calc(177.78dvh_-_23.11rem))]"}`}>
          {project.embedUrl ? (
            <iframe
              key={project.embedUrl}
              src={project.embedUrl}
              title={`Assistir ${project.title}`}
              className="absolute inset-0 block h-full w-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : hasVideo(project.video) ? (
            <VideoPlayer source={project.video} title={project.title} format={project.format} fitContainer />
          ) : (
            <LazyVideo
              source={project.preview}
              image={project.thumbnail}
              alt={project.title}
              eager
              placeholder={{ label: `${number} — ${project.title}`, hint: "src/data/projects.ts → video" }}
            />
          )}
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-12 gap-x-4 gap-y-2 sm:gap-x-6">
        <div className="col-span-12 lg:col-span-8">
          {project.category && <p data-pv-item className="label mb-1 sm:mb-2">{project.category}</p>}
          <h2 data-pv-item className="display text-[clamp(1.35rem,3vw,2.75rem)] leading-none">
            {project.title}
          </h2>
          {project.description && (
            <p data-pv-item className="mt-2 max-w-xl text-sm leading-snug text-white/80">
              {project.description}
            </p>
          )}
        </div>

        {(project.role.length > 0 || project.year || project.client) && (
          <dl data-pv-item className="col-span-12 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-2 lg:col-span-4 lg:items-end lg:justify-end lg:border-t-0 lg:pt-0">
            {project.role.length > 0 && (
              <div>
                <dt className="label mb-1">Função</dt>
                {project.role.map((r) => <dd key={r} className="text-sm">{r}</dd>)}
              </div>
            )}
            {(project.year || project.client) && (
              <div>
                {project.year && <><dt className="label mb-1">Ano</dt><dd className="font-mono text-sm tabular-nums">{project.year}</dd></>}
                {project.client && <><dt className="label mb-1 mt-2">Cliente</dt><dd className="text-sm">{project.client}</dd></>}
              </div>
            )}
          </dl>
        )}
      </div>

      <nav aria-label="Navegação entre projetos" className="grid grid-cols-2 items-center gap-2 border-t border-line pt-2 sm:gap-4">
        <button type="button" onClick={() => onNavigate(prev)} className="group flex min-h-11 min-w-0 flex-col items-start justify-center text-left">
          <span className="label flex items-center gap-2 group-hover:!text-accent">
            <ArrowLeft size={12} aria-hidden="true" /> Anterior
          </span>
        </button>
        <button type="button" onClick={() => onNavigate(next)} className="group flex min-h-11 min-w-0 flex-col items-end justify-center text-right">
          <span className="label flex items-center gap-2 group-hover:!text-accent">
            Próximo <ArrowRight size={12} aria-hidden="true" />
          </span>
        </button>
      </nav>
    </div>
  );
}
