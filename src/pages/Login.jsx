import { DEVPULSE_LOGO_URL } from '../lib/brand.js';
import { getApiOrigin } from '../lib/apiOrigin.js';

function GitHubMark({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function Login() {
  const base = getApiOrigin();
  const githubAuthUrl = `${base}/api/v1/auth/github`;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1117] px-4 py-8">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,rgba(88,166,255,0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,rgba(163,113,247,0.06),transparent_50%)]"
        aria-hidden
      />

      <div className="relative w-full max-w-[22.5rem] sm:max-w-[24rem]">
        <div
          className="relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] px-6 pb-6 pt-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_50px_-12px_rgba(0,0,0,0.55)]"
        >
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#58a6ff]/35 to-transparent"
            aria-hidden
          />

          <div className="flex justify-center">
            <img
              src={DEVPULSE_LOGO_URL}
              alt="DevPulse"
              className="h-[80px] w-[200px] object-contain select-none"
              draggable={false}
            />
          </div>

          <p className="mx-auto mt-4 max-w-[19rem] text-center text-[13px] leading-snug text-[#8b949e] sm:text-sm sm:leading-relaxed">
            Your GitHub activity, streaks, and daily goals — one dashboard for builders who care about
            craft.
          </p>

          <a
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#238636] py-3 text-sm font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.1)_inset] outline-none ring-offset-2 ring-offset-[#161b22] transition hover:bg-[#2ea043] hover:shadow-[0_0_0_1px_rgba(46,160,67,0.4),0_8px_24px_-6px_rgba(35,134,54,0.45)] focus-visible:ring-2 focus-visible:ring-[#58a6ff] active:translate-y-px"
            href={githubAuthUrl}
          >
            <GitHubMark />
            Continue with GitHub
          </a>

          <p className="mt-3 text-center text-[11px] leading-normal text-[#484f58]">
            Secured with GitHub — we never store your GitHub password.
          </p>
        </div>
      </div>
    </div>
  );
}
