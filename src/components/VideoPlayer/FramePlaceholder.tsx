interface FramePlaceholderProps {
  label: string;
  /** Dica exibida só em desenvolvimento: onde configurar a mídia. */
  hint?: string;
  tone?: "neutral" | "flat" | "graded";
  className?: string;
}

/**
 * Frame exibido enquanto não há mídia real configurada.
 * Simula um monitor sem sinal: marcas de corte, mira central e slate.
 */
export function FramePlaceholder({ label, hint, tone = "neutral", className = "" }: FramePlaceholderProps) {
  const toneClass =
    tone === "flat"
      ? "bg-[#2a2a2a] text-white/40"
      : tone === "graded"
        ? "bg-[#140b0a] text-white/70"
        : "bg-ink-3 text-white/50";

  return (
    <div className={`crop-marks absolute inset-0 grid place-items-center overflow-hidden ${toneClass} ${className}`} aria-hidden="true">
      {tone === "graded" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgb(255_61_46/0.22),transparent_60%)]" />
      )}
      <div className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 bg-current opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-10 w-px -translate-y-1/2 bg-current opacity-40" />
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.05em]">
        <span>{label}</span>
        {import.meta.env.DEV && hint && <span className="hidden text-right opacity-60 sm:block">{hint}</span>}
      </div>
    </div>
  );
}
