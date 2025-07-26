import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400">
      <style>
        {`
          .glass-panel {
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.3);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease-in-out;
          }
          .glass-panel:hover {
            box-shadow: 0 16px 48px rgba(31, 38, 135, 0.35);
          }
        `}
      </style>

      <div className="glass-panel p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-extrabold text-white mb-6 tracking-wide">Welcome to the Dashboard!</h1>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
        <p className="mt-4 text-xs text-white/80">&copy; {new Date().getFullYear()} Faheem Admin Dashboard</p>
      </div>
    </div>
  );
};

export default DashboardPage;
