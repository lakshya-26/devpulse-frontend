export function startOfUtcWeek(iso) {
  const d = new Date(iso);
  const dow = (d.getUTCDay() + 6) % 7;
  const s = new Date(d);
  s.setUTCDate(s.getUTCDate() - dow);
  s.setUTCHours(0, 0, 0, 0);
  return s.toISOString().slice(0, 10);
}

export function weekRangeLabel(weekStartIso) {
  const a = new Date(`${weekStartIso}T12:00:00.000Z`);
  const b = new Date(a);
  b.setUTCDate(b.getUTCDate() + 6);
  const o = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  return `${a.toLocaleDateString('en-US', o)}–${b.toLocaleDateString('en-US', o)}`;
}

export function buildPrWeekSeries(items) {
  const opened = {};
  const merged = {};
  (items || []).forEach((pr) => {
    if (pr.createdAt) {
      const w = startOfUtcWeek(pr.createdAt);
      opened[w] = (opened[w] || 0) + 1;
    }
    if (pr.mergedAt) {
      const w = startOfUtcWeek(pr.mergedAt);
      merged[w] = (merged[w] || 0) + 1;
    }
  });
  const keys = [...new Set([...Object.keys(opened), ...Object.keys(merged)])].sort();
  return {
    opened: keys.map((k) => opened[k] || 0),
    merged: keys.map((k) => merged[k] || 0),
    keys,
  };
}
