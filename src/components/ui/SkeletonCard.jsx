export default function SkeletonCard({ height = 'h-24', width = 'w-full', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`animate-pulse bg-[#21262d] ${height} ${width} ${rounded}`}
      aria-hidden
    />
  );
}
