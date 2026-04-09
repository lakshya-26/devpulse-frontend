const RANGES = [
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
];

export default function DashboardToolbar({
  range,
  onRange,
  onRefresh,
  loading,
  refreshing,
  compareOn,
  onCompareChange,
}) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 self-end rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-2 text-sm text-gray-300 transition hover:border-[#58a6ff] sm:order-2"
        >
          <svg
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              d="M4 12a8 8 0 018-8M20 12a8 8 0 01-8 8"
            />
          </svg>
          Refresh
        </button>
        <div className="flex flex-wrap justify-end gap-2 sm:order-1">
          {RANGES.map((r) => {
            const sel = r.id === range;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onRange(r.id)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  sel
                    ? 'bg-[#58a6ff] font-semibold text-black'
                    : 'border border-[#30363d] bg-[#21262d] text-gray-400'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:justify-between">
        <span className="text-xs text-gray-500">Compare this period with the one before</span>
        <div
          className="inline-flex rounded-lg border border-[#30363d] bg-[#21262d] p-0.5"
          role="group"
          aria-label="Compare mode"
        >
          <button
            type="button"
            onClick={() => onCompareChange(false)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              !compareOn
                ? 'bg-[#58a6ff] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Off
          </button>
          <button
            type="button"
            onClick={() => onCompareChange(true)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              compareOn
                ? 'bg-[#58a6ff] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            On
          </button>
        </div>
      </div>
    </div>
  );
}
