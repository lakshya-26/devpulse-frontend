import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

/**
 * @param {'7d' | '30d' | '90d'} range
 */
export function useStats(range) {
  const [commits, setCommits] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [streak, setStreak] = useState(null);
  const [prs, setPrs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, l, s, p] = await Promise.all([
        api.get('/api/v1/stats/commits', { params: { range } }),
        api.get('/api/v1/stats/languages'),
        api.get('/api/v1/stats/streak'),
        api.get('/api/v1/stats/prs', { params: { range } }),
      ]);
      setCommits(c.data?.data ?? null);
      setLanguages(l.data?.data ?? null);
      setStreak(s.data?.data ?? null);
      setPrs(p.data?.data ?? null);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to load stats';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    commits,
    languages,
    streak,
    prs,
    loading,
    error,
    refetch: fetchAll,
  };
}
