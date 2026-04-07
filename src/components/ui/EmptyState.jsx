export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-[#8b949e]">
      <svg className="mb-4 h-16 w-16 opacity-40" viewBox="0 0 64 64" fill="none" aria-hidden>
        <rect x="8" y="14" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M20 26h24M20 34h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle ? <p className="mt-1 max-w-sm text-sm">{subtitle}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
