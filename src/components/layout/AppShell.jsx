import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function AppShell() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-[76px] sm:px-8 lg:px-12">
        <Outlet />
      </div>
    </>
  );
}
