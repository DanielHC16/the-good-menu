// =============================================================================
// Auth Feature — Login Page
// =============================================================================
// Public route: /login
// Renders a branded login form using the Aboitiz color palette.
// On success, stores the JWT and redirects to the dashboard.
// =============================================================================

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aboitiz-bgLight px-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-aboitiz-textDark">
            🍃 The Good Menu
          </h1>
          <p className="text-sm text-aboitiz-primary mt-2">
            Sign in to your Aboitiz Meal Planner
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-aboitiz-primary/10 shadow-lg p-8">
          <h2 className="text-xl font-semibold text-aboitiz-textDark mb-6">
            Welcome back
          </h2>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-aboitiz-danger/10 border border-aboitiz-danger/20 text-sm text-aboitiz-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-aboitiz-textDark mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-aboitiz-primary/20 bg-white
                           text-aboitiz-textDark placeholder:text-aboitiz-primary/40
                           focus:outline-none focus:ring-2 focus:ring-aboitiz-secondary/50 focus:border-aboitiz-secondary
                           transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-aboitiz-textDark mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-aboitiz-primary/20 bg-white
                           text-aboitiz-textDark placeholder:text-aboitiz-primary/40
                           focus:outline-none focus:ring-2 focus:ring-aboitiz-secondary/50 focus:border-aboitiz-secondary
                           transition-all duration-200"
              />
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white
                         bg-aboitiz-textDark hover:bg-aboitiz-earth
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-aboitiz-primary mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-aboitiz-earth hover:text-aboitiz-textDark transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
