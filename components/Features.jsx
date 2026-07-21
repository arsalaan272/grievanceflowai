"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "File in minutes",
    description:
      "Describe the issue, pick a category, attach evidence if you have it. No forms to print, no office to visit.",
    accentClass: "text-primary dark:text-primary-dark",
    borderClass: "hover:border-primary dark:hover:border-primary-dark",
  },
  {
    title: "Track every stage",
    description:
      "See exactly where your complaint stands — submitted, in progress, or resolved — without emailing to ask.",
    accentClass: "text-secondary dark:text-secondary-dark",
    borderClass: "hover:border-secondary dark:hover:border-secondary-dark",
  },
  {
    title: "Full history, kept",
    description:
      "Every complaint you've ever filed stays on record. Nothing gets lost in someone's inbox.",
    accentClass: "text-accent dark:text-accent-dark",
    borderClass: "hover:border-accent dark:hover:border-accent-dark",
  },
  {
    title: "Direct to the right resolver",
    description:
      "Complaints route straight to the concerned faculty member, who can update status as work happens.",
    accentClass: "text-primary dark:text-primary-dark",
    borderClass: "hover:border-primary dark:hover:border-primary-dark",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20">
      <motion.div
        className="max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Built for how complaints actually move
        </h2>
        <p className="mt-3 font-body text-text-secondary dark:text-text-secondary-dark">
          One system for students to raise issues and for faculty to resolve
          them — with a visible trail the whole way through.
        </p>
      </motion.div>

      <motion.div
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={itemVariants}
            whileHover={{ y: -6, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)" }}
            className={`rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 transition-colors ${f.borderClass}`}
          >
            <motion.div
              className={`font-heading text-2xl font-bold ${f.accentClass}`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              ●
            </motion.div>
            <h3 className="mt-4 font-heading text-lg font-semibold">
              {f.title}
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
              {f.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}