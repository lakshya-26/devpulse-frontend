import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { buildPrWeekSeries, weekRangeLabel } from '../../lib/prWeekUtils.js';
import EmptyState from '../ui/EmptyState.jsx';

export default function PRTrendLine({ prs, heightClass = 'h-[250px] sm:h-[300px]' }) {
  const items = prs?.items;
  const { labels, opened, merged, keys } = useMemo(() => {
    const s = buildPrWeekSeries(items);
    return {
      ...s,
      labels: s.keys.map(weekRangeLabel),
    };
  }, [items]);
  const empty = !keys.length;

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Opened PRs',
          data: opened,
          borderColor: '#58a6ff',
          backgroundColor: 'rgba(88,166,255,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#58a6ff',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
        {
          label: 'Merged PRs',
          data: merged,
          borderColor: '#3fb950',
          backgroundColor: 'rgba(63,185,80,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#3fb950',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
      ],
    }),
    [labels, opened, merged]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { usePointStyle: true },
        },
      },
      scales: {
        x: { grid: { color: '#21262d' } },
        y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
      },
    }),
    []
  );

  if (empty) {
    return (
      <EmptyState
        title="No PRs in this period"
        subtitle="Activity will appear when you open or merge pull requests."
      />
    );
  }

  return (
    <div className={heightClass}>
      <Line data={data} options={options} />
    </div>
  );
}
