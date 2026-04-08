import { motion } from 'framer-motion';

const EMPTY_CONFIGS = {
  commits: {
    emoji: '💻',
    title: 'No commits this week',
    subtitle: 'Get coding! Your streak is waiting. 💪',
    action: { label: 'Open GitHub', href: 'https://github.com' },
  },
  repos: {
    emoji: '📦',
    title: 'No repositories found',
    subtitle: 'Push your first project to GitHub to get started.',
    action: { label: 'Create a repo', href: 'https://github.com/new' },
  },
  prs: {
    emoji: '🔀',
    title: 'No pull requests',
    subtitle: 'Open a PR to see your activity here.',
    action: null,
  },
  goals: {
    emoji: '🎯',
    title: 'No goals set yet',
    subtitle: 'Set your daily targets to track progress.',
    action: null,
  },
  streak: {
    emoji: '🔥',
    title: 'No streak yet',
    subtitle: 'Commit every day to build your streak!',
    action: { label: 'Start today', href: 'https://github.com' },
  },
  languages: {
    emoji: '📚',
    title: 'No language data',
    subtitle: 'Add repositories with a primary language on GitHub.',
    action: { label: 'Open GitHub', href: 'https://github.com' },
  },
};

export function EmptyState({ type = 'commits', title, subtitle, action, onAction = null }) {
  const legacy = title != null;
  const config = legacy
    ? { emoji: '📭', title, subtitle: subtitle || '', action: null }
    : EMPTY_CONFIGS[type] || EMPTY_CONFIGS.commits;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center px-6 py-12 text-center"
    >
      <span className="mb-4 text-5xl">{config.emoji}</span>
      <h3 className="mb-2 text-base font-semibold text-white">{config.title}</h3>
      {config.subtitle ? (
        <p className="mb-5 max-w-xs text-sm text-gray-500">{config.subtitle}</p>
      ) : null}
      {legacy && action ? <div className="mt-1">{action}</div> : null}
      {!legacy && config.action ? (
        <a
          href={config.action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2ea043]"
        >
          {config.action.label} →
        </a>
      ) : null}
      {onAction ? <div className="mt-2">{onAction}</div> : null}
    </motion.div>
  );
}

export default EmptyState;
