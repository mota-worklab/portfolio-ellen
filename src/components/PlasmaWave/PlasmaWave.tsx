import { useEffect, useRef } from "react";

type PlasmaWaveProps = {
  mode?: "background" | "card";
};

const TAU = Math.PI * 2;
const styles = `
  .plasma-wave { position: relative; width: 100%; height: 100%; overflow: hidden; background: #080808; color: #fff; }
  .plasma-wave__canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
  .plasma-wave__frame { position: absolute; inset: 0; border: 1px solid rgba(255,255,255,.06); pointer-events: none; }
  .plasma-wave__chrome { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: clamp(20px, 3vw, 42px); pointer-events: none; }
  .plasma-wave__top { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .plasma-wave__meta { margin: 0; font: 500 10px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: .18em; color: rgba(255,255,255,.56); }
  .plasma-wave__live { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
  .plasma-wave__dot { width: 6px; height: 6px; border-radius: 50%; background: #ff3d2e; }
  .plasma-wave__eyebrow { color: #ff6b5e; }
  .plasma-wave__title { margin: 12px 0 0; font: 800 clamp(32px, 8vw, 96px)/.9 Poppins, ui-sans-serif, system-ui, sans-serif; letter-spacing: -.05em; }
  .plasma-wave__rule { height: 1px; margin-top: 24px; background: rgba(255,255,255,.16); }
  .plasma-wave__caption { margin-top: 12px; }
`;

function drawWave(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  index: number,
) {
  const scale = Math.min(width / 1440, height / 900);
  const offset = index - 2;
  const path = new Path2D();
  const step = Math.max(7, Math.round(width / 130));
  const center = height * (0.52 + offset * 0.035);
  const amplitude = Math.min(height * 0.18, 145 * Math.max(scale, 0.5));

  for (let x = -step; x <= width + step; x += step) {
    const progress = x / width;
    const envelope = Math.sin(Math.PI * Math.max(0, Math.min(1, progress)));
    const bend = Math.sin(progress * TAU * 1.15 - time * (0.42 + index * 0.03) + index * 0.5);
    const detail = Math.sin(progress * TAU * 2.4 + time * 0.28 + index * 0.8);
    const y = center + (bend * 0.85 + detail * 0.15) * amplitude * envelope;
    if (x === -step) path.moveTo(x, y);
    else path.lineTo(x, y);
  }

  const red = index === 2;
  context.save();
  context.globalCompositeOperation = "screen";
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = red ? "rgba(255,61,46,0.13)" : "rgba(210,218,226,0.055)";
  context.lineWidth = (red ? 74 : 44) * Math.max(scale, 0.55);
  context.shadowColor = red ? "rgba(255,61,46,0.55)" : "rgba(189,204,220,0.22)";
  context.shadowBlur = red ? 32 * Math.max(scale, 0.55) : 0;
  context.stroke(path);

  context.shadowBlur = red ? 10 * Math.max(scale, 0.55) : 0;
  context.strokeStyle = red ? "rgba(255,92,76,0.42)" : "rgba(218,226,234,0.17)";
  context.lineWidth = (red ? 13 : 8) * Math.max(scale, 0.55);
  context.stroke(path);

  context.shadowBlur = 0;
  context.strokeStyle = red ? "rgba(255,183,172,0.78)" : "rgba(236,240,244,0.48)";
  context.lineWidth = Math.max(1, (red ? 2 : 1.2) * scale);
  context.stroke(path);
  context.restore();
}

export function PlasmaWave({ mode = "background" }: PlasmaWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isCard = mode === "card";

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !stage || !context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motion.matches;
    let visible = true;
    let frame = 0;
    let lastDraw = 0;
    let elapsed = 0;
    let previous = 0;
    let width = 1;
    let height = 1;
    let compact = false;

    const render = (time: number) => {
      if (!visible || document.hidden) return;
      if (time - lastDraw < (compact ? 1000 / 12 : isCard ? 1000 / 16 : 1000 / 20)) {
        frame = requestAnimationFrame(render);
        return;
      }
      elapsed += previous ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      lastDraw = time;
      context.fillStyle = "#080808";
      context.fillRect(0, 0, width, height);

      for (let index = 0; index < (isCard ? 2 : 3); index += 1) {
        drawWave(context, width, height, elapsed, index + 1);
      }
      if (!reduced) frame = requestAnimationFrame(render);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      compact = width < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isCard ? 1 : 1.25, 1600 / width, 1000 / height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      start();
    };
    const onMotionChange = () => {
      reduced = motion.matches;
      start();
    };
    const onVisibilityChange = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(frame);
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(stage);
    resizeObserver.observe(stage);
    motion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isCard]);

  return (
    <div ref={stageRef} className="plasma-wave" aria-label={isCard ? "Plasma Wave: ondas luminosas animadas sobre fundo escuro" : undefined} aria-hidden={!isCard}>
      <style>{styles}</style>
      <canvas ref={canvasRef} className="plasma-wave__canvas" aria-hidden="true" />
      <div className="plasma-wave__frame" aria-hidden="true" />
      {isCard && (
        <div className="plasma-wave__chrome">
          <div className="plasma-wave__top">
            <span className="plasma-wave__meta">Kexsio / Motion studies</span>
            <span className="plasma-wave__meta plasma-wave__live"><span className="plasma-wave__dot" /> Live canvas</span>
          </div>
          <div>
            <p className="plasma-wave__meta plasma-wave__eyebrow">Background / 01</p>
            <h1 className="plasma-wave__title">Plasma Wave</h1>
            <div className="plasma-wave__rule" />
            <p className="plasma-wave__meta plasma-wave__caption">A study in light, rhythm and restraint</p>
          </div>
        </div>
      )}
    </div>
  );
}
