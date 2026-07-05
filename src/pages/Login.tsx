import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Waves, ShieldCheck, Zap, BarChart3, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0012 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.05H2.18a11 11 0 000 9.9l3.66-2.85z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a10.99 10.99 0 00-9.82 6.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export default function Login() {
  const { loginWithGoogle, isAuthenticating } = useAuth();
  const navigate = useNavigate();

  const [justClicked, setJustClicked] = useState(false);

  const handleLogin = async () => {
    setJustClicked(true);
    await loginWithGoogle();
    navigate('/app');
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-white">
      {/* Left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-ink-950 p-12 text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(74,85,184,0.5), transparent 45%), radial-gradient(circle at 85% 75%, rgba(224,143,46,0.35), transparent 40%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 shadow-pop">
            <Waves className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Flowdesk</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-4xl leading-[1.15] font-medium">
            Every lead, task, and email — one calm workspace.
          </h1>
          <p className="mt-5 text-ink-300 text-base leading-relaxed">
            Flowdesk brings your outreach pipeline together so your team can move fast without
            the busywork.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: BarChart3, text: 'Real-time pipeline visibility across every campaign' },
              { icon: Zap, text: 'Bulk outreach that still feels one-to-one' },
              { icon: ShieldCheck, text: 'Enterprise-grade security, built for growing teams' },
            ].map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-4 w-4 text-accent-300" />
                </span>
                <span className="text-sm text-ink-200">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-2">
            {/* {['1494790108377-be9c29b29330', '1500648767791-00dcc994a43e', '1472099645785-5658abf4ff4e'].map((id) => (
              <img
                key={id}
                src={`https://images.unsplash.com/photo-${id}?w=100&h=100&fit=crop&crop=faces`}
                className="h-9 w-9 rounded-full ring-2 ring-ink-950 object-cover"
                alt="Customer"
              />
            ))} */}
          </div>
          <p className="text-sm text-ink-300">Trusted by many users  worldwide</p>
        </div>
      </div>

      {/* Right — auth panel */}
      <div className="flex items-center justify-center px-6 py-16 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white">
              <Waves className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-semibold text-ink-900">Flowdesk</span>
          </div>

          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-brand-600">
            Welcome back
          </span>
          <h2 className="text-3xl font-semibold text-ink-900">Sign in to your workspace</h2>
          <p className="mt-3 text-sm text-ink-500 leading-relaxed">
            Use your Google account to access leads, campaigns and tasks in one place.
          </p>

          <button
            onClick={handleLogin}
            disabled={isAuthenticating}
            className="mt-9 flex w-full items-center justify-center gap-3 rounded-xl border border-ink-200 bg-white py-3.5 text-sm font-semibold text-ink-800 shadow-soft transition-all hover:border-ink-300 hover:shadow-card active:scale-[0.98] disabled:opacity-70"
          >
            {isAuthenticating && justClicked ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-ink-500" />
                Signing you in...
              </>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          <p className="mt-6 text-center text-xs text-ink-400 leading-relaxed">
            By continuing, you agree to Flowdesk's{' '}
            <span className="text-ink-600 font-medium">Terms of Service</span> and{' '}
            <span className="text-ink-600 font-medium">Privacy Policy</span>.
          </p>

          <div className="mt-10 flex items-center gap-3 text-xs text-ink-400">
            <div className="h-px flex-1 bg-ink-100" />
            No password required
            <div className="h-px flex-1 bg-ink-100" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
