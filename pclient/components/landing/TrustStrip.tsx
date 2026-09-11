"use client";

import { BarChart3, CalendarDays, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { cardItem, fadeInUp, scrollViewport, staggerContainer } from "./motion";

// Gives visitors a compact overview of the connected Poste workflow with scroll-triggered animations.
export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Poste workflow capabilities">
      <motion.div
        className="section-shell trust-inner"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={staggerContainer}
      >
        <motion.p className="trust-heading" variants={fadeInUp}>
          One calm workspace for the work behind every post.
        </motion.p>
        <motion.div className="trust-items" variants={staggerContainer}>
          <motion.span variants={cardItem} whileHover={{ y: -2 }}>
            <Sparkles size={15} /> Create
          </motion.span>
          <motion.span variants={cardItem} whileHover={{ y: -2 }}>
            <CalendarDays size={15} /> Schedule
          </motion.span>
          <motion.span variants={cardItem} whileHover={{ y: -2 }}>
            <BarChart3 size={15} /> Understand
          </motion.span>
          <motion.span variants={cardItem} whileHover={{ y: -2 }}>
            <MessageCircle size={15} /> Grow
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}

