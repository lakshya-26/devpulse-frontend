import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import { fetchRepoDeepStats } from '../services/analytics.js';
import { languageColor } from '../lib/languageColors.js';
import { SkeletonChart, SkeletonTable } from '../components/ui/Skeleton.jsx';

function formatBytes(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)} KB`;
  return `${n} B`;
}

export default function RepoDetails() {
  const { repoName } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!repoName) return;
    setLoading(true);
    setError(null);
    try {
      const d = await fetchRepoDeepStats(repoName);
      setData(d);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load repository');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [repoName]);

  useEffect(() => {
    load();
  }, [load]);

  const lineData = useMemo(() => {
    const rows = data?.commitsPerDay || [];
    return {
      labels: rows.map((r) => r.date),
      datasets: [
        {
          label: 'Commits',
          data: rows.map((r) => r.count),
          borderColor: '#58a6ff',
          backgroundColor: 'rgba(88,166,255,0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    };
  }, [data]);

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { maxTicksLimit: 12 } },
        y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
      },
    }),
    []
  );

  const langRows = useMemo(() => data?.languages || [], [data?.languages]);
  const doughnutData = useMemo(
    () => ({
      labels: langRows.map((r) => r.language),
      datasets: [
        {
          data: langRows.map((r) => r.bytes),
          backgroundColor: langRows.map((r) => languageColor(r.language)),
          borderColor: '#0d1117',
          borderWidth: 2,
        },
      ],
    }),
    [langRows]
  );

  const doughnutOptions = useMemo(() => {
    const total = langRows.reduce((s, r) => s + (r.bytes || 0), 0) || 1;
    return {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10 } },
        tooltip: {
          callbacks: {
            label(ctx) {
              const v = ctx.raw || 0;
              const pct = Math.round((v / total) * 100);
              return ` ${ctx.label}: ${formatBytes(v)} (${pct}%)`;
            },
          },
        },
      },
    };
  }, [langRows]);

  if (loading && !data) {
    return (
      <div className="text-gray-100">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-[#21262d]" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkeletonChart height={260} />
          <SkeletonChart height={260} />
        </div>
        <div className="mt-8">
          <SkeletonTable rows={6} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-[#f85149] bg-[#161b22] p-6 text-center text-gray-300">
        <p className="text-[#f85149]">{error || 'Repository not found'}</p>
        <Link to="/dashboard" className="mt-4 inline-block text-[#58a6ff] hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="text-gray-100">
      <div className="mb-2">
        <Link
          to="/dashboard"
          className="text-xs font-medium text-[#58a6ff] hover:underline"
        >
          ← Dashboard
        </Link>
      </div>

      <header className="mb-8 rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{data.repoName}</h1>
            <p className="mt-1 font-mono text-sm text-gray-500">{data.fullName}</p>
            {data.description ? (
              <p className="mt-2 max-w-2xl text-sm text-gray-400">{data.description}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-gray-300">
              {data.language || '—'}
            </span>
            <span className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5">
              ⭐ {data.stars ?? 0}
            </span>
            <span className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5">
              Forks {data.forks ?? 0}
            </span>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-gray-500">Commits (90d)</dt>
            <dd className="text-xl font-semibold text-white">{data.totalCommits}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Contributors</dt>
            <dd className="text-xl font-semibold text-white">{data.contributors}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Open PRs</dt>
            <dd className="text-xl font-semibold text-white">{data.openPRs}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Merged PRs</dt>
            <dd className="text-xl font-semibold text-white">{data.mergedPRs}</dd>
          </div>
        </dl>
      </header>

      <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white">Commits per day</h2>
          <p className="text-sm text-gray-400">Last 90 days (UTC).</p>
          <div className="mt-4 h-[260px]">
            {(data.commitsPerDay || []).length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-500">No commits in this window.</p>
            ) : (
              <Line data={lineData} options={lineOptions} />
            )}
          </div>
        </section>
        <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white">Languages</h2>
          <p className="text-sm text-gray-400">By bytes in repo.</p>
          <div className="mx-auto mt-4 flex h-[260px] max-w-sm items-center justify-center">
            {langRows.length === 0 ? (
              <p className="text-sm text-gray-500">No language data.</p>
            ) : (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            )}
          </div>
        </section>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-white">Recent commits</h2>
        <div className="overflow-x-auto rounded-xl border border-[#30363d] bg-[#161b22]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[#30363d] text-xs uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentCommits || []).map((c) => (
                <tr key={`${c.sha}-${c.date}`} className="border-b border-[#21262d] text-gray-300">
                  <td className="max-w-md px-4 py-2">
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#58a6ff] hover:underline"
                      >
                        {c.message || '—'}
                      </a>
                    ) : (
                      c.message
                    )}
                  </td>
                  <td className="px-4 py-2">{c.author || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-gray-500">
                    {c.date?.replace('T', ' ').slice(0, 16)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Pull requests</h2>
        <div className="overflow-x-auto rounded-xl border border-[#30363d] bg-[#161b22]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[#30363d] text-xs uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {(data.prHistory || []).map((p) => (
                <tr key={p.number} className="border-b border-[#21262d] text-gray-300">
                  <td className="px-4 py-2 font-mono text-[#58a6ff]">
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        #{p.number}
                      </a>
                    ) : (
                      `#${p.number}`
                    )}
                  </td>
                  <td className="max-w-md px-4 py-2">{p.title}</td>
                  <td className="px-4 py-2">
                    {p.merged ? (
                      <span className="text-[#3fb950]">merged</span>
                    ) : (
                      <span className="text-gray-400">{p.state}</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-xs text-gray-500">
                    {(p.mergedAt || p.createdAt || '').replace('T', ' ').slice(0, 16)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
