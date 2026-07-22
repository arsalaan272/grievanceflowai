"use client";

import { motion, useReducedMotion } from "framer-motion";

// Ambient floating particles — positioned in % so they scale to any
// viewport instead of a fixed pixel canvas. Deliberately a different
// visual language (soft round specks) from the StatusThread card's
// curved-line motif, so the two don't visually compete.
const PARTICLES = [
  { top: "18%", left: "62%", size: 5, duration: 14, delay: 0 },
  { top: "34%", left: "78%", size: 3, duration: 18, delay: 1.2 },
  { top: "55%", left: "68%", size: 4, duration: 16, delay: 2.5 },
  { top: "72%", left: "85%", size: 3, duration: 20, delay: 0.6 },
  { top: "12%", left: "12%", size: 4, duration: 17, delay: 1.8 },
  { top: "40%", left: "8%", size: 3, duration: 15, delay: 3 },
  { top: "80%", left: "20%", size: 5, duration: 19, delay: 0.9 },
  { top: "62%", left: "35%", size: 3, duration: 13, delay: 2.2 },
];

export default function BackgroundGrid() {
  const reduceMotion = useReducedMotion();

  // When reduced motion is requested, freeze everything at its resting value.
  const orbAnimate = (x, y, extra = {}) =>
    reduceMotion ? {} : { x, y, ...extra };

  return (
    <>
      {/* Grid pattern background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 dark:hidden">
          <svg className="w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1A1A" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute inset-0 hidden dark:block">
          <svg className="w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-dark" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E6EDF3" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-dark)" />
          </svg>
        </div>
      </div>

      {/* Ambient floating particles — soft drifting specks, a deliberately
          different motif from StatusThread's curved lines so the two don't
          read as duplicate/competing decoration on the same screen. */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full dark:bg-[#8B93F8] bg-[#4C5FD5] blur-[1px]"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: 0.35,
            }}
            animate={
              reduceMotion
                ? {}
                : { y: [0, -22, 0], x: [0, 8, 0], opacity: [0.2, 0.5, 0.2] }
            }
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Light mode floating orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden dark:hidden">
        <motion.div
          className="absolute top-10 right-10 w-[28rem] h-[28rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(8,145,178,0.16) 0%, rgba(8,145,178,0) 70%)" }}
          animate={orbAnimate([0, 60, 0], [0, 40, 0])}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(154,47,230,0.14) 0%, rgba(154,47,230,0) 70%)" }}
          animate={orbAnimate([0, -50, 0], [0, -60, 0])}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(76,95,213,0.10) 0%, rgba(76,95,213,0) 70%)" }}
          animate={orbAnimate([0, 40, 0], [0, -30, 0], { scale: [1, 1.15, 1] })}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(8,145,178,0.12) 0%, rgba(8,145,178,0) 70%)" }}
          animate={orbAnimate([0, -30, 0], [0, 50, 0])}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Dark mode floating orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden dark:block">
        <motion.div
          className="absolute top-10 right-10 w-[28rem] h-[28rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(107,15,138,0.22) 0%, rgba(107,15,138,0) 70%)" }}
          animate={orbAnimate([0, 60, 0], [0, 40, 0])}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(6,4,142,0.22) 0%, rgba(6,4,142,0) 70%)" }}
          animate={orbAnimate([0, -50, 0], [0, -60, 0])}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(139,147,248,0.14) 0%, rgba(139,147,248,0) 70%)" }}
          animate={orbAnimate([0, 40, 0], [0, -30, 0], { scale: [1, 1.15, 1] })}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(107,15,138,0.18) 0%, rgba(107,15,138,0) 70%)" }}
          animate={orbAnimate([0, -30, 0], [0, 50, 0])}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </>
  );
}