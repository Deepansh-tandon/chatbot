import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { authService } from '../services/auth';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(phone);
      
      if (response.success && response.data) {
        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
        navigate('/chat');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-[#17181c] rounded-xl border border-[#061622] p-8">
          <h1 className="text-3xl font-bold text-[#e7e9ea] mb-2">Login</h1>
          <p className="text-[#72767a] mb-6">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#1c9cf0] text-white font-semibold hover:bg-[#1a8cd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#72767a]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#1c9cf0] hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-[#72767a] hover:text-[#e7e9ea] text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
