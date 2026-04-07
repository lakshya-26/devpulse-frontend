import { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import Badge from '../ui/Badge.jsx';
import { languageColor } from '../../lib/languageColors.js';

const PAGE = 20;

export default function CommitHistoryTable({ items, repoLanguages }) {
  const [repoFilter, setRepoFilter] = useState('all');
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 300);
  const [sortDir, setSortDir] = useState(/** @type {'desc'|'asc'} */ ('desc'));
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState(null);

  const repos = useMemo(() => {
    const s = new Set();
    (items || []).forEach((c) => s.add(c.repo));
    return ['all', ...[...s].sort()];
  }, [items]);

  const sorted = useMemo(() => {
    let rows = [...(items || [])];
    if (repoFilter !== 'all') {
      rows = rows.filter((c) => c.repo === repoFilter);
    }
    if (debounced.trim()) {
      const q = debounced.toLowerCase();
      rows = rows.filter((c) => (c.message || '').toLowerCase().includes(q));
    }
    rows.sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      return sortDir === 'desc' ? tb - ta : ta - tb;
    });
    return rows;
  }, [items, repoFilter, debounced, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const pageSafe = Math.min(page, totalPages - 1);
  const slice = sorted.slice(pageSafe * PAGE, pageSafe * PAGE + PAGE);

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  async function copySha(sha) {
    try {
      await navigator.clipboard.writeText(sha);
      setCopied(sha);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22]">
      <Tooltip id="sha-tip" className="z-50 !bg-[#1c2128] !text-white" />
      <div className="flex flex-col gap-3 border-b border-[#30363d] p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          value={repoFilter}
          onChange={(e) => {
            setRepoFilter(e.target.value);
            setPage(0);
          }}
          className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-2 text-sm text-white"
        >
          {repos.map((r) => (
            <option key={r} value={r}>
              {r === 'all' ? 'All repos' : r}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Search message…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="min-w-[200px] flex-1 rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#58a6ff] focus:outline-none"
        />
      </div>
      <div className="max-h-[480px] overflow-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-[#161b22] text-xs uppercase tracking-wider text-gray-400">
            <tr className="border-b border-[#30363d]">
              <th className="px-4 py-3">Repo</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  className="text-gray-400 hover:text-white"
                  onClick={() =>
                    setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
                  }
                >
                  Date {sortDir === 'desc' ? '↓' : '↑'}
                </button>
              </th>
              <th className="px-4 py-3">SHA</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((c) => {
              const msg = (c.message || '').split('\n')[0];
              const short = msg.length > 60 ? `${msg.slice(0, 60)}…` : msg;
              const lang = repoLanguages?.[c.repo];
              return (
                <tr
                  key={`${c.sha}-${c.date}`}
                  className="border-b border-[#21262d] text-gray-300 transition hover:bg-[#21262d]"
                >
                  <td className="px-4 py-2 align-top">
                    <span className="font-medium text-white">{c.repo}</span>
                    {lang ? (
                      <div className="mt-1">
                        <Badge color={languageColor(lang)} label={lang} />
                      </div>
                    ) : null}
                  </td>
                  <td
                    className="max-w-xs px-4 py-2 align-top"
                    title={msg}
                  >
                    {short}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 align-top font-mono text-xs text-gray-400">
                    {c.date?.replace('T', ' ').slice(0, 16)}
                  </td>
                  <td className="px-4 py-2 align-top">
                    <button
                      type="button"
                      data-tooltip-id="sha-tip"
                      data-tooltip-content={copied === c.sha ? 'Copied!' : 'Click to copy'}
                      onClick={() => copySha(c.sha)}
                      className="cursor-pointer font-mono text-xs text-[#58a6ff] hover:underline"
                    >
                      {(c.sha || '').slice(0, 7)}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#30363d] px-4 py-3 text-sm text-gray-400">
        <span>
          Page {pageSafe + 1} / {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pageSafe <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded border border-[#30363d] px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={pageSafe >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border border-[#30363d] px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
