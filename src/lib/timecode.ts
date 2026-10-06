const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

/** 84.5 → "01:24" */
export const toClock = (seconds: number) => {
  const s = Math.max(0, seconds || 0);
  return `${pad(s / 60)}:${pad(s % 60)}`;
};

/** 84.5 → "00:01:24:12" (HH:MM:SS:FF a 24 fps) */
export const toTimecode = (seconds: number, fps = 24) => {
  const s = Math.max(0, seconds || 0);
  return `${pad(s / 3600)}:${pad((s / 60) % 60)}:${pad(s % 60)}:${pad((s % 1) * fps)}`;
};
