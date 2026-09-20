"use client";

import { ArrowRight, CheckCircle2, Mail, PlayCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { DashboardPreview } from "./DashboardPreview";
import { cardItem, fadeInDown, fadeInUp, staggerContainer } from "./motion";

// Renders the reference-inspired editorial hero with staggered entrance animations.
export function HeroSection() {
  return (
    <section className="hero reference-hero section-shell">
      <motion.div
        className="hero-copy"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="eyebrow" variants={fadeInDown}>
          <Sparkles size={14} strokeWidth={1.8} /> Your calmer social workspace
        </motion.p>
        <motion.h1 variants={fadeInUp}>
          Grow your social presence <span>without the scramble.</span>
        </motion.h1>
        <motion.p className="hero-description" variants={fadeInUp}>
          Create thoughtful content, build a publishing rhythm, and learn from your performance—all from one clear workspace.
        </motion.p>
        <motion.div className="hero-email-card" variants={cardItem}>
          <div className="hero-email-copy">
            <Mail size={18} strokeWidth={1.8} />
            <span>Ready to build a calmer content rhythm?</span>
          </div>
          <Button href="/sign-up">Start free <ArrowRight size={16} strokeWidth={1.8} /></Button>
        </motion.div>
        <motion.div className="hero-proof" variants={fadeInUp}>
          <span><CheckCircle2 size={14} strokeWidth={2} /> Free plan available</span>
          <Link href="#workflow"><PlayCircle size={14} strokeWidth={1.8} /> See how it works</Link>
        </motion.div>
      </motion.div>
      <DashboardPreview />
    </section>
  );
}
