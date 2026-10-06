import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Project } from "../../data/projects";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { LazyVideo } from "../VideoPlayer/LazyVideo";

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: () => void;
}

/**
 * Projeto em formato editorial: número, frame grande e ficha técnica.
 * No hover o preview começa a tocar e a ficha se revela.
 */
export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const flip = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  if (project.format === "vertical") {
    return (
      <article data-project className="group/project min-w-0" onPointerEnter={() => setActive(true)} onPointerLeave={() => setActive(false)}>
        <button
          type="button"
          onClick={onOpen}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          data-project-frame
          data-cursor="view"
          aria-label={`Assistir ${project.title} — vídeo vertical`}
          className="relative block aspect-[9/16] w-full overflow-hidden bg-ink-3"
        >
          <LazyVideo source={project.preview} image={project.thumbnail} alt={project.title} mode="hover" active={active && !reduced} placeholder={{ label: project.title }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <span data-project-number className="absolute left-4 top-4 font-mono text-xs text-white/80">{number}</span>
          <span className="absolute right-4 top-4 border border-white/30 bg-black/30 px-2 py-1 font-mono text-[9px] text-white/80">9:16</span>
          <span className="absolute inset-x-4 bottom-4 flex items-center justify-between text-xs font-medium text-white">
            Assistir vídeo <ArrowUpRight size={20} aria-hidden="true" />
          </span>
        </button>
        <p className="label mb-2 mt-5">{project.category}</p>
        <h3 className="font-display text-xl font-extrabold uppercase leading-tight tracking-[-0.03em]">{project.title}</h3>
        <p className="mt-2 text-xs text-mute">{project.role.join(" / ")}</p>
      </article>
    );
  }

  return (
    <article
      data-project
      className="group/project relative grid grid-cols-12 gap-x-4 gap-y-5 transition-opacity duration-500 lg:gap-x-6"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
    >
      <p
        data-project-number
        aria-hidden="true"
        className={`display col-span-12 text-[clamp(2rem,4vw,3.5rem)] text-white/15 lg:text-[clamp(2rem,3vw,3rem)] transition-colors duration-500 group-hover/project:text-accent lg:col-span-1 lg:pt-1 ${flip ? "lg:order-3 lg:text-right" : ""}`}
      >
        {number}
      </p>

      <button
        type="button"
        onClick={onOpen}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        data-cursor="view"
        data-project-frame
        className={`relative col-span-12 aspect-video overflow-hidden bg-ink-3 lg:col-span-8 ${flip ? "lg:order-2" : ""}`}
        aria-label={`Abrir projeto ${number}: ${project.title}`}
      >
        <div className="absolute inset-0 transition-[transform,filter] duration-[1200ms] ease-[var(--ease-out-expo)] group-hover/project:scale-[1.04] group-hover/project:contrast-[1.08] group-hover/project:saturate-[1.1]">
          <LazyVideo
            source={project.preview}
            image={project.thumbnail}
            alt={project.title}
            mode="hover"
            active={active && !reduced}
            placeholder={{ label: `${number} — ${project.title}`, hint: "src/data/projects.ts" }}
          />
        </div>
        <div className="absolute inset-0 bg-ink/25 transition-opacity duration-700 group-hover/project:opacity-0" />
      </button>

      <div className={`col-span-12 flex flex-col lg:col-span-3 ${flip ? "lg:order-1 lg:items-end lg:text-right" : ""}`}>
        <p className="label mb-3">{project.category}</p>
        <h3 className="display text-[clamp(1.5rem,2.4vw,2.5rem)]">
          <button type="button" onClick={onOpen} className="text-left uppercase" tabIndex={-1} data-cursor="view">
            {project.title}
          </button>
        </h3>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 lg:mt-auto lg:grid-cols-1">
          <div>
            <dt className="label mb-1">Função</dt>
            <dd className="text-sm">{project.role.join(" / ")}</dd>
          </div>
          <div>
            <dt className="label mb-1">Ano</dt>
            <dd className="font-mono text-sm tabular-nums">{project.year}</dd>
          </div>
        </dl>

        <p className="mt-4 max-w-sm text-sm text-mute transition-all duration-700 lg:translate-y-2 lg:opacity-0 lg:group-hover/project:translate-y-0 lg:group-hover/project:opacity-100 lg:group-focus-within/project:translate-y-0 lg:group-focus-within/project:opacity-100">
          {project.description}
        </p>
        <span className="label mt-4 flex items-center gap-1.5 !text-white lg:hidden" aria-hidden="true">
          Ver projeto <ArrowUpRight size={12} />
        </span>
      </div>
    </article>
  );
}
