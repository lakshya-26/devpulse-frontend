import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useStats } from '../hooks/useStats.js';
import { useToast } from '../context/ToastContext.jsx';
import { fetchCompareStats } from '../services/analytics.js';
import CompareStatsCard from '../components/dashboard/CompareStatsCard.jsx';
import DashboardShareBanner from '../components/dashboard/DashboardShareBanner.jsx';
import DashboardToolbar from '../components/dashboard/DashboardToolbar.jsx';
import DashboardStatCards from '../components/dashboard/DashboardStatCards.jsx';
import CommitBarChart from '../components/charts/CommitBarChart.jsx';
import LanguagePieChart from '../components/charts/LanguagePieChart.jsx';
import PRTrendLine from '../components/charts/PRTrendLine.jsx';
import { ErrorBoundary } from '../components/ErrorBoundary.jsx';
import { SkeletonChart } from '../components/ui/Skeleton.jsx';

export default function Dashboard() {
  const [range, setRange] = useState(/** @type {'7d'|'30d'|'90d'} */ ('7d'));
  const [compareOn, setCompareOn] = useState(false);
  const [compareData, setCompareData] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { commits, languages, streak, prs, loading, error, refetch } = useStats(range);
  const { pushToast } = useToast();

  useEffect(() => {
    if (!compareOn) {
      setCompareData(null);
      setCompareError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setCompareLoading(true);
      setCompareError(null);
      try {
        const d = await fetchCompareStats(range);
        if (!cancelled) setCompareData(d);
      } catch (e) {
        if (!cancelled) {
          setCompareData(null);
          setCompareError(e.response?.data?.message || e.message || 'Could not load comparison');
        }
      } finally {
        if (!cancelled) setCompareLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [compareOn, range]);

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
        compareOn={compareOn}
        onCompareChange={setCompareOn}
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

      {compareOn ? (
        <CompareStatsCard
          range={range}
          data={compareData}
          loading={compareLoading}
          error={compareError}
        />
      ) : null}

      {loading && !commits && !error ? (
        <div className="mt-8 space-y-8">
          <SkeletonChart height={280} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SkeletonChart height={320} />
            <SkeletonChart height={320} />
          </div>
        </div>
      ) : (
        <>
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-xl border border-[#30363d] bg-[#161b22] p-4 shadow-lg sm:p-6"
          >
            <h2 className="text-lg font-semibold text-white">Commits by day</h2>
            <p className="text-sm text-gray-400">Count per day in the selected range.</p>
            <div className="mt-4">
              <ErrorBoundary>
                <CommitBarChart range={range} commits={commits} />
              </ErrorBoundary>
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
                <ErrorBoundary>
                  <LanguagePieChart languages={languages} />
                </ErrorBoundary>
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
                <ErrorBoundary>
                  <PRTrendLine prs={prs} />
                </ErrorBoundary>
              </div>
            </motion.section>
          </div>
        </>
      )}

      <DashboardShareBanner />
    </div>
  );
}
