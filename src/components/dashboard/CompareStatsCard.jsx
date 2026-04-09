import { SkeletonCard } from '../ui/Skeleton.jsx';

/** @param {'7d'|'30d'|'90d'|string} range */
function compareRangeCopy(range) {
  if (range === '7d') return { current: 'Last 7 days', priorShort: 'prior 7 days' };
  if (range === '30d') return { current: 'Last 30 days', priorShort: 'prior 30 days' };
  if (range === '90d') return { current: 'Last 90 days', priorShort: 'prior 90 days' };
  return { current: 'Last 7 days', priorShort: 'prior 7 days' };
}

function formatDelta(pct) {
  if (!Number.isFinite(pct) || pct === 0) return '0%';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct}%`;
}

function TrendArrow({ value }) {
  if (value > 0)
    return (
      <span className="text-[#3fb950]" aria-hidden>
        ↑
      </span>
    );
  if (value < 0)
    return (
      <span className="text-[#f85149]" aria-hidden>
        ↓
      </span>
    );
  return (
    <span className="text-gray-500" aria-hidden>
      →
    </span>
  );
}

function Metric({ label, value, changePct, vsLabel }) {
  const tone =
    changePct > 0 ? 'text-[#3fb950]' : changePct < 0 ? 'text-[#f85149]' : 'text-gray-500';
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#21262d]/50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-white">{value}</p>
      <p className={`mt-3 flex flex-wrap items-center gap-1.5 text-sm font-medium ${tone}`}>
        <TrendArrow value={changePct} />
        <span>
          {formatDelta(changePct)} <span className="font-normal text-gray-400">vs {vsLabel}</span>
        </span>
      </p>
    </div>
  );
}

export default function CompareStatsCard({ range, data, loading, error }) {
  const { current: curLabel, priorShort } = compareRangeCopy(range || '7d');

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} className="min-h-[140px]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="mt-6 rounded-lg border border-[#f85149] bg-[#161b22] p-3 text-sm text-[#f85149]">
        {error}
      </p>
    );
  }

  if (!data?.current) return null;

  return (
    <div className="mt-6">
      <h2 className="mb-1 text-sm font-semibold text-white">Period comparison</h2>
      <p className="mb-4 text-xs text-gray-500">
        {curLabel} · change vs {priorShort}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric
          label="Commits"
          value={data.current.commits}
          changePct={data.change.commits}
          vsLabel={priorShort}
        />
        <Metric
          label="PRs"
          value={data.current.prs}
          changePct={data.change.prs}
          vsLabel={priorShort}
        />
        <Metric
          label="Active repos"
          value={data.current.activeRepos}
          changePct={data.change.activeRepos}
          vsLabel={priorShort}
        />
      </div>
    </div>
  );
}
