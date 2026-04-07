import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../context/ToastContext.jsx';
import GoalsStreakBanner from '../components/goals/GoalsStreakBanner.jsx';
import GoalProgressBar from '../components/goals/GoalProgressBar.jsx';

export default function Goals() {
  const { pushToast } = useToast();
  const [targetCommits, setTargetCommits] = useState(5);
  const [targetPrs, setTargetPrs] = useState(2);
  const [targetHours, setTargetHours] = useState(3);
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const [td, hi, st] = await Promise.all([
      api.get('/api/v1/goals/today'),
      api.get('/api/v1/goals/history', { params: { days: 7 } }),
      api.get('/api/v1/stats/streak'),
    ]);
    setToday(td.data?.data);
    setHistory(hi.data?.data);
    setStreak(st.data?.data);
    const g = td.data?.data?.goal;
    if (g) {
      setTargetCommits(Number(g.targetCommits));
      setTargetPrs(Number(g.targetPrs));
      const h = g.targetCodingHours != null ? Number(g.targetCodingHours) : 0;
      setTargetHours(h || 3);
    }
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/v1/goals', {
        targetCommits,
        targetPrs,
        targetHours,
        date: today?.date,
      });
      pushToast('Goals saved!', 'success');
      await load();
    } catch (err) {
      pushToast(err.response?.data?.message || 'Could not save', 'error');
    } finally {
      setLoading(false);
    }
  }

  const g = today?.goal;
  const p = today?.progress;
  const hoursCurrent = p?.hoursToday ?? 0;

  return (
    <div className="text-gray-100">
      <h1 className="text-2xl font-bold text-white">Goals</h1>
      <p className="text-sm text-gray-400">Daily targets (UTC) · progress from GitHub.</p>

      <GoalsStreakBanner commitsToday={p?.commitsToday ?? 0} streak={streak} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 shadow-lg"
        >
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Set Today&apos;s Goals</h2>
            <span aria-hidden>✏️</span>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-gray-400" htmlFor="tc">
                Target commits
              </label>
              <input
                id="tc"
                type="number"
                min={1}
                max={50}
                value={targetCommits}
                onChange={(e) => setTargetCommits(Number(e.target.value))}
                placeholder="e.g. 5"
                className="w-full rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2 text-white focus:border-[#58a6ff] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400" htmlFor="tp">
                Target PRs
              </label>
              <input
                id="tp"
                type="number"
                min={0}
                max={20}
                value={targetPrs}
                onChange={(e) => setTargetPrs(Number(e.target.value))}
                placeholder="e.g. 2"
                className="w-full rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2 text-white focus:border-[#58a6ff] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400" htmlFor="th">
                Target coding hours
              </label>
              <input
                id="th"
                type="number"
                min={0.5}
                max={12}
                step={0.5}
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                placeholder="e.g. 3"
                className="w-full rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2 text-white focus:border-[#58a6ff] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#238636] py-2 font-semibold text-white transition hover:bg-[#2ea043] disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Save goals'}
            </button>
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 shadow-lg"
        >
          <h2 className="mb-4 text-lg font-semibold text-white">
            Today · {today?.date || '—'}
          </h2>
          <GoalProgressBar
            label="commits"
            icon="🔵"
            current={p?.commitsToday}
            target={g?.targetCommits ?? targetCommits}
          />
          <GoalProgressBar
            label="PRs"
            icon="🟣"
            current={p?.prsToday}
            target={g?.targetPrs ?? targetPrs}
          />
          <GoalProgressBar
            label="hours"
            icon="🟡"
            current={hoursCurrent}
            target={g?.targetCodingHours ?? targetHours}
            isHours
          />
        </motion.section>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-white">Past 7 days</h2>
        <div className="overflow-x-auto rounded-xl border border-[#30363d] bg-[#161b22]">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#30363d] text-xs uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Commits goal</th>
                <th className="px-4 py-3">PRs goal</th>
                <th className="px-4 py-3">Met?</th>
              </tr>
            </thead>
            <tbody>
              {(history?.items || []).map((row) => (
                <tr key={row.date} className="border-b border-[#21262d] text-gray-300">
                  <td className="px-4 py-2 font-mono text-xs">{row.date}</td>
                  <td className="px-4 py-2">{row.targetCommits ?? '—'}</td>
                  <td className="px-4 py-2">{row.targetPrs ?? '—'}</td>
                  <td className="px-4 py-2">{row.met == null ? '—' : row.met ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
