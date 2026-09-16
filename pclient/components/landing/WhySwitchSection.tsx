"use client";

import { Focus, Gauge, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { cardItem, fadeInUp, scaleIn, scrollViewport, staggerContainer } from "./motion";

const reasons = [
  { icon: Focus, title: "Transparent, not overwhelming", description: "See what is next, what is working, and what needs attention without a crowded interface." },
  { icon: Gauge, title: "Built around momentum", description: "The product helps you make a useful next decision instead of asking you to manage more tools." },
  { icon: ShieldCheck, title: "Practical by design", description: "Start with the free plan, grow into deeper workflows, and keep your content history in one place." },
];

// Explains Poste's product principles with scroll-triggered panel reveal and staggered cards.
export function WhySwitchSection() {
  return (
    <section className="why-section section-shell" id="resources" aria-labelledby="why-title">
      <motion.div
        className="why-panel"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={scaleIn}
      >
        <motion.div
          className="section-heading centered-heading"
          variants={staggerContainer}
        >
          <motion.p className="mono-label" variants={fadeInUp}>Why Poste</motion.p>
          <motion.h2 id="why-title" variants={fadeInUp}>Social work should feel like progress.</motion.h2>
          <motion.p variants={fadeInUp}>Less tab-hopping. More clarity. A workspace that helps you keep going.</motion.p>
        </motion.div>
        <motion.div
          className="why-grid"
          variants={staggerContainer}
        >
          {reasons.map(({ icon: Icon, title, description }) => (
            <motion.article
              className="why-card"
              key={title}
              variants={cardItem}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <span className="why-icon"><Icon size={16} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

