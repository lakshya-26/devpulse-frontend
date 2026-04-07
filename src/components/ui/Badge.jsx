const sizes = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export default function Badge({ color = '#8b949e', label, size = 'sm' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#30363d] font-medium text-white ${sizes[size] || sizes.sm}`}
      style={{ backgroundColor: `${color}22`, borderColor: `${color}55` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {label}
    </span>
  );
}
