"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  Workflow,
  Info,
  ShieldCheck,
  LogIn,
  UserPlus,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAboutPage = pathname === "/about";

  return (
    <header className="border-b border-border dark:border-border-dark bg-surface dark:bg-bg-dark">
      <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
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

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {isAboutPage ? (
            <Link
              href="/"
              className="font-body text-sm font-medium text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors"
            >
              Home
            </Link>
          ) : (
            <>
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
            </>
          )}
          <Link
            href="/about"
            className="font-body text-sm font-medium text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors"
          >
            About
          </Link>
        </div>

        {/* Desktop right-side actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/staff/login"
            className="font-body text-sm font-medium px-4 py-2 rounded-lg text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:bg-surface dark:hover:bg-surface-dark transition-colors whitespace-nowrap"
          >
            Staff login
          </Link>

          <div className="h-5 w-px bg-border dark:bg-border-dark" />

          <Link
            href="/login"
            className="font-body text-sm font-medium px-4 py-2 rounded-lg text-text-primary dark:text-text-primary-dark hover:bg-surface dark:hover:bg-surface-dark transition-colors whitespace-nowrap"
          >
            Log in
          </Link>
          <Link
            href="/login?tab=signup"
            className="font-body text-sm font-medium px-4 py-2 rounded-lg bg-primary dark:bg-primary-dark text-white hover:bg-primary-hover dark:hover:bg-primary-dark-hover transition-colors whitespace-nowrap"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile / tablet controls: theme toggle + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-lg p-2 text-text-primary dark:text-text-primary-dark hover:bg-surface dark:hover:bg-surface-dark transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu — animated with Framer Motion so it doesn't rely on
          a Tailwind arbitrary-value class (max-h-[28rem]) being present in the build */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 border-t border-border dark:border-border-dark bg-bg dark:bg-bg-dark px-4 py-4">
              {isAboutPage ? (
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 font-body text-sm font-medium text-text-primary dark:text-text-primary-dark px-2 py-2 rounded-lg hover:bg-surface dark:hover:bg-surface-dark transition-colors"
                >
                  <Home size={18} className="shrink-0" />
                  Home
                </Link>
              ) : (
                <>
                  <a
                    href="#features"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 font-body text-sm font-medium text-text-primary dark:text-text-primary-dark px-2 py-2 rounded-lg hover:bg-surface dark:hover:bg-surface-dark transition-colors"
                  >
                    <Sparkles size={18} className="shrink-0" />
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 font-body text-sm font-medium text-text-primary dark:text-text-primary-dark px-2 py-2 rounded-lg hover:bg-surface dark:hover:bg-surface-dark transition-colors"
                  >
                    <Workflow size={18} className="shrink-0" />
                    How it works
                  </a>
                </>
              )}
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 font-body text-sm font-medium text-text-primary dark:text-text-primary-dark px-2 py-2 rounded-lg hover:bg-surface dark:hover:bg-surface-dark transition-colors"
              >
                <Info size={18} className="shrink-0" />
                About
              </Link>

              <div className="my-2 h-px w-full bg-border dark:bg-border-dark" />

              <Link
                href="/staff/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 font-body text-sm font-medium text-text-primary dark:text-text-primary-dark px-2 py-2 rounded-lg hover:bg-surface dark:hover:bg-surface-dark transition-colors"
              >
                <ShieldCheck size={18} className="shrink-0" />
                Staff login
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 font-body text-sm font-medium text-text-primary dark:text-text-primary-dark px-2 py-2 rounded-lg hover:bg-surface dark:hover:bg-surface-dark transition-colors"
              >
                <LogIn size={18} className="shrink-0" />
                Log in
              </Link>
              <Link
                href="/login?tab=signup"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 font-body text-sm font-medium text-text-primary dark:text-text-primary-dark px-2 py-2 mt-1 rounded-lg hover:bg-surface dark:hover:bg-surface-dark transition-colors"
              >
                <UserPlus size={18} className="shrink-0" />
                Sign up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}