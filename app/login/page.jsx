'use client';
import { Suspense } from "react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Hash,
  Building2,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // Check if tab parameter is set to 'signup'
    if (searchParams.get('tab') === 'signup') {
      setIsLogin(false);
    }
  }, [searchParams]);

  // Login states
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // Signup states
  const [signupData, setSignupData] = useState({
    nameAadhar: '',
    email: '',
    rollNo: '',
    college: '',
    department: '',
    course: '',
    yearOfStudy: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginData.username, password: loginData.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('student', JSON.stringify(data.student));

      router.push('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Signup failed');
        setLoading(false);
        return;
      }

      setIsLogin(true);
      setError('');
      setSignupData({
        nameAadhar: '',
        email: '',
        rollNo: '',
        college: '',
        department: '',
        course: '',
        yearOfStudy: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Shared icon-prefixed input styling
  const inputWrapClass = 'relative';
  const inputIconClass = 'absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary dark:text-text-secondary-dark pointer-events-none';
  const inputClass = 'w-full bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-text-primary dark:text-text-primary-dark rounded-xl pl-10 pr-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-secondary-dark/50 focus:border-transparent transition-all placeholder-text-secondary/60 dark:placeholder-text-secondary-dark/60';

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark transition-colors">
      {/* Header */}
      <header className="border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-body text-lg font-bold tracking-tight">
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

      {/* Main Content — two-column split on large screens */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-80px)]">

        {/* Left column: badge, heading, supporting copy */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center lg:pr-6"
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary/10 dark:bg-secondary-dark/15 border border-secondary/20 dark:border-secondary-dark/25 px-3.5 py-1.5 text-xs font-semibold text-secondary dark:text-secondary-dark"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Centralized Student Redressal System
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-copy' : 'signup-copy'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary dark:text-text-primary-dark leading-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="font-body text-base text-text-secondary dark:text-text-secondary-dark mt-4 max-w-md">
                {isLogin
                  ? 'Access your personalized dashboard to file and track grievances.'
                  : 'Join GrievanceFlow to raise and track your grievances.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Supporting highlights */}
          <div className="mt-10 space-y-5 max-w-md">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-secondary-dark shrink-0">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-text-primary dark:text-text-primary-dark">Secure by design</p>
                <p className="font-body text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">All submissions are encrypted end-to-end with AES-256.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-secondary/10 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark shrink-0">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-text-primary dark:text-text-primary-dark">Real-time tracking</p>
                <p className="font-body text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">Follow every grievance from submission to resolution.</p>
              </div>
            </div>
          </div>

          <p className="hidden lg:block text-[11px] text-text-secondary/70 dark:text-text-secondary-dark/60 mt-12 font-medium">
            © 2026 GrievanceFlow Student Portal. Protected with AES-256 and SSL security.
          </p>
        </motion.div>

        {/* Right column: toggle + form card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-xl mx-auto lg:mx-0"
        >
          <div className="rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            {/* Gradient Pill Toggle */}
            <div className="relative flex mb-8 rounded-xl bg-bg dark:bg-bg-dark p-1 border border-border dark:border-border-dark">
              <motion.div
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-gradient-to-r from-primary to-secondary shadow-md"
                animate={{ x: isLogin ? 4 : 'calc(100% + 4px)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className={`relative z-10 flex-1 font-body font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer ${
                  isLogin ? 'text-white' : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className={`relative z-10 flex-1 font-body font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer ${
                  !isLogin ? 'text-white' : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-danger/10 dark:bg-danger-dark/10 border border-danger dark:border-danger-dark text-danger dark:text-danger-dark text-sm rounded-lg px-4 py-3 mb-6"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* Login Form */}
              {isLogin && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <motion.div
                      className="space-y-5"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants}>
                        <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-2">
                          Email or Roll Number
                        </label>
                        <div className={inputWrapClass}>
                          <Mail className={inputIconClass} />
                          <input
                            type="text"
                            name="username"
                            value={loginData.username}
                            onChange={handleLoginChange}
                            required
                            placeholder="e.g. arsalaan@college.edu"
                            className={inputClass}
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark">
                            Password
                          </label>
                          <Link
                            href="/forgot-password"
                            className="font-body text-xs font-semibold text-secondary dark:text-secondary-dark hover:underline transition-colors"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <div className={inputWrapClass}>
                          <Lock className={inputIconClass} />
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                            placeholder="Enter your password"
                            className={`${inputClass} pr-11`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors cursor-pointer"
                            aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                          >
                            {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </motion.div>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-body font-bold text-sm uppercase tracking-wide py-3 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {loading ? 'Signing In...' : (
                          <>
                            Sign In Securely <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>
                </motion.div>
              )}

              {/* Signup Form */}
              {!isLogin && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSignupSubmit}>
                    <motion.div
                      className="space-y-5 max-h-[60vh] overflow-y-auto pr-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Row 1 */}
                      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5" variants={itemVariants}>
                        <div>
                          <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-2">
                            Name (as per Aadhar)
                          </label>
                          <div className={inputWrapClass}>
                            <User className={inputIconClass} />
                            <input
                              type="text"
                              name="nameAadhar"
                              value={signupData.nameAadhar}
                              onChange={handleSignupChange}
                              required
                              placeholder="Full name"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-2">
                            Email
                          </label>
                          <div className={inputWrapClass}>
                            <Mail className={inputIconClass} />
                            <input
                              type="email"
                              name="email"
                              value={signupData.email}
                              onChange={handleSignupChange}
                              required
                              placeholder="your.email@example.com"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* Row 2 */}
                      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5" variants={itemVariants}>
                        <div>
                          <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-2">
                            Roll Number
                          </label>
                          <div className={inputWrapClass}>
                            <Hash className={inputIconClass} />
                            <input
                              type="text"
                              name="rollNo"
                              value={signupData.rollNo}
                              onChange={handleSignupChange}
                              required
                              placeholder="Your roll number"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-2">
                            College
                          </label>
                          <div className={inputWrapClass}>
                            <Building2 className={inputIconClass} />
                            <input
                              type="text"
                              name="college"
                              value={signupData.college}
                              onChange={handleSignupChange}
                              required
                              placeholder="Your college"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* Row 3 */}
                      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5" variants={itemVariants}>
                        <div>
                          <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-2">
                            Department
                          </label>
                          <div className={inputWrapClass}>
                            <GraduationCap className={inputIconClass} />
                            <input
                              type="text"
                              name="department"
                              value={signupData.department}
                              onChange={handleSignupChange}
                              required
                              placeholder="Your department"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-2">
                            Course
                          </label>
                          <div className={inputWrapClass}>
                            <BookOpen className={inputIconClass} />
                            <input
                              type="text"
                              name="course"
                              value={signupData.course}
                              onChange={handleSignupChange}
                              required
                              placeholder="Your course"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* Row 4 */}
                      <motion.div variants={itemVariants}>
                        <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-2">
                          Year of Study
                        </label>
                        <div className={inputWrapClass}>
                          <CalendarDays className={inputIconClass} />
                          <select
                            name="yearOfStudy"
                            value={signupData.yearOfStudy}
                            onChange={handleSignupChange}
                            required
                            className={`${inputClass} appearance-none cursor-pointer`}
                          >
                            <option value="">Select year of study</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
                        </div>
                      </motion.div>

                      {/* Row 5 */}
                      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5" variants={itemVariants}>
                        <div>
                          <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-2">
                            Password
                          </label>
                          <div className={inputWrapClass}>
                            <Lock className={inputIconClass} />
                            <input
                              type={showSignupPassword ? 'text' : 'password'}
                              name="password"
                              value={signupData.password}
                              onChange={handleSignupChange}
                              required
                              placeholder="Create a password"
                              className={`${inputClass} pr-11`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignupPassword(!showSignupPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors cursor-pointer"
                              aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                            >
                              {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block font-body text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-2">
                            Confirm Password
                          </label>
                          <div className={inputWrapClass}>
                            <Lock className={inputIconClass} />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={signupData.confirmPassword}
                              onChange={handleSignupChange}
                              required
                              placeholder="Confirm your password"
                              className={`${inputClass} pr-11`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors cursor-pointer"
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-body font-bold text-sm uppercase tracking-wide py-3 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {loading ? 'Creating Account...' : (
                          <>
                            Create Account <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer line — mobile only, since the desktop version lives in the left column */}
          <p className="lg:hidden text-center text-[11px] text-text-secondary/70 dark:text-text-secondary-dark/60 mt-6 font-medium">
            © 2026 GrievanceFlow Student Portal. Protected with AES-256 and SSL security.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark">
        <p className="text-text-secondary dark:text-text-secondary-dark">Loading...</p>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
} 