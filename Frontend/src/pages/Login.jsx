import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  useEffect(() => {
    if (user) {
      if (redirect) {
        navigate(`/${redirect}`);
      } else {
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success(`Welcome back, ${result.data.name}!`);
    } else {
      toast.error(result.error || 'Login failed.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-beige-light dark:bg-gray-950">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-primary dark:text-emerald-400">Welcome Back</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
            Sign in to access your orders and saved products
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
            <input
              type="email"
              placeholder="e.g. buyer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-sm flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-beige/10 dark:border-gray-800">
          New to GramSetu?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="text-primary dark:text-emerald-400 hover:underline font-semibold"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
