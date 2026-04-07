import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.maintainAspectRatio = false;
ChartJS.defaults.backgroundColor = 'transparent';
ChartJS.defaults.color = '#8b949e';
ChartJS.defaults.font.family = 'Inter, system-ui, sans-serif';

// React 19 Strict Mode mounts/unmounts twice in dev; react-chartjs-2 destroys the
// canvas while Chart.js can still be animating, which throws (Animation.tick → _fn).
// Browser extensions that use SES (e.g. MetaMask "lockdown") can also break internals.
ChartJS.defaults.animation = false;
ChartJS.defaults.transitions = {
  active: { animation: { duration: 0 } },
  resize: { animation: { duration: 0 } },
  show: { animation: { duration: 0 } },
  hide: { animation: { duration: 0 } },
};

ChartJS.defaults.scale.grid.color = '#21262d';
ChartJS.defaults.scale.ticks.color = '#8b949e';

ChartJS.defaults.plugins.legend.labels.color = '#8b949e';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#1c2128';
ChartJS.defaults.plugins.tooltip.titleColor = '#ffffff';
ChartJS.defaults.plugins.tooltip.bodyColor = '#ffffff';
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.displayColors = true;
