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
            <Link href="#publishing">Publishing</Link>
            <Link href="#analytics">Analytics</Link>
            <Link href="#engagement">AI advisor</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#resources">Resources</Link>
          </nav>

          <div className="nav-actions">
            <ThemeToggle />
            <Link className="nav-login" href="/sign-in">Sign in</Link>
            <Link href="/sign-up" className="button button--secondary" aria-label="Sign up for Poste">
              Start free <ArrowUpRight size={15} strokeWidth={1.8} />
            </Link>
          </div>

          <details className="mobile-nav">
            <summary aria-label="Open navigation menu"><Menu size={18} strokeWidth={1.8} /></summary>
            <div className="mobile-nav-panel">
              <Link href="#publishing">Publishing</Link>
              <Link href="#analytics">Analytics</Link>
              <Link href="#engagement">AI advisor</Link>
              <Link href="#pricing">Pricing</Link>
              <Link href="#resources">Resources</Link>
            </div>
          </details>
        </motion.div>
      </header>
    </>
  );
}
