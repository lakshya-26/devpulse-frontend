import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

export default function RepoSparkline({ values }) {
  const data = useMemo(
    () => ({
      labels: values.map((_, i) => i),
      datasets: [
        {
          data: values,
          borderColor: '#58a6ff',
          backgroundColor: 'rgba(88,166,255,0.08)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 1.5,
        },
      ],
    }),
    [values]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false, beginAtZero: true },
      },
    }),
    []
  );

  return (
    <div className="h-[36px] w-[60px]">
      <Line data={data} options={options} />
    </div>
  );
}
