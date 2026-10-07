import { ArrowUpRight, Camera, MessageCircle, Phone } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { site } from "../../config/site";
import { visibleSocialLinks } from "../../data/social";
import { gsap, MQ } from "../../lib/gsap";
import { revealLines, revealUp } from "../../animations/textReveal";

function SocialLogo({ id }: { id: string }) {
  const markClass = "grid size-9 shrink-0 place-items-center rounded-lg border border-current/25 text-[0.7em] font-extrabold tracking-[-0.08em]";

  if (id === "whatsapp") {
    return (
      <span className={`${markClass} relative`} aria-hidden="true">
        <MessageCircle size={20} strokeWidth={1.8} />
        <Phone className="absolute" size={9} strokeWidth={2.4} />
      </span>
    );
  }
  if (id === "instagram") return <span className={markClass} aria-hidden="true"><Camera size={19} strokeWidth={1.8} /></span>;
  if (id === "behance") return <span className={markClass} aria-hidden="true">Bē</span>;
  if (id === "vimeo") return <span className={`${markClass} text-lg italic`} aria-hidden="true">v</span>;
  if (id === "linkedin") return <span className={markClass} aria-hidden="true">in</span>;
  return <span className={markClass} aria-hidden="true">↗</span>;
}

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const { email } = site.contact;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      revealLines("[data-contact-title]", { trigger: root.current! });
      revealUp("[data-contact-channel]", root.current!, { stagger: 0.08 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="gutter py-24 sm:py-40">
      <div className="border-t border-line pt-6 sm:pt-8">
       

        <h2 id="contact-title" data-contact-title className="display mt-10 max-w-5xl text-[clamp(3rem,8vw,8.5rem)] sm:mt-14">
          Vamos dar ritmo
          <br />
          à sua ideia.
        </h2>

        <div data-contact-channel className="mt-14 grid overflow-hidden rounded-2xl border border-line bg-ink-2 sm:mt-20 lg:grid-cols-2">
          <div className="flex min-h-80 flex-col justify-between p-6 sm:p-9 lg:order-2">
            <p className="label mb-6">Canais</p>
            <div>
              {email && (
                <a href={`mailto:${email}`} className="group mb-8 inline-flex items-center gap-3 border-b border-white/40 pb-2 font-display text-xl font-extrabold tracking-[-0.03em] transition-colors hover:border-accent hover:text-accent sm:text-2xl">
                  {email}
                  <ArrowUpRight size={20} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              )}
            {visibleSocialLinks.length > 0 && (
              <ul aria-label="Redes sociais">
                {visibleSocialLinks.map((link) => (
                  <li key={link.id} className="border-t border-line last:border-b">
                    {link.url ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex min-h-16 items-center justify-between font-display text-xl font-extrabold tracking-[-0.03em] transition-colors hover:pl-2 hover:text-accent sm:min-h-18 sm:text-2xl"
                      >
                        <span className="flex items-center gap-4">
                          <SocialLogo id={link.id} />
                          {link.label}
                        </span>
                        <ArrowUpRight size={20} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="flex min-h-16 items-center justify-between font-display text-xl font-extrabold tracking-[-0.03em] text-white/25 sm:min-h-18 sm:text-2xl">
                        <span className="flex items-center gap-4">
                          <SocialLogo id={link.id} />
                          {link.label}
                        </span>
                        <span className="label">URL pendente</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            </div>
          </div>

          <figure className="relative min-h-[30rem] overflow-hidden border-t border-line bg-ink-3 sm:min-h-[38rem] lg:order-1 lg:border-r lg:border-t-0">
            <img
              src="/media/contato-ellen-pb.jpg"
              alt="Ellen em retrato em preto e branco"
              width={4000}
              height={6000}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            <figcaption className="label absolute bottom-4 left-4 rounded-md bg-ink/70 px-2 py-1 !text-white backdrop-blur sm:bottom-5 sm:left-5">
              Bastidores
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
