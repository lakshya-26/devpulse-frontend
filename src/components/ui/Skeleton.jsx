export function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-[#30363d] bg-[#161b22] p-5 ${className}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[#21262d]" />
        <div>
          <div className="mb-2 h-3 w-24 rounded bg-[#21262d]" />
          <div className="h-2 w-16 rounded bg-[#21262d]" />
        </div>
      </div>
      <div className="mb-2 h-8 w-16 rounded bg-[#21262d]" />
      <div className="h-2 w-32 rounded bg-[#21262d]" />
    </div>
  );
}

export function SkeletonChart({ height = 200 }) {
  return (
    <div className="animate-pulse rounded-xl border border-[#30363d] bg-[#161b22] p-5">
      <div className="mb-2 h-4 w-32 rounded bg-[#21262d]" />
      <div className="mb-4 h-2 w-48 rounded bg-[#21262d]" />
      <div className="w-full rounded bg-[#21262d]" style={{ height }} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22]">
      <div className="flex gap-4 bg-[#21262d] px-4 py-3">
        {[120, 300, 80, 80].map((w, i) => (
          <div key={i} className="h-3 rounded bg-[#2d333b]" style={{ width: w }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 border-t border-[#21262d] px-4 py-3">
          {[120, 300, 80, 80].map((w, j) => (
            <div key={j} className="h-3 rounded bg-[#21262d]" style={{ width: w }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonHeatmap() {
  return <div className="h-28 w-full animate-pulse rounded-xl bg-[#21262d]" />;
}
