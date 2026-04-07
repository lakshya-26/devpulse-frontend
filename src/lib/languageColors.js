/** GitHub-style language colors for charts and badges */
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Other: '#8b949e',
};

export function languageColor(name) {
  if (!name) return LANGUAGE_COLORS.Other;
  return LANGUAGE_COLORS[name] || LANGUAGE_COLORS.Other;
}
