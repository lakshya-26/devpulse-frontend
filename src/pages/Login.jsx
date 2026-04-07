import { getApiOrigin } from '../lib/apiOrigin.js';

export default function Login() {
  const base = getApiOrigin();
  const githubAuthUrl = `${base}/api/v1/auth/github`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full max-w-md rounded-xl border border-[#30363d] bg-[#161b22] p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white">
          <span className="mr-2" aria-hidden>
            ⚡
          </span>
          DevPulse
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          Your GitHub activity, streaks, and daily goals — one dashboard for builders who care about
          craft.
        </p>
        <a
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#30363d] bg-[#21262d] py-3 font-semibold text-white transition hover:border-[#58a6ff]"
          href={githubAuthUrl}
        >
          Continue with GitHub
        </a>
      </div>
    </div>
  );
}
