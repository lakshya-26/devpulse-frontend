import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import ContributionHeatmap from '../components/stats/ContributionHeatmap.jsx';
import CommitHistoryTable from '../components/stats/CommitHistoryTable.jsx';
import RepoStatsGrid from '../components/stats/RepoStatsGrid.jsx';
import { SkeletonCard, SkeletonHeatmap, SkeletonTable } from '../components/ui/Skeleton.jsx';

const RANGES = [
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
];

export default function Stats() {
  const [range, setRange] = useState(/** @type {'7d'|'30d'|'90d'} */ ('30d'));
  const [contrib, setContrib] = useState(null);
  const [commits, setCommits] = useState(null);
  const [repos, setRepos] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [co, cm, rp] = await Promise.all([
        api.get('/api/v1/stats/contributions', { params: { days: 365 } }),
        api.get('/api/v1/stats/commits', { params: { range } }),
        api.get('/api/v1/stats/repos', { params: { range } }),
      ]);
      setContrib(co.data?.data ?? null);
      setCommits(cm.data?.data ?? null);
      setRepos(rp.data?.data ?? null);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const repoLanguages = {};
  (repos?.repos || []).forEach((r) => {
    repoLanguages[r.name] = r.language;
  });

  return (
    <div className="text-gray-100">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Stats</h1>
          <p className="text-sm text-gray-400">Contribution map, history, and repos.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={`rounded-full px-4 py-1.5 text-sm ${
                range === r.id
                  ? 'bg-[#58a6ff] font-semibold text-black'
                  : 'border border-[#30363d] bg-[#21262d] text-gray-400'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-white">Contributions</h2>
        {loading && !contrib ? (
          <SkeletonHeatmap />
        ) : (
          <ContributionHeatmap byDate={contrib?.byDate} />
        )}
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-white">Commit history</h2>
        {loading && !commits ? (
          <SkeletonTable rows={6} />
        ) : (
          <CommitHistoryTable items={commits?.items} repoLanguages={repoLanguages} />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Repositories</h2>
        {loading && !repos ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <RepoStatsGrid repos={repos?.repos} />
        )}
      </section>
    </div>
  );
}
