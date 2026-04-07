import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navCls = ({ isActive }) =>
  `text-sm font-medium ${isActive ? 'text-[#58a6ff]' : 'text-gray-400 hover:text-white'}`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-[#30363d] bg-[#0d1117]/80 px-4 backdrop-blur-md sm:px-8 lg:px-12">
      <div className="flex items-center gap-8">
        <NavLink to="/dashboard" className="flex items-center gap-1.5 no-underline">
          <span className="text-xl" aria-hidden>
            ⚡
          </span>
          <span className="text-lg font-bold text-white">DevPulse</span>
        </NavLink>
        <nav className="hidden items-center gap-5 sm:flex">
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
      <div className="flex items-center gap-3">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-9 w-9 rounded-full border border-[#30363d]"
          />
        ) : null}
        <span className="hidden text-sm text-gray-300 sm:inline">{user?.username || '…'}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-sm text-gray-300 transition hover:border-[#58a6ff] hover:text-white"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
