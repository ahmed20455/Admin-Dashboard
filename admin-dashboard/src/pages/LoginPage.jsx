import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(8px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            transition: box-shadow 0.3s;
          }
          .glass-card:hover {
            box-shadow: 0 16px 48px 0 rgba(31, 38, 135, 0.37);
          }
          .input-focus:focus {
            border-color: #4f8cff;
            box-shadow: 0 0 0 2px #4f8cff33;
          }
          .login-btn {
            background: linear-gradient(90deg, #4f8cff 0%, #38e8ff 100%);
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px rgba(79,140,255,0.15);
          }
          .login-btn:hover {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 4px 16px rgba(79,140,255,0.25);
            background: linear-gradient(90deg, #38e8ff 0%, #4f8cff 100%);
          }
        `}
      </style>

      <div
        className="glass-card p-4 sm:p-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col items-center mx-2"
        style={{
          background: 'linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%)',
          animation: 'gradientMove 8s ease-in-out infinite alternate',
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#4f8cff" />
            <path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-wide">Admin Login</h2>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 px-2 py-1 rounded bg-red-50 border border-red-200 w-full text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-focus w-full border border-gray-300 p-3 rounded-lg bg-white bg-opacity-80 text-gray-900 transition"
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-focus w-full border border-gray-300 p-3 rounded-lg bg-white bg-opacity-80 text-gray-900 transition"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-btn w-full text-white font-bold py-3 rounded-lg text-lg shadow-lg">
            Login
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center">
          &copy; {new Date().getFullYear()} Faheem Admin Dashboard
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
