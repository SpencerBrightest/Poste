"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import { fadeInUp, scaleIn, scrollViewport, staggerContainer } from "./motion";

// Renders the conversion banner with scroll entrance and subtle ambient lighting effects.
export function CtaBanner() {
  return (
    <motion.section
      className="cta-section section-shell"
      id="pricing"
      aria-labelledby="cta-title"
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={scaleIn}
    >
      <motion.div
        className="cta-glow cta-glow-one"
        aria-hidden="true"
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.22, 0.38, 0.22],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="cta-glow cta-glow-two"
        aria-hidden="true"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 6.5,
          delay: 3,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="cta-content"
        variants={staggerContainer}
      >
        <motion.p className="mono-label" variants={fadeInUp}>
          <Sparkles size={13} /> Start with a calmer cadence
        </motion.p>
        <motion.h2 id="cta-title" variants={fadeInUp}>
          Ready to build your social presence the calm way?
        </motion.h2>
        <motion.p variants={fadeInUp}>
          Join Poste with a free plan and give your next idea a clearer path from thought to published post.
        </motion.p>
        <motion.div className="cta-actions" variants={fadeInUp}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button href="/sign-up" variant="light">
              Get started for free <ArrowUpRight size={15} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button href="#workflow" variant="outlineLight">
              Explore the workflow
            </Button>
          </motion.div>
        </motion.div>
        <motion.span className="cta-note" variants={fadeInUp}>
          No complicated setup. Just a clearer place to begin.
        </motion.span>
      </motion.div>
    </motion.section>
  );
}
