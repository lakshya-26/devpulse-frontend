export function timeAgo(iso) {
  if (!iso) return '—';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '—';
  let diff = Math.floor((Date.now() - t) / 1000);
  if (diff < 60) return 'just now';
  diff = Math.floor(diff / 60);
  if (diff < 60) return `${diff} minute${diff === 1 ? '' : 's'} ago`;
  diff = Math.floor(diff / 60);
  if (diff < 24) return `${diff} hour${diff === 1 ? '' : 's'} ago`;
  diff = Math.floor(diff / 24);
  if (diff < 30) return `${diff} day${diff === 1 ? '' : 's'} ago`;
  const mo = Math.floor(diff / 30);
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`;
  const y = Math.floor(mo / 12);
  return `${y} year${y === 1 ? '' : 's'} ago`;
}

export function formatPushedAgo(iso) {
  if (!iso) return '—';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '—';
  const diff = Date.now() - t;
  const d = Math.floor(diff / 86400000);
  if (d <= 0) return 'today';
  if (d === 1) return '1 day ago';
  return `${d} days ago`;
}
