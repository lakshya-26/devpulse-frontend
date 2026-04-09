import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function AppShell() {
  return (
    <>
      <Navbar />
      <div className="mx-auto min-h-[calc(100vh-60px)] max-w-7xl bg-[var(--bg-primary,#0d1117)] px-4 pb-12 pt-[76px] sm:px-8 lg:px-12">
        <Outlet />
      </div>
    </>
  );
}
