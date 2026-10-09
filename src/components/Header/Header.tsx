import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "../../config/site";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { scrollToTarget, useLenis, useScrollLock } from "../SmoothScroll/SmoothScroll";

const NAV = [
  { href: "#about", label: "Sobre" },
  { href: "#work", label: "Trabalhos" },
  { href: "#process", label: "Processo" },
  { href: "#services", label: "Serviços" },
];

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [open, setOpen] = useState(false);

  useScrollLock(open);
  useFocusTrap(menuRef, open, () => setOpen(false));

  // Esconde ao rolar para baixo, mostra ao rolar para cima.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      start: 120,
      end: "max",
      onUpdate: ({ direction }) => gsap.to(el, { yPercent: direction === 1 ? -110 : 0, duration: 0.5, ease: "expo.out" }),
      onLeaveBack: () => gsap.to(el, { yPercent: 0, duration: 0.5 }),
    });
    return () => st.kill();
  }, []);

  const go = (href: string) => {
    setOpen(false);
    // Aguarda o unlock do scroll antes de navegar.
    requestAnimationFrame(() => scrollToTarget(lenis, href));
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] bg-accent px-4 py-2 font-mono text-xs text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>

      <header ref={ref} className="gutter fixed inset-x-0 top-0 z-50 flex items-center justify-between py-5 mix-blend-difference">
        <a
          href="#intro"
          onClick={(e) => {
            e.preventDefault();
            go("#intro");
          }}
          className="group flex items-center gap-2.5 font-display text-sm font-extrabold tracking-[-0.02em]"
          aria-label={`${site.name}: início`}
        >
          <span className="relative size-2 rounded-full bg-white">
            <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:animate-ping group-hover:opacity-60" />
          </span>
          {site.name}
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                go(item.href);
              }}
              className="label !text-white/70 transition-colors hover:!text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              go("#contact");
            }}
            className="label border-b border-white/40 pb-0.5 !text-white hover:border-white"
          >
            Vamos conversar
          </a>
        </nav>

        <button
          type="button"
          className="-mr-2 grid size-11 place-items-center md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <Menu size={20} />
        </button>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="gutter fixed inset-0 z-[60] flex flex-col bg-ink py-5 md:hidden"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-extrabold">{site.name}</span>
          <button type="button" className="-mr-2 grid size-11 place-items-center" onClick={() => setOpen(false)} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>
        <nav aria-label="Menu móvel" className="mt-auto flex flex-col gap-2 pb-16">
          {[...NAV, { href: "#contact", label: "Contato" }].map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                go(item.href);
              }}
              className="display flex items-baseline gap-4 py-1 text-[clamp(2.5rem,11vw,5rem)]"
            >
              <span className="label !text-accent">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
