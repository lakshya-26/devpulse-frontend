import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { languageColor } from '../../lib/languageColors.js';

/** Only for the doughnut instance — never register globally or it runs on Bar/Line/Spark and draws "undefined". */
const doughnutCenterPlugin = {
  id: 'devpulseDoughnutCenter',
  beforeDraw(chart) {
    const opts = chart.options.plugins?.devpulseDoughnutCenter;
    if (opts == null || typeof opts.total !== 'number' || !Number.isFinite(opts.total)) {
      return;
    }
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.[0]) return;
    const { x, y } = meta.data[0];
    ctx.save();
    ctx.font = '600 24px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(opts.total), x, y - 8);
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#8b949e';
    const sub = typeof opts.subLabel === 'string' ? opts.subLabel : 'repos';
    ctx.fillText(sub, x, y + 14);
    ctx.restore();
  },
};

export default function LanguagePieChart({ languages }) {
  const rows = Array.isArray(languages) ? languages : [];
  const totalRepos = rows.reduce((s, r) => s + (r.count || 0), 0);

  const data = useMemo(
    () => ({
      labels: rows.map((r) => r.language),
      datasets: [
        {
          data: rows.map((r) => r.count),
          backgroundColor: rows.map((r) => languageColor(r.language)),
          borderColor: '#0d1117',
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    }),
    [rows]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        devpulseDoughnutCenter: {
          total: totalRepos,
          subLabel: 'repos',
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              const v = ctx.raw || 0;
              const pct = totalRepos ? Math.round((v / totalRepos) * 100) : 0;
              return ` ${v} repos (${pct}%)`;
            },
          },
        },
      },
    }),
    [totalRepos]
  );

  if (!rows.length) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-[#8b949e]">
        No language data
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-[280px] w-[280px]">
        <Doughnut data={data} options={options} plugins={[doughnutCenterPlugin]} />
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#8b949e]">
        {rows.map((r) => {
          const pct = totalRepos ? Math.round(((r.count || 0) / totalRepos) * 100) : 0;
          return (
            <span key={r.language} className="inline-flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: languageColor(r.language) }}
                aria-hidden
              />
              <span className="text-white">{r.language}</span>
              <span>{pct}%</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
