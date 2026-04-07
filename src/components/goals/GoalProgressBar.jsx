import { motion } from 'framer-motion';

export default function GoalProgressBar({ label, icon, current, target, isHours }) {
  const t = target > 0 ? target : 1;
  const pct = Math.min(100, Math.round(((current || 0) / t) * 100));
  const color =
    pct >= 100 ? 'bg-[#3fb950]' : pct >= 50 ? 'bg-[#58a6ff]' : 'bg-[#d29922]';

  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-300">
          {icon} {label}
        </span>
        <span className="text-gray-500">{pct}%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2.5 flex-1 rounded-full bg-[#21262d]">
          <motion.div
            className={`h-2.5 rounded-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {current ?? 0} / {target} {isHours ? 'hrs' : label.toLowerCase()}
      </p>
    </div>
  );
}
