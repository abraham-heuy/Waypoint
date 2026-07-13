import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/primitives';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const signup = useAuthStore((s) => s.signup);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    const ok = await signup(name, email, password);
    if (ok) navigate('/onboarding');
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="inline-block text-xs font-mono uppercase tracking-widest text-dispatch-accent border border-dispatch-accentDim rounded-full px-3 py-1 mb-5">
          Free to start
        </div>
        <h1 className="text-2xl font-bold mb-2">Let's set up your first route.</h1>
        <p className="text-dispatch-dim text-sm mb-8">Takes about a minute. No card required.</p>

        {/* Error displayed at the top, yellow theme */}
        {error && (
          <div className="mb-6 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 p-3 text-sm text-yellow-800 dark:text-yellow-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Steve Laading"
            autoComplete="name"
          />
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="laading@example.com"
            autoComplete="email"
          />
          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters with a letter and a number"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-dispatch-dim hover:text-dispatch-text transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M21 3L3 21" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <Button type="submit" size="lg" loading={loading} className="w-full">
            Create account
          </Button>
        </form>
        <p className="text-xs text-dispatch-dim mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-dispatch-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}