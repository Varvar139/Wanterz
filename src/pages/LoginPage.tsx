import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { navigate } from '@/lib/router';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(loginEmail.trim(), loginPassword);
    setLoading(false);
    if (error) setError(error);
    else navigate('/');
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signUp(signupEmail.trim(), signupPassword);
    setLoading(false);
    if (error) setError(error);
    else navigate('/');
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-10 sm:px-6">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {error && (
        <p className="mb-4 w-full max-w-[300px] rounded-xl bg-error-50 px-4 py-3 text-center text-sm font-medium text-error-600 dark:bg-error-500/15 dark:text-error-400">
          {error}
        </p>
      )}

      <div className="flip-wrapper">
        <input type="checkbox" id="flip-toggle" className="flip-toggle" />
        <label htmlFor="flip-toggle" className="flip-slider"></label>
        <span className="flip-card-side"></span>

        <div className="flip-card__inner">
          {/* Front: Log in */}
          <div className="flip-card__front">
            <form className="flip-card__form" onSubmit={handleLogin}>
              <h1 className="flip-title">Log in</h1>
              <input
                type="email"
                className="flip-card__input"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                type="password"
                className="flip-card__input"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="current-password"
              />
              <button type="submit" className="flip-card__btn" disabled={loading}>
                {loading ? '...' : 'Log in'}
              </button>
            </form>
          </div>

          {/* Back: Sign up */}
          <div className="flip-card__back">
            <form className="flip-card__form" onSubmit={handleSignup}>
              <h1 className="flip-title">Sign up</h1>
              <input
                type="email"
                className="flip-card__input"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                type="password"
                className="flip-card__input"
                placeholder="Password (min 6 chars)"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button type="submit" className="flip-card__btn" disabled={loading}>
                {loading ? '...' : 'Sign up'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-ink-400 dark:text-ink-500">
        Flip the switch to toggle between Log in and Sign up.
      </p>
    </div>
  );
}
