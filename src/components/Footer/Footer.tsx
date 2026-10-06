import { ArrowUp } from "lucide-react";
import { site } from "../../config/site";
import { socialLinks } from "../../data/social";
import { scrollToTarget, useLenis } from "../SmoothScroll/SmoothScroll";

export function Footer() {
  const lenis = useLenis();
  const links = socialLinks.filter((l) => l.url && l.id !== "whatsapp");
  const letters = site.name.split("");

  return (
    <footer className="gutter border-t border-line pb-24 pt-16 sm:pb-28">
      {/* Nome gigante: no hover, cada letra "salta um frame" em sequência. */}
      <button
        type="button"
        onClick={() => scrollToTarget(lenis, "#intro")}
        className="group display mb-16 flex w-full justify-between text-[clamp(3.5rem,16vw,16rem)] leading-[0.8]"
        aria-label={`${site.name} — voltar ao início`}
      >
        {letters.map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-[var(--ease-cut)] group-hover:-translate-y-[0.06em] group-hover:text-accent"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            {ch}
          </span>
        ))}
      </button>

      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        <p className="label">
          © {site.year} {site.name}
        </p>

        <ul className="flex flex-col gap-2" aria-label="Redes sociais">
          {links.map((l) => (
            <li key={l.id}>
              <a href={l.url} target="_blank" rel="noreferrer" className="label !text-white/80 hover:!text-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="label">
          Feito com
          <br />
          <span className="!text-white">paixão + código</span>
        </p>

        <button
          type="button"
          onClick={() => scrollToTarget(lenis, "#intro")}
          className="label flex min-h-11 items-start justify-end gap-2 !text-white hover:!text-accent"
        >
          Voltar ao topo <ArrowUp size={12} aria-hidden="true" />
        </button>
      </div>
      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-mute">
        Vídeos de exemplo: <a href="https://mango.blender.org/" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">Tears of Steel</a>
        {" "}© Blender Foundation · <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">CC BY 3.0</a>.
        {" "}Trechos recortados e adaptados para demonstração; não são trabalhos da Ellen.
      </p>
    </footer>
  );
}
