"use client";

import Link from "next/link";
import StatusThread from "./StatusThread";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
      <motion.div
        className="grid items-center gap-14 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants}>
          <motion.span
            className="inline-block rounded-full border border-border dark:border-border-dark px-3 py-1 font-heading text-xs font-medium uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark"
            variants={itemVariants}
          >
            Campus grievance system
          </motion.span>

          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Raise it once.{" "}
            <span className="text-primary dark:text-primary-dark">Track it</span>{" "}
            until it&apos;s{" "}
            <span className="text-accent dark:text-accent-dark">done.</span>
          </h1>

          <motion.p
            className="mt-5 max-w-lg font-body text-base leading-relaxed text-text-secondary dark:text-text-secondary-dark"
            variants={itemVariants}
          >
            No more chasing down the right office or resending the same email
            twice. Log a complaint, watch it move from submitted to resolved,
            and keep a record of every grievance you&apos;ve ever raised — all
            in one place.
          </motion.p>

          <motion.div className="mt-8 flex flex-wrap gap-4" variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href="/login?tab=signup"
                className="rounded-lg bg-primary dark:bg-primary-dark px-6 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-primary-hover dark:hover:bg-primary-dark-hover"
              >
                Get started
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href="#how-it-works"
                className="rounded-lg border border-border dark:border-border-dark px-6 py-3 font-heading text-sm font-semibold text-text-primary dark:text-text-primary-dark transition-colors hover:bg-surface dark:hover:bg-surface-dark"
              >
                See how it works
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="flex justify-center md:justify-end" variants={itemVariants}>
          <motion.div
            className="w-full rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8"
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-2 font-heading text-xs font-medium uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark">
              Every complaint follows the same path
            </p>
            <StatusThread />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}