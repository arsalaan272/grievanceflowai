"use client";

import { motion } from "framer-motion";

export default function BackgroundGrid() {
  return (
    <>
      {/* Grid pattern background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Light mode grid */}
        <div className="absolute inset-0 dark:hidden">
          <svg
            className="w-full h-full opacity-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Dark mode grid */}
        <div className="absolute inset-0 hidden dark:block">
          <svg
            className="w-full h-full opacity-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid-dark"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#E6EDF3"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-dark)" />
          </svg>
        </div>
      </div>

      {/* Animated orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Primary orb - top right */}
        <motion.div
          className="absolute top-10 right-10 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(8, 145, 178, 0.15) 0%, rgba(8, 145, 178, 0) 70%)",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary orb - bottom left */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(154, 47, 230, 0.12) 0%, rgba(154, 47, 230, 0) 70%)",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Accent orb - center */}
        <motion.div
          className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(76, 95, 213, 0.08) 0%, rgba(76, 95, 213, 0) 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Dark mode animated orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden dark:block">
        <motion.div
          className="absolute top-10 right-10 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(107, 15, 138, 0.2) 0%, rgba(107, 15, 138, 0) 70%)",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(6, 4, 142, 0.18) 0%, rgba(6, 4, 142, 0) 70%)",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </>
  );
}
