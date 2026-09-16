"use client";

import { BarChart3, CalendarDays, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { cardItem, EASE_OUT, fadeInUp, scrollViewport, staggerContainer } from "./motion";

const routines = [
  { id: "publishing", icon: CalendarDays, tone: "green", title: "Calendar & scheduled flow", description: "Plan a week of thoughtful content without losing the thread between your idea and your audience.", points: ["See the next post at a glance", "Keep a consistent cadence"], barHeights: ["30%", "55%", "38%", "75%", "64%"] },
  { id: "analytics", icon: BarChart3, tone: "blue", title: "Crystal-clear analytics", description: "Understand the signals behind your work without digging through disconnected platform reports.", points: ["Follow reach and engagement", "Spot patterns worth repeating"], barHeights: ["40%", "65%", "50%", "85%", "70%"] },
  { id: "engagement", icon: Sparkles, tone: "violet", title: "An advisor for what is next", description: "Use your niche and performance context to move from uncertainty to a useful next step.", points: ["Get niche-based guidance", "Turn insight into an idea"], barHeights: ["35%", "48%", "60%", "72%", "90%"] },
];

// Presents the three core routines that organize the Poste product story with scroll-triggered animations.
export function LifecycleSection() {
  return (
    <section className="lifecycle-section section-shell" aria-labelledby="lifecycle-title">
      <motion.div
        className="section-heading centered-heading"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={staggerContainer}
      >
        <motion.p className="mono-label" variants={fadeInUp}>Poste in practice</motion.p>
        <motion.h2 id="lifecycle-title" variants={fadeInUp}>Simplify your entire social lifecycle.</motion.h2>
        <motion.p variants={fadeInUp}>No complicated menus or steep learning curves. Poste groups the work into three peaceful routines.</motion.p>
      </motion.div>
      <motion.div
        className="lifecycle-grid"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={staggerContainer}
      >
        {routines.map(({ id, icon: Icon, tone, title, description, points, barHeights }) => (
          <motion.article
            className={`lifecycle-card lifecycle-${tone}`}
            id={id}
            key={id}
            variants={cardItem}
            whileHover={{ y: -5, transition: { duration: 0.25 } }}
          >
            <div className="lifecycle-card-top">
              <span className="lifecycle-icon"><Icon size={18} strokeWidth={1.8} /></span>
              <span className="mono-label">{id}</span>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <ul>{points.map((point) => <li key={point}><span className="list-dot" />{point}</li>)}</ul>
            <div className="routine-mini-ui">
              {barHeights.map((h, i) => (
                <motion.span
                  key={i}
                  style={{ height: h, transformOrigin: "bottom" }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={scrollViewport}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: EASE_OUT }}
                />
              ))}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

