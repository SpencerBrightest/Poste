"use client";

import Image from "next/image";
import { CalendarClock, Check, Play, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

import { EASE_OUT } from "./motion";

// Renders an animated product-and-creator collage with entrance transitions and ambient motion.
export function DashboardPreview() {
  return (
    <motion.div
      className="hero-collage"
      aria-label="Poste workspace preview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="collage-outline collage-outline-one"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
      />
      <motion.div
        className="collage-outline collage-outline-two"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.18, ease: EASE_OUT }}
      />
      <motion.span
        className="accent-square accent-cyan accent-top"
        aria-hidden="true"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: EASE_OUT }}
      />
      <motion.span
        className="accent-square accent-coral accent-top-small"
        aria-hidden="true"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.35, ease: EASE_OUT }}
      />
      <motion.span
        className="accent-square accent-navy accent-top-dark"
        aria-hidden="true"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4, ease: EASE_OUT }}
      />

      <motion.div
        className="collage-photo"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.15, ease: EASE_OUT }}
      >
        <Image
          src="/workspace_preview.jpg"
          alt="A bright creator workspace with a laptop and notebook"
          fill
          priority
          sizes="(max-width: 900px) 75vw, 390px"
        />
      </motion.div>

      <motion.div
        className="collage-video-card"
        initial={{ opacity: 0, x: -24, y: 10 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -6, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.25, ease: EASE_OUT },
          x: { duration: 0.6, delay: 0.25, ease: EASE_OUT },
          y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.85 },
        }}
      >
        <div className="video-thumb"><Play size={15} fill="currentColor" strokeWidth={0} /></div>
        <p className="mono-label">AI idea starter</p>
        <strong>Turn your next thought into a post.</strong>
        <div className="mini-lines"><i /><i /><i /></div>
        <span className="video-chip"><Sparkles size={11} /> Ready to shape</span>
      </motion.div>

      <motion.div
        className="collage-growth-card"
        initial={{ opacity: 0, x: 24, y: 15 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -5, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.35, ease: EASE_OUT },
          x: { duration: 0.6, delay: 0.35, ease: EASE_OUT },
          y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 },
        }}
      >
        <div className="growth-avatar">P</div>
        <div><strong>Reach this month</strong><small>From your latest posts</small></div>
        <span className="growth-badge"><TrendingUp size={12} /> 18.4%</span>
      </motion.div>

      <motion.div
        className="collage-platforms"
        aria-label="Connected social platforms"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.45, ease: EASE_OUT }}
      >
        <span>in</span><span>f</span><span>◎</span><span>✦</span>
      </motion.div>
      <motion.div
        className="collage-doodle"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.5, ease: EASE_OUT }}
      >
        ↗
      </motion.div>
      <span className="accent-square accent-cyan accent-bottom" aria-hidden="true" />
      <span className="accent-square accent-coral accent-bottom-large" aria-hidden="true" />
      <div className="collage-dots" aria-hidden="true"><i /><i /><i /><b /></div>

      <motion.div
        className="collage-schedule-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: [0, -4, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4, ease: EASE_OUT },
          y: { repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 1.2 },
        }}
      >
        <div className="schedule-icon"><CalendarClock size={13} /></div>
        <div><strong>Next up</strong><small>Today · 6:30 PM</small></div>
        <Check size={15} className="schedule-check" />
      </motion.div>
    </motion.div>
  );
}

