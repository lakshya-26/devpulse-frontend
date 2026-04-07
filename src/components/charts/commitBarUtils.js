export function utcDateKeysForRange(range) {
  const n = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const keys = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

export function formatBarLabel(iso, range) {
  const d = new Date(`${iso}T12:00:00.000Z`);
  if (range === '7d') {
    return d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function todayUtcKey() {
  return new Date().toISOString().slice(0, 10);
}
