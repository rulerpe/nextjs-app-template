'use client';

import dynamic from 'next/dynamic';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';

// Dynamically import TextList with no SSR
const TextList = dynamic(() => import('./components/TextList'), { ssr: false });

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-8">
      <main>
        {user ? (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
            <TextList />
          </>
        ) : (
          <AuthForm />
        )}
      </main>
    </div>
  );
}
