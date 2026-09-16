"use client";

import { BriefcaseBusiness, PenLine, Store } from "lucide-react";
import { motion } from "framer-motion";

import { cardItem, EASE_OUT, fadeInUp, scrollViewport, staggerContainer } from "./motion";

const audiences = [
  { icon: PenLine, label: "Creators", title: "Keep your ideas moving", description: "A calm place to turn the thoughts in your notes app into a publishing rhythm you can keep." },
  { icon: BriefcaseBusiness, label: "Freelancers", title: "Make client work easier to see", description: "Plan multiple content streams without losing your own voice, calendar, or performance context." },
  { icon: Store, label: "Small businesses", title: "Build trust one post at a time", description: "Show up with more intention across the channels where your customers already spend time." },
];

// Displays audience outcomes with scroll-triggered staggered cards and expanding accent lines.
export function ProofSection() {
  return (
    <section className="proof-section section-shell" aria-labelledby="proof-title">
      <motion.div
        className="section-heading centered-heading"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={staggerContainer}
      >
        <motion.p className="mono-label" variants={fadeInUp}>Made for the work you actually do</motion.p>
        <motion.h2 id="proof-title" variants={fadeInUp}>One workspace. Different kinds of momentum.</motion.h2>
        <motion.p variants={fadeInUp}>Poste is built for people who need consistency to feel practical, not performative.</motion.p>
      </motion.div>
      <motion.div
        className="proof-grid"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={staggerContainer}
      >
        {audiences.map(({ icon: Icon, label, title, description }, index) => (
          <motion.article
            className="proof-card"
            key={label}
            variants={cardItem}
            whileHover={{ y: -5, transition: { duration: 0.25 } }}
          >
            <div className="proof-card-top">
              <span className="proof-icon"><Icon size={17} strokeWidth={1.7} /></span>
              <span className="mono-label">{label}</span>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <motion.div
              className="proof-line"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={scrollViewport}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: EASE_OUT }}
            />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

