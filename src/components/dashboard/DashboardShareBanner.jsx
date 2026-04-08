import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function DashboardShareBanner() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [copied, setCopied] = useState(false);

  const username = user?.username;
  if (!username) return null;

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/u/${encodeURIComponent(username)}`
      : `/u/${username}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      pushToast('Profile link copied', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      pushToast('Could not copy', 'error');
    }
  }

  return (
    <div className="mt-10 rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <p className="text-sm font-medium text-white">Public profile</p>
      <p className="mt-1 text-xs text-gray-500">
        Anyone with this link can see your DevPulse stats (no login). Share it on your resume,
        bio, or socials.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          readOnly
          value={shareUrl}
          className="min-w-0 flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-xs text-gray-300 sm:text-sm"
        />
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#30363d]"
          >
            {copied ? 'Copied! ✓' : 'Copy'}
          </button>
          <Link
            to={`/u/${encodeURIComponent(username)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#58a6ff]/40 bg-[#58a6ff]/10 px-3 py-2 text-center text-sm font-medium text-[#58a6ff] transition hover:bg-[#58a6ff]/20"
          >
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
