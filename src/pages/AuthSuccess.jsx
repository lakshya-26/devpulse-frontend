import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setToken(token);
      navigate('/dashboard', { replace: true });
      return;
    }

    const existing = localStorage.getItem('devpulse_token');
    if (existing) {
      navigate('/dashboard', { replace: true });
      return;
    }

    navigate('/login', { replace: true });
  }, [navigate, setToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] text-gray-400">
      Syncing your session…
    </div>
  );
}
