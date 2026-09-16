// Renders a smooth, subtle scroll progress indicator anchored at the top of the viewport.
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Tracks window scroll progress and renders an elastic, animated gradient progress bar.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{
        scaleX,
        transformOrigin: "0%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, var(--primary-bright) 0%, var(--cyan) 50%, var(--secondary) 100%)",
        zIndex: 100,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
