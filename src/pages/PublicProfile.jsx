import { useParams } from 'react-router-dom';

export default function PublicProfile() {
  const { username } = useParams();

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-300">
      <h1 className="text-xl font-bold text-white">@{username}</h1>
      <p className="mt-2 text-sm text-gray-400">
        Public profiles are not available yet. Sign in to view your private dashboard.
      </p>
    </div>
  );
}
