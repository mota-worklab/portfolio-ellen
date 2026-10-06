import { ArrowUpRight } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { site } from "../../config/site";
import { visibleSocialLinks } from "../../data/social";
import { PREFILL_EVENT } from "../../lib/events";
import { gsap, MQ } from "../../lib/gsap";
import { revealLines, revealUp } from "../../animations/textReveal";

type Status = "idle" | "sending" | "sent" | "error";

const FIELDS = [
  { name: "name", label: "Nome", type: "text", autoComplete: "name" },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
  { name: "project", label: "Projeto", type: "text", autoComplete: "off" },
] as const;

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const { email, formEndpoint } = site.contact;
  const configured = Boolean(formEndpoint || email);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      revealLines("[data-contact-title]", { trigger: root.current! });
      revealUp("[data-contact-field]", "[data-contact-form]", { stagger: 0.08 });
    });
    return () => mm.revert();
  }, []);

  // Serviços podem pré-preencher o campo "project".
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const input = formRef.current?.elements.namedItem("project") as HTMLInputElement | null;
      if (input) input.value = (e as CustomEvent<string>).detail;
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (formEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus("sent");
        setMessage("Mensagem recebida. Respondo em breve.");
        form.reset();
      } catch {
        setStatus("error");
        setMessage(email ? `Algo deu errado. Escreva direto para ${email}.` : "Algo deu errado. Tente novamente.");
      }
      return;
    }

    if (email) {
      const subject = `Novo projeto — ${data.project || data.name}`;
      const body = `${data.message}\n\n— ${data.name} (${data.email})`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      setMessage("Seu app de e-mail deve abrir com a mensagem pronta para enviar.");
    }
  };

  const inputClass =
    "peer w-full border-0 border-b border-line bg-transparent pb-3 pt-7 text-base text-white outline-none transition-colors placeholder:text-transparent focus:border-accent focus-visible:outline-none sm:text-lg";
  const labelClass =
    "label pointer-events-none absolute left-0 top-7 origin-left transition-all duration-300 peer-focus:top-0 peer-[:not(:placeholder-shown)]:top-0";

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="gutter py-24 sm:py-40">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="contact-title" data-contact-title className="display text-[clamp(2.25rem,4.6vw,4.75rem)]">
            Contato
          </h2>
          <p className="mt-6 max-w-sm text-mute">Conte sobre o projeto — formato, prazo, referências. Respondo todas as mensagens.</p>

          {email && (
            <a href={`mailto:${email}`} className="mt-10 block w-fit border-b border-line pb-1 text-lg transition-colors hover:border-accent">
              {email}
            </a>
          )}

          {visibleSocialLinks.length > 0 && (
            <ul className="mt-12 flex flex-col border-t border-line" aria-label="Redes sociais">
              {visibleSocialLinks.map((link) => (
                <li key={link.id} className="border-b border-line">
                  {link.url ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex min-h-14 items-center justify-between font-display text-lg font-bold uppercase tracking-[-0.02em]"
                    >
                      {link.label}
                      <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="flex min-h-14 items-center justify-between font-display text-lg font-bold uppercase tracking-[-0.02em] text-white/25">
                      {link.label}
                      <span className="label">URL pendente · src/data/social.ts</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          ref={formRef}
          data-contact-form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7"
          aria-describedby={`${id}-status`}
        >
          {FIELDS.map((f) => (
            <div key={f.name} data-contact-field className="relative">
              <input
                id={`${id}-${f.name}`}
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                required={f.name !== "project"}
                placeholder={f.label}
                className={inputClass}
              />
              <label htmlFor={`${id}-${f.name}`} className={labelClass}>
                {f.label}
              </label>
            </div>
          ))}
          <div data-contact-field className="relative">
            <textarea
              id={`${id}-message`}
              name="message"
              required
              rows={4}
              placeholder="Conte mais sobre ele..."
              className={`${inputClass} resize-none`}
            />
            <label htmlFor={`${id}-message`} className={labelClass}>
              Conte mais sobre ele...
            </label>
          </div>

          <div data-contact-field className="mt-6 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              disabled={!configured || status === "sending"}
              className="group inline-flex min-h-14 items-center gap-3 bg-white px-8 font-display text-sm font-extrabold uppercase tracking-[0.04em] text-ink transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "sending" ? "Enviando..." : "Enviar projeto"}
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </button>
            <p id={`${id}-status`} role="status" className={`text-sm ${status === "error" ? "text-accent" : "text-mute"}`}>
              {message}
              {!configured && import.meta.env.DEV && "Formulário desativado: defina site.contact.email ou formEndpoint."}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
