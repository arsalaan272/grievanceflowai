'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function StaffLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('staffToken', data.token);
      localStorage.setItem('staffInfo', JSON.stringify(data.staff));
      router.push('/staff/dashboard');
    } catch (err) {
      setError('Could not reach the server. Check it is running.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-bg dark:bg-bg-dark overflow-hidden">
      {/* Floating ambient bubbles */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <span className="bubble bg-red-500/20 dark:bg-primary-dark/30" style={{ width: 340, height: 340, left: '-6%', top: '8%', animationDuration: '22s', animationDelay: '0s' }} />
        <span className="bubble bg-secondary/20 dark:bg-secondary-dark/25" style={{ width: 220, height: 220, left: '18%', top: '55%', animationDuration: '18s', animationDelay: '-4s' }} />
        <span className="bubble bg-accent/20 dark:bg-accent-dark/30" style={{ width: 160, height: 160, left: '30%', top: '10%', animationDuration: '16s', animationDelay: '-9s' }} />
        <span className="bubble bg-secondary/20 dark:bg-secondary-dark/20" style={{ width: 300, height: 300, right: '-8%', top: '5%', animationDuration: '26s', animationDelay: '-2s' }} />
        <span className="bubble bg-primary/15 dark:bg-primary-dark/25" style={{ width: 200, height: 200, right: '12%', top: '48%', animationDuration: '20s', animationDelay: '-11s' }} />
        <span className="bubble bg-accent/15 dark:bg-accent-dark/25" style={{ width: 260, height: 260, right: '22%', bottom: '-8%', animationDuration: '24s', animationDelay: '-6s' }} />
        <span className="bubble bg-secondary/10 dark:bg-secondary-dark/15" style={{ width: 140, height: 140, left: '46%', bottom: '10%', animationDuration: '15s', animationDelay: '-13s' }} />
      </div>

      <style jsx>{`
        .bubble {
          position: absolute;
          border-radius: 9999px;
          filter: blur(40px);
          animation-name: floatBubble;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes floatBubble {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(18px, -26px) scale(1.06); }
          50% { transform: translate(-14px, -10px) scale(0.96); }
          75% { transform: translate(-22px, 20px) scale(1.03); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bubble { animation: none; }
        }
        .fade-in {
          animation: fadeInUp 0.6s ease-out both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fade-in { animation: none; }
        }
      `}</style>

      {/* Full-width navbar */}
      <header className="relative z-10 w-full border-b border-border dark:border-border-dark bg-surface/80 dark:bg-surface-dark/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-body text-lg font-bold tracking-tight text-text-primary dark:text-text-primary-dark">
                Grievance<span className="text-primary dark:text-secondary-dark">Flow</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-text-secondary dark:text-text-secondary-dark uppercase mt-0.5">
                Grievance Portal
              </span>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Body: context panel + form panel */}
      <div className="relative z-10 flex-1 flex">
        {/* Context panel */}
        <div className="relative hidden lg:flex lg:w-2/5 overflow-hidden flex-col justify-between p-12 border-r border-border dark:border-border-dark bg-gradient-to-br from-primary-dark/50 via-[#1a1470]/10 to-accent-dark/50">
          <span className="bubble bg-white/10" style={{ width: 220, height: 220, left: '-8%', top: '65%', animationDuration: '19s' }} />
          <span className="bubble bg-secondary-dark/40" style={{ width: 150, height: 150, right: '-6%', top: '10%', animationDuration: '17s', animationDelay: '-6s' }} />
          <div className="relative">
            <p className="text-secondary-dark text-sm font-medium tracking-wide uppercase mb-3">
              Staff portal
            </p>
            <h1 className="text-3xl font-heading font-semibold text-white leading-tight mb-4">
              Grievance resolution,<br />routed to the right desk.
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Complaints are filtered to your category automatically. Unresolved cases escalate on their own after three days.
            </p>
          </div>
          <p className="relative text-slate-400 text-xs">
            Accounts are provisioned by your administrator.
          </p>
        </div>

        {/* Form panel */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="fade-in w-full max-w-sm rounded-2xl border border-border/60 dark:border-border-dark/60 bg-surface/70 dark:bg-surface-dark/60 backdrop-blur-xl shadow-2xl shadow-primary/5 dark:shadow-black/40 p-8">
            <h2 className="text-xl font-heading font-semibold text-text-primary dark:text-text-primary-dark mb-1">
              Sign in
            </h2>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-8">
              Enter your staff credentials to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@college.edu"
                  className="w-full h-10 px-3 rounded-lg border border-border dark:border-border-dark bg-bg/80 dark:bg-bg-dark/60 text-sm text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark outline-none transition-shadow focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-10 px-3 rounded-lg border border-border dark:border-border-dark bg-bg/80 dark:bg-bg-dark/60 text-sm text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark outline-none transition-shadow focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-danger/10 border border-danger/30 dark:border-danger-dark/30 px-3 py-2">
                  <p className="text-sm text-danger dark:text-danger-dark">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover dark:from-primary-dark dark:to-secondary-dark dark:hover:from-primary-dark-hover dark:hover:to-secondary-dark-hover text-white text-sm font-medium disabled:opacity-60 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}