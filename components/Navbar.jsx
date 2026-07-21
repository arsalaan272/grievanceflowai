import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border dark:border-border-dark bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-body text-xl font-bold tracking-tight">
          Grievance<span className="text-primary dark:text-primary-dark">Flow</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="font-body text-sm font-medium text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="font-body text-sm font-medium text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors"
          >
            How it works
          </a>
          <Link
            href="/about"
            className="font-body text-sm font-medium text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors"
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Staff sign-in: login only, no signup */}
          <Link
            href="/staff/login"
            className="font-body text-sm font-medium px-4 py-2 rounded-lg text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:bg-surface dark:hover:bg-surface-dark transition-colors"
          >
            Staff login
          </Link>

          <div className="hidden h-5 w-px bg-border dark:bg-border-dark sm:block" />

          <Link
            href="/login"
            className="font-body text-sm font-medium px-4 py-2 rounded-lg text-text-primary dark:text-text-primary-dark hover:bg-surface dark:hover:bg-surface-dark transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/login?tab=signup"
            className="font-body text-sm font-medium px-4 py-2 rounded-lg bg-primary dark:bg-primary-dark text-white hover:bg-primary-hover dark:hover:bg-primary-dark-hover transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}