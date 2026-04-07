import { useMemo, useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';

function buildValues(byDate, days) {
  const end = new Date();
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - (days - 1));
  const values = [];
  const c = new Date(start);
  while (c.getTime() <= end.getTime()) {
    const key = c.toISOString().slice(0, 10);
    const count = byDate[key] || 0;
    values.push({ date: key, count });
    c.setUTCDate(c.getUTCDate() + 1);
  }
  return values;
}

export default function ContributionHeatmap({ byDate }) {
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    function onResize() {
      setIsNarrow(window.innerWidth < 640);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const days = isNarrow ? 90 : 365;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));

  const values = useMemo(() => buildValues(byDate || {}, days), [byDate, days]);

  function classForValue(v) {
    const c = v?.count || 0;
    if (!c) return 'devpulse-heat-0';
    if (c <= 2) return 'devpulse-heat-1';
    if (c <= 5) return 'devpulse-heat-2';
    if (c <= 9) return 'devpulse-heat-3';
    return 'devpulse-heat-4';
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <Tooltip id="heat-tip" className="z-50 !bg-[#1c2128] !text-white" />
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={classForValue}
        tooltipDataAttrs={(v) =>
          v?.date
            ? {
                'data-tooltip-id': 'heat-tip',
                'data-tooltip-content': `${v.date} — ${v.count} commits`,
              }
            : {}
        }
        showWeekdayLabels
        weekdayLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
      />
    </div>
  );
}
