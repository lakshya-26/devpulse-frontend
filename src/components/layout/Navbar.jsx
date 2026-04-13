import { useEffect, useId, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { DEVPULSE_LOGO_URL } from '../../lib/brand.js';

const navCls = ({ isActive }) =>
  `text-sm font-medium ${isActive ? 'text-[#58a6ff]' : 'text-gray-400 hover:text-white'}`;

const mobileNavCls = ({ isActive }) =>
  `block rounded-lg px-4 py-3 text-base font-medium ${
    isActive ? 'bg-[#21262d] text-[#58a6ff]' : 'text-gray-300 hover:bg-[#21262d] hover:text-white'
  }`;

function MenuIcon({ open }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M18 6L6 18M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-[#30363d] bg-[#0d1117]/80 px-4 backdrop-blur-md sm:px-8 lg:px-12">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-8">
          <NavLink
            to="/dashboard"
            className="flex shrink-0 items-center no-underline"
            aria-label="DevPulse home"
          >
            <img
              src={DEVPULSE_LOGO_URL}
              alt=""
              width={120}
              height={120}
              className="h-11 max-h-[52px] w-auto max-w-[140px] shrink-0 rounded-lg object-contain sm:h-12 sm:max-h-14"
            />
          </NavLink>
          <nav className="hidden items-center gap-5 sm:flex" aria-label="Main">
            <NavLink to="/dashboard" className={navCls}>
              Dashboard
            </NavLink>
            <NavLink to="/stats" className={navCls}>
              Stats
            </NavLink>
            <NavLink to="/goals" className={navCls}>
              Goals
            </NavLink>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#30363d] bg-[#21262d] text-gray-200 transition hover:border-[#58a6ff] hover:text-white sm:hidden"
            aria-expanded={menuOpen}
            aria-controls={panelId}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MenuIcon open={menuOpen} />
          </button>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="hidden h-9 w-9 rounded-full border border-[#30363d] sm:block"
            />
          ) : null}
          <span className="hidden max-w-[120px] truncate text-sm text-gray-300 sm:inline">
            {user?.username || '…'}
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-[#30363d] bg-[#21262d] px-2.5 py-1.5 text-xs text-gray-300 transition hover:border-[#58a6ff] hover:text-white sm:px-3 sm:text-sm"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Mobile slide-over */}
      <div
        className={`fixed inset-0 z-[60] sm:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/60 transition-opacity ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        />
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className={`absolute right-0 top-0 flex h-full w-[min(18rem,88vw)] flex-col border-l border-[#30363d] bg-[#161b22] shadow-2xl transition-transform duration-200 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#30363d] px-4">
            <span className="text-sm font-semibold text-white">Menu</span>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-[#21262d] hover:text-white"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <MenuIcon open />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Mobile main">
            <NavLink to="/dashboard" className={mobileNavCls} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/stats" className={mobileNavCls} onClick={() => setMenuOpen(false)}>
              Stats
            </NavLink>
            <NavLink to="/goals" className={mobileNavCls} onClick={() => setMenuOpen(false)}>
              Goals
            </NavLink>
          </nav>
          {user?.username ? (
            <div className="border-t border-[#30363d] p-4">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-10 w-10 rounded-full border border-[#30363d]"
                  />
                ) : null}
                <p className="truncate text-sm text-gray-300">{user.username}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
