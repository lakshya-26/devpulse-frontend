/**
 * API origin (same value as VITE_API_URL; validated in api.js at startup).
 * @returns {string}
 */
export function getApiOrigin() {
  const v = import.meta.env.VITE_API_URL;
  if (typeof v !== 'string' || v.trim() === '') {
    throw new Error('VITE_API_URL is missing');
  }
  return v.trim().replace(/\/$/, '');
}
