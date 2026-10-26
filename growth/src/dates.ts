export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

/** Inclusive windows ending yesterday (npm download APIs lag by ~1 day). */
export function downloadWindows(reference = new Date()): {
  current7: { start: string; end: string };
  previous7: { start: string; end: string };
  current28: { start: string; end: string };
  previous28: { start: string; end: string };
} {
  const end = addDays(reference, -1);
  const current7Start = addDays(end, -6);
  const previous7End = addDays(current7Start, -1);
  const previous7Start = addDays(previous7End, -6);
  const current28Start = addDays(end, -27);
  const previous28End = addDays(current28Start, -1);
  const previous28Start = addDays(previous28End, -27);

  return {
    current7: { start: toIsoDate(current7Start), end: toIsoDate(end) },
    previous7: { start: toIsoDate(previous7Start), end: toIsoDate(previous7End) },
    current28: { start: toIsoDate(current28Start), end: toIsoDate(end) },
    previous28: { start: toIsoDate(previous28Start), end: toIsoDate(previous28End) },
  };
}

export function isoWeekNumber(date = new Date()): number {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
