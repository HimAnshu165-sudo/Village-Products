import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
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

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, role);
    setLoading(false);

    if (result.success) {
      toast.success(`Welcome to GramSetu, ${result.data.name}!`);
    } else {
      toast.error(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-beige-light dark:bg-gray-950">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-primary dark:text-emerald-400">Create Account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
            Register to shop and support rural weavers & potters
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Name</label>
            <input
              type="text"
              placeholder="e.g. Amit Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
            <input
              type="email"
              placeholder="e.g. amit@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
              <input
                type="password"
                placeholder="Min 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Confirm</label>
              <input
                type="password"
                placeholder="Retype password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Register As</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2.5 rounded-xl border text-sm font-semibold transition ${role === 'customer' ? 'bg-primary text-white border-primary dark:bg-emerald-600 dark:border-emerald-600' : 'bg-transparent text-gray-600 border-beige-dark/40 dark:text-gray-400 dark:border-gray-800 hover:bg-beige/10'}`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2.5 rounded-xl border text-sm font-semibold transition ${role === 'admin' ? 'bg-brown text-white border-brown dark:bg-amber-600 dark:border-amber-600' : 'bg-transparent text-gray-600 border-beige-dark/40 dark:text-gray-400 dark:border-gray-800 hover:bg-beige/10'}`}
              >
                Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-sm flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-beige/10 dark:border-gray-800">
          Already have an account?{' '}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
            className="text-primary dark:text-emerald-400 hover:underline font-semibold"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
