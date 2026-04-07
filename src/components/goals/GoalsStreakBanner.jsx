import { motion } from 'framer-motion';

export default function GoalsStreakBanner({ commitsToday, streak }) {
  const hour = new Date().getHours();
  const late = hour >= 20;
  const s = streak?.currentStreak ?? 0;
  const atRisk = late && commitsToday === 0 && s > 0;

  if (commitsToday > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-xl border border-[#238636] bg-[#0d1f12] p-4"
      >
        <p className="font-semibold text-[#3fb950]">Streak safe! 🎉</p>
        <p className="text-sm text-gray-400">You have commits today — nice work.</p>
      </motion.div>
    );
  }

  if (atRisk) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-4 rounded-xl border border-[#f85149] bg-[#5a1e02] p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex gap-3">
          <span className="animate-pulse text-3xl" aria-hidden>
            🔥
          </span>
          <div>
            <p className="text-lg font-bold text-[#f85149]">Streak at risk!</p>
            <p className="text-sm text-orange-300">
              You haven&apos;t committed today. Your {s}-day streak ends at midnight.
            </p>
          </div>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex justify-center rounded-lg border border-[#f85149] bg-[#161b22] px-4 py-2 text-sm font-semibold text-white transition hover:border-[#58a6ff]"
        >
          Open GitHub →
        </a>
      </motion.div>
    );
  }

  return null;
}
