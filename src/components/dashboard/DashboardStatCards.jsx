import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SkeletonCard } from '../ui/Skeleton.jsx';
import Badge from '../ui/Badge.jsx';
import { languageColor } from '../../lib/languageColors.js';
import { todayUtcKey } from '../charts/commitBarUtils.js';

function CardWrap({ delay, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl border border-[#30363d] bg-[#161b22] p-4 shadow-lg transition-colors duration-200 hover:border-[#58a6ff] ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function DashboardStatCards({ loading, commits, streak, languages }) {
  const today = todayUtcKey();
  const y = new Date();
  y.setUTCDate(y.getUTCDate() - 1);
  const yKey = y.toISOString().slice(0, 10);
  const byDate = commits?.byDate ?? {};
  const td = byDate[today] ?? 0;
  const yd = byDate[yKey] ?? 0;
  const delta = td - yd;

  const topLang = languages?.[0];
  const cur = streak?.currentStreak ?? 0;
  const longest = streak?.longestStreak ?? 0;
  const topRepo = commits?.topRepo;

  if (loading && !commits) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <CardWrap delay={0}>
        <div className="flex items-start justify-between">
          <span className="text-2xl" aria-hidden>
            🟢
          </span>
        </div>
        <p className="mt-2 text-4xl font-bold tabular-nums text-white">{td}</p>
        <p className="text-sm text-gray-400">commits today</p>
        <p className={`mt-2 text-sm ${delta >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
          {delta >= 0 ? `+${delta} from yesterday` : `${delta} from yesterday`}
        </p>
      </CardWrap>

      <CardWrap
        delay={0.1}
        className={
          cur === 0
            ? 'border-[#f85149]'
            : cur >= 7
              ? 'shadow-[0_0_20px_rgba(210,153,34,0.3)]'
              : ''
        }
      >
        <div className="flex items-start justify-between">
          <span className="text-2xl" aria-hidden>
            🔥
          </span>
        </div>
        <p className="mt-2 text-4xl font-bold text-[#d29922]">{cur}</p>
        <p className="text-sm text-gray-400">day streak</p>
        <p className="mt-2 text-sm text-gray-500">Best: {longest} days</p>
        {cur === 0 ? (
          <p className="mt-1 text-sm font-medium text-[#f85149]">Start your streak!</p>
        ) : null}
      </CardWrap>

      <CardWrap delay={0.2}>
        <div className="flex items-start justify-between">
          <span className="text-2xl" aria-hidden>
            📁
          </span>
        </div>
        {topRepo ? (
          <>
            <Link
              to={`/repo/${encodeURIComponent(topRepo.name)}`}
              className="mt-2 block truncate text-lg font-bold text-[#58a6ff] transition hover:text-[#79c0ff] hover:underline"
              title={`Open ${topRepo.name} details`}
            >
              {topRepo.name}
            </Link>
            <p className="text-sm text-gray-400">{topRepo.commits} commits this period · tap for deep dive</p>
            <div className="mt-2">
              <Badge
                color={languageColor(topRepo.language)}
                label={topRepo.language || 'Other'}
                size="md"
              />
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No repo activity in range</p>
        )}
      </CardWrap>

      <CardWrap delay={0.3}>
        <div className="flex items-start justify-between">
          <span className="text-2xl text-[#a371f7]" aria-hidden>
            {'</>'}
          </span>
        </div>
        {topLang ? (
          <>
            <p className="mt-2 text-2xl font-bold text-white">{topLang.language}</p>
            <p className="text-sm text-gray-400">used in {topLang.count} repos</p>
            <div
              className="mt-3 h-2 w-2 rounded-full"
              style={{ backgroundColor: languageColor(topLang.language) }}
              aria-hidden
            />
          </>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No languages</p>
        )}
      </CardWrap>
    </div>
  );
}
