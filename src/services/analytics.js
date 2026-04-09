import api from './api';

/**
 * @param {'7d'|'30d'|'90d'} range
 */
export async function fetchCompareStats(range) {
  const { data } = await api.get('/api/v1/stats/compare', {
    params: { range },
  });
  return data?.data ?? null;
}

/**
 * @param {string} repoName - short repo name
 */
export async function fetchRepoDeepStats(repoName) {
  const { data } = await api.get(`/api/v1/repos/${encodeURIComponent(repoName)}/stats`);
  return data?.data ?? null;
}
