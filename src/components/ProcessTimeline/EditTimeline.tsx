/** Clips da timeline fictícia: [início %, largura %]. */
const TRACKS: { name: string; clips: [number, number][]; tone: string }[] = [
  { name: "V1 Vídeo", clips: [[0, 14], [14, 9], [23, 21], [44, 6], [50, 18], [68, 32]], tone: "bg-white/80" },
  { name: "A1 Áudio", clips: [[0, 100]], tone: "bg-white/35" },
  { name: "A2 SFX", clips: [[8, 4], [22, 3], [43, 8], [66, 5], [80, 14]], tone: "bg-white/20" },
  { name: "T1 Texto", clips: [[4, 12], [52, 14], [84, 16]], tone: "bg-accent/80" },
];

const RULER = ["00:00", "00:05", "00:10", "00:15", "00:20", "00:25"];

/**
 * Timeline de edição ilustrativa. O playhead (`data-playhead`) é animado pela seção
 * Process via ScrollTrigger, acompanhando o scroll.
 */
export function EditTimeline() {
  return (
    <figure className="mt-8 rounded-xl border border-line bg-ink-2 p-3 sm:p-5" aria-label="Ilustração de uma timeline de edição">
      <div className="mb-3 flex items-center justify-between">
        <span className="label">Sequência 01: Final</span>
        <span data-playhead-tc className="font-mono text-[11px] tabular-nums text-accent">
          00:00:00:00
        </span>
      </div>

      <div className="relative" aria-hidden="true">
        <div className="ml-16 flex justify-between border-b border-line pb-1.5 font-mono text-[9px] text-white/35 sm:ml-24">
          {RULER.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className="mt-2 flex flex-col gap-1.5">
          {TRACKS.map((track) => (
            <div key={track.name} className="flex items-center gap-2">
              <span className="w-14 shrink-0 font-mono text-[9px] uppercase tracking-[0.05em] text-white/45 sm:w-22">{track.name}</span>
              <div className="relative h-5 flex-1 bg-white/[0.03] sm:h-7">
                {track.clips.map(([start, width]) => (
                  <span
                    key={start}
                    data-clip
                    className={`absolute inset-y-0 origin-left border-r border-ink ${track.tone}`}
                    style={{ left: `${start}%`, width: `${width}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-16 right-0 sm:left-24">
          <div data-playhead className="absolute -top-1 bottom-0 left-0 w-px bg-accent">
            <span className="absolute -left-[5px] -top-1 size-[11px] rotate-45 bg-accent" />
          </div>
        </div>
      </div>
    </figure>
  );
}
