"use client";

import { motion } from "framer-motion";

const studentSteps = [
  "Sign up with your student credentials",
  "Submit a complaint with details and category",
  "Track its status from your dashboard",
  "Get notified the moment it's resolved",
];

const resolverSteps = [
  "Log in as a complaint resolver",
  "View complaints routed to you",
  "Mark as in progress while you work on it",
  "Mark as completed once it's resolved",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Two sides, one thread
        </h2>
        <p className="mt-3 max-w-xl font-body text-text-secondary dark:text-text-secondary-dark">
          Students raise and follow up. Resolvers act and update. Both sides
          see the same status, in real time.
        </p>
      </motion.div>

      <motion.div
        className="mt-12 grid gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8"
          variants={itemVariants}
          whileHover={{ y: -6, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)" }}
        >
          <span className="font-heading text-xs font-semibold uppercase tracking-wider text-secondary dark:text-secondary-dark">
            For students
          </span>
          <ol className="mt-5 space-y-4">
            {studentSteps.map((step, i) => (
              <motion.li
                key={step}
                className="flex gap-4"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/10 dark:bg-secondary-dark/10 font-heading text-xs font-bold text-secondary dark:text-secondary-dark"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity, repeatDelay: 3 }}
                >
                  {i + 1}
                </motion.span>
                <span className="font-body text-sm leading-relaxed pt-0.5">
                  {step}
                </span>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8"
          variants={itemVariants}
          whileHover={{ y: -6, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)" }}
        >
          <span className="font-heading text-xs font-semibold uppercase tracking-wider text-accent dark:text-accent-dark">
            For resolvers
          </span>
          <ol className="mt-5 space-y-4">
            {resolverSteps.map((step, i) => (
              <motion.li
                key={step}
                className="flex gap-4"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 dark:bg-accent-dark/10 font-heading text-xs font-bold text-accent dark:text-accent-dark"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity, repeatDelay: 3 }}
                >
                  {i + 1}
                </motion.span>
                <span className="font-body text-sm leading-relaxed pt-0.5">
                  {step}
                </span>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </motion.div>
    </section>
  );
}