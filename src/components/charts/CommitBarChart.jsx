import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import EmptyState from '../ui/EmptyState.jsx';
import { formatBarLabel, todayUtcKey, utcDateKeysForRange } from './commitBarUtils.js';

export default function CommitBarChart({ range, commits, heightClass = 'h-[250px] sm:h-[300px]' }) {
  const total = commits?.total ?? 0;
  const showEmpty = commits != null && total === 0;

  const byDate = commits?.byDate ?? {};
  const byDateMessages = commits?.byDateMessages ?? {};
  const today = todayUtcKey();

  const { labels, data, todayIndex } = useMemo(() => {
    const keys = utcDateKeysForRange(range);
    return {
      labels: keys.map((k) => formatBarLabel(k, range)),
      data: keys.map((k) => byDate[k] || 0),
      todayIndex: keys.indexOf(today),
    };
  }, [range, byDate, today]);

  const maxVal = useMemo(() => Math.max(0, ...data), [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title(items) {
              const i = items[0]?.dataIndex ?? 0;
              const keys = utcDateKeysForRange(range);
              return keys[i] ? String(keys[i]) : '';
            },
            afterBody(items) {
              const i = items[0]?.dataIndex ?? 0;
              const keys = utcDateKeysForRange(range);
              const key = keys[i];
              const msgs = byDateMessages[key];
              if (!msgs?.length) return '';
              return ['', ...msgs.map((m) => `• ${m}`)];
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          suggestedMax: maxVal < 4 ? 4 : maxVal + 1,
          ticks: { stepSize: 1, precision: 0 },
        },
      },
    }),
    [range, byDateMessages, maxVal]
  );

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Commits',
          data,
          backgroundColor(context) {
            const i = context.dataIndex;
            if (i === todayIndex) return '#3fb950';
            const chart = context.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return '#58a6ff';
            const g = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            g.addColorStop(0, '#1f6feb');
            g.addColorStop(1, '#58a6ff');
            return g;
          },
          hoverBackgroundColor(context) {
            const i = context.dataIndex;
            return i === todayIndex ? '#3fb950' : '#79c0ff';
          },
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    }),
    [labels, data, todayIndex]
  );

  if (showEmpty) {
    return <EmptyState type="commits" />;
  }

  return (
    <div className={heightClass}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
