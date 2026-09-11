"use client";

import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import { ScrollProgress } from "./ScrollProgress";
import { ThemeToggle } from "./ThemeToggle";

// Renders the sticky navigation bar and scroll progress indicator for the public landing page.
export function Navbar() {
  return (
    <>
      <ScrollProgress />
      <header className="site-header reference-header">
        <motion.div
          className="nav-shell"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link className="brand" href="/" aria-label="Poste home">
            <span className="brand-mark" aria-hidden="true">P</span>
            <span>poste</span>
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#publishing">Publishing</a>
            <a href="#analytics">Analytics</a>
            <a href="#engagement">AI advisor</a>
            <a href="#pricing">Pricing</a>
            <a href="#resources">Resources</a>
          </nav>

          <div className="nav-actions">
            <ThemeToggle />
            <Link className="nav-login" href="/login">Sign in</Link>
            <Button href="/signup" size="small">
              Start free <ArrowUpRight size={15} strokeWidth={1.8} />
            </Button>
          </div>

          <details className="mobile-nav">
            <summary aria-label="Open navigation menu"><Menu size={18} strokeWidth={1.8} /></summary>
            <div className="mobile-nav-panel">
              <a href="#publishing">Publishing</a>
              <a href="#analytics">Analytics</a>
              <a href="#engagement">AI advisor</a>
              <a href="#pricing">Pricing</a>
              <a href="#resources">Resources</a>
            </div>
          </details>
        </motion.div>
      </header>
    </>
  );
}
