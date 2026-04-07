import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useStats } from '../hooks/useStats.js';
import { useToast } from '../context/ToastContext.jsx';
import DashboardToolbar from '../components/dashboard/DashboardToolbar.jsx';
import DashboardStatCards from '../components/dashboard/DashboardStatCards.jsx';
import CommitBarChart from '../components/charts/CommitBarChart.jsx';
import LanguagePieChart from '../components/charts/LanguagePieChart.jsx';
import PRTrendLine from '../components/charts/PRTrendLine.jsx';

export default function Dashboard() {
  const [range, setRange] = useState(/** @type {'7d'|'30d'|'90d'} */ ('7d'));
  const [refreshing, setRefreshing] = useState(false);
  const { commits, languages, streak, prs, loading, error, refetch } = useStats(range);
  const { pushToast } = useToast();

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await api.post('/api/v1/stats/refresh');
      await refetch();
      pushToast('Data refreshed!', 'success');
    } catch {
      pushToast('Could not refresh', 'error');
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="min-h-screen text-gray-100">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-400">Activity from GitHub for your repos.</p>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-500">
          Data is cached on the server after it is fetched from the live GitHub API to reduce API
          usage. It expires automatically after a short time. Use{' '}
          <span className="text-gray-400">Refresh</span> to clear that cache and pull the latest
          activity from GitHub immediately.
        </p>
      </div>

      <DashboardToolbar
        range={range}
        onRange={setRange}
        onRefresh={handleRefresh}
        loading={loading}
        refreshing={refreshing}
      />

      {error ? (
        <p className="mb-4 rounded-lg border border-[#f85149] bg-[#161b22] p-3 text-sm text-[#f85149]">
          {error}
        </p>
      ) : null}

      <DashboardStatCards
        loading={loading}
        commits={commits}
        streak={streak}
        languages={languages}
      />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-xl border border-[#30363d] bg-[#161b22] p-4 shadow-lg sm:p-6"
      >
        <h2 className="text-lg font-semibold text-white">Commits by day</h2>
        <p className="text-sm text-gray-400">Count per day in the selected range.</p>
        <div className="mt-4">
          <CommitBarChart range={range} commits={commits} />
        </div>
      </motion.section>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 shadow-lg sm:p-6"
        >
          <h2 className="text-lg font-semibold text-white">Languages</h2>
          <p className="text-sm text-gray-400">Share of repositories by primary language.</p>
          <div className="mt-4 flex justify-center">
            <LanguagePieChart languages={languages} />
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 shadow-lg sm:p-6"
        >
          <h2 className="text-lg font-semibold text-white">Pull requests</h2>
          <p className="text-sm text-gray-400">Opened vs merged per week.</p>
          <div className="mt-4">
            <PRTrendLine prs={prs} />
          </div>
        </motion.section>
      </div>
    </div>
  );
}
