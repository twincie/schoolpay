// src/pages/Login.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
      {/* Card: dark background, white text  */}
      <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          School Portal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-3.5 rounded-lg font-semibold hover:bg-sky-500 transition duration-200 shadow-lg transform hover:scale-105"
          >
            Sign In
          </button>
        </form>

        {/* Optional demo credentials */}
        {/* <p className="text-center text-slate-400 text-sm mt-6">
          Demo: admin@school.com / password123
        </p> */}
      </div>
    </div>
  );
}