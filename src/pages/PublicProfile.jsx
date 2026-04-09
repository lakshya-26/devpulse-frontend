import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import EmptyState from '../components/ui/EmptyState.jsx';
import { languageColor } from '../lib/languageColors.js';
import { timeAgo } from '../lib/time.js';
import { SkeletonHeatmap } from '../components/ui/Skeleton.jsx';

function profileApiOrigin() {
  const u = import.meta.env.VITE_API_URL;
  return typeof u === 'string' ? u.replace(/\/$/, '') : '';
}

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/u/${username}` : `/u/${username}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const origin = profileApiOrigin();
        if (!origin) throw new Error('Missing API URL');
        const res = await axios.get(
          `${origin}/api/v1/profile/${encodeURIComponent(username || '')}`
        );
        if (!cancelled) setData(res.data?.data ?? res.data);
      } catch (e) {
        if (!cancelled) {
          setErr(e.response?.status === 404 ? 'notfound' : 'error');
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const heatmapValues = useMemo(() => {
    const hm = data?.heatmap || {};
    const end = new Date();
    const start = new Date();
    start.setUTCFullYear(start.getUTCFullYear() - 1);
    const out = [];
    const c = new Date(start);
    while (c.getTime() <= end.getTime()) {
      const key = c.toISOString().slice(0, 10);
      out.push({ date: key, count: hm[key] || 0 });
      c.setUTCDate(c.getUTCDate() + 1);
    }
    return out;
  }, [data]);

  const heatmapTotal = useMemo(
    () => heatmapValues.reduce((s, v) => s + (v.count || 0), 0),
    [heatmapValues]
  );

  function classForValue(v) {
    const c = v?.count || 0;
    if (!c) return 'devpulse-heat-0';
    if (c <= 2) return 'devpulse-heat-1';
    if (c <= 5) return 'devpulse-heat-2';
    if (c <= 9) return 'devpulse-heat-3';
    return 'devpulse-heat-4';
  }

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const joined = data?.joinedDevPulse
    ? new Date(data.joinedDevPulse).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : '—';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] px-4 py-12 text-gray-100">
        <div className="mx-auto max-w-[900px] space-y-6">
          <div className="animate-pulse rounded-xl border border-[#30363d] bg-[#161b22] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="mx-auto h-24 w-24 shrink-0 rounded-full bg-[#21262d] sm:mx-0" />
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className="mx-auto h-8 w-48 rounded bg-[#21262d] sm:mx-0" />
                <div className="mx-auto h-4 w-32 rounded bg-[#21262d] sm:mx-0" />
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-28 rounded-full bg-[#21262d]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <SkeletonHeatmap />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-64 animate-pulse rounded-xl bg-[#21262d]" />
            <div className="h-64 animate-pulse rounded-xl bg-[#21262d]" />
          </div>
        </div>
      </div>
    );
  }

  if (err === 'notfound') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d1117] px-4 text-center">
        <span className="mb-4 text-6xl" aria-hidden>
          👤
        </span>
        <h1 className="text-xl font-semibold text-white">
          No DevPulse profile found for @{username}
        </h1>
        <p className="mt-2 text-sm text-gray-500">They might not have signed up yet.</p>
        <Link
          to="/login"
          className="mt-6 rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2ea043]"
        >
          Create your profile →
        </Link>
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4 text-gray-400">
        Failed to load profile.
      </div>
    );
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setUTCFullYear(startDate.getUTCFullYear() - 1);

  const langRows = data.stats.topLanguages || [];
  const langTotal = langRows.reduce((s, r) => s + (r.count || 0), 0) || 1;

  const cur = data.streak?.current ?? 0;

  return (
    <div className="min-h-screen bg-[#0d1117] px-4 py-12 font-[Inter,system-ui,sans-serif] text-gray-100">
      <div className="mx-auto max-w-[900px] space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 shadow-lg"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt=""
                className="mx-auto h-24 w-24 shrink-0 rounded-full border-2 border-[#58a6ff] object-cover ring-2 ring-[#58a6ff] sm:mx-0"
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-[#58a6ff] bg-[#21262d] ring-2 ring-[#58a6ff] sm:mx-0">
                <span className="text-2xl text-gray-500">@</span>
              </div>
            )}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{data.username}</h1>
              <p className="text-sm text-[#58a6ff]">@{data.username}</p>
              <p className="mt-1 text-sm text-gray-500">On DevPulse since {joined}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-sm ${
                    cur > 0 ? 'border-[#d29922] text-[#d29922]' : 'text-gray-300'
                  }`}
                >
                  🔥 {cur} day streak
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-sm text-gray-300">
                  📦 {data.stats.commitsLast30Days} commits/30d
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-sm text-gray-300">
                  ⭐ {data.streak?.longest ?? 0} day best
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">Contribution Activity</h2>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-gray-400">
              {heatmapTotal} commits
            </span>
          </div>
          <div className="public-profile-heatmap w-full overflow-x-auto rounded-xl border border-[#30363d] bg-[#161b22] p-4">
            <Tooltip id="profile-heat-tip" className="z-50 !bg-[#1c2128] !text-white" />
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={heatmapValues}
              classForValue={classForValue}
              showMonthLabels
              monthLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
              tooltipDataAttrs={(v) =>
                v?.date
                  ? {
                      'data-tooltip-id': 'profile-heat-tip',
                      'data-tooltip-content': `${v.date} — ${v.count} commits`,
                    }
                  : {}
              }
            />
            <p className="mt-2 text-xs text-gray-500">Months shown in UTC grid.</p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span aria-hidden>💠</span>
              Languages
            </h2>
            {langRows.length === 0 ? (
              <EmptyState type="languages" />
            ) : (
              <ul className="space-y-4">
                {langRows.map((row) => {
                  const pct = Math.round(((row.count || 0) / langTotal) * 100);
                  const color = languageColor(row.language);
                  return (
                    <li key={row.language}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-300">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          {row.language}
                        </span>
                        <span className="text-gray-500">{pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#21262d]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
            {!data.stats.recentCommits?.length ? (
              <EmptyState type="commits" />
            ) : (
              <ul className="space-y-4">
                {data.stats.recentCommits.map((c, i) => {
                  const msg = (c.message || '').split('\n')[0];
                  const short = msg.length > 55 ? `${msg.slice(0, 55)}…` : msg;
                  return (
                    <li key={`${c.date}-${i}`} className="border-b border-[#21262d] pb-4 last:border-0">
                      <span className="inline-block rounded bg-[#21262d] px-2 py-0.5 text-xs text-[#58a6ff]">
                        {c.repo}
                      </span>
                      <p className="mt-2 text-sm text-gray-300" title={msg}>
                        {short}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{timeAgo(c.date)}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
          <p className="mb-2 text-sm font-medium text-white">🔗 Share this profile</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              readOnly
              value={shareUrl}
              className="min-w-0 flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-gray-300"
            />
            <button
              type="button"
              onClick={copyShare}
              className="shrink-0 rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm text-white hover:bg-[#30363d]"
            >
              {copied ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
