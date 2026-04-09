import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem('devpulse_token');

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] font-[Inter,system-ui,sans-serif]">
      <Outlet />
    </div>
  );
}
