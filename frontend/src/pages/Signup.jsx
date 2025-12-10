import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { authService } from '../services/auth';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.register(formData);
      
      if (response.success && response.data) {
        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
        navigate('/chat');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-[#17181c] rounded-xl border border-[#061622] p-8">
          <h1 className="text-3xl font-bold text-[#e7e9ea] mb-2">Sign Up</h1>
          <p className="text-[#72767a] mb-6">
            Create a new account to get started
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-[#e7e9ea] mb-2">
                Address (Optional)
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="3"
                className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#061622] text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none focus:border-[#1c9cf0] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#1c9cf0] text-white font-semibold hover:bg-[#1a8cd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#72767a]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#1c9cf0] hover:underline">
                Login
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
