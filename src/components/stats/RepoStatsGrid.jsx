import { Link } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';
import RepoSparkline from '../charts/RepoSparkline.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { languageColor } from '../../lib/languageColors.js';
import { formatPushedAgo } from '../../lib/time.js';

export default function RepoStatsGrid({ repos }) {
  const list = Array.isArray(repos) ? repos : [];
  const sorted = [...list].sort((a, b) => (b.commitsInRange || 0) - (a.commitsInRange || 0));

  if (!sorted.length) {
    return (
      <div className="rounded-xl border border-[#30363d] bg-[#161b22]">
        <EmptyState type="repos" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sorted.slice(0, 24).map((r) => (
        <Link
          key={r.fullName || r.name}
          to={`/repo/${encodeURIComponent(r.name)}`}
          className="block rounded-xl border border-[#30363d] bg-[#161b22] p-4 shadow-lg transition hover:border-[#58a6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117]"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-bold text-[#58a6ff]" title={r.name}>
              {r.name}
            </h3>
            <span className="shrink-0 rounded border border-[#30363d] px-2 py-0.5 text-[10px] text-gray-400">
              {r.private ? 'Private' : 'Public'}
            </span>
          </div>
          <div className="mt-2">
            <Badge
              color={languageColor(r.language || 'Other')}
              label={r.language?.trim() ? r.language : 'No primary language'}
            />
          </div>
          <p className="mt-3 text-sm text-gray-400">
            {Number(r.commitsInRange ?? 0)} commits · ⭐ {Number(r.stars ?? 0)}
          </p>
          <p className="text-xs text-gray-500">Pushed {formatPushedAgo(r.pushedAt)}</p>
          <div className="mt-3 flex justify-end">
            <RepoSparkline values={r.sparkWeek || []} />
          </div>
        </Link>
      ))}
    </div>
  );
}
