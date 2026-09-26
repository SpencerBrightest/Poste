"use client";

// Renders the dedicated workspace surface for an editor sidebar destination.
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Calendar, Check, ChevronDown, Lightbulb, Mail, Plus, Search, Sparkles, TrendingUp, Users, Wallet } from "lucide-react";
import { ThemeToggle } from "@/components/landing/ThemeToggle";

interface EditorSectionPageProps {
  title: string;
  description: string;
  icon: "calendar" | "analytics" | "advisor" | "referrals" | "billing" | "settings" | "sponsorship" | "mail" | "collaboration";
}

const iconMap = { calendar: Calendar, analytics: TrendingUp, advisor: Lightbulb, referrals: Users, billing: Wallet, settings: Sparkles, sponsorship: Sparkles, mail: Mail, collaboration: Users };

const cardsBySection = {
  "Post Schedule": ["Tomorrow, 6:00 PM", "Thursday, 10:30 AM", "Friday, 5:15 PM"],
  Analytics: ["Follower growth", "Engagement rate", "Top performing posts"],
  "AI Advisor": ["Best time to post", "Content ideas", "Caption improvements"],
  Referrals: ["Your referral link", "Pending rewards", "Conversion activity"],
  Billing: ["Current plan", "Payment methods", "Usage this month"],
  Settings: ["Profile details", "Connected accounts", "Notification preferences"],
  Sponsorship: ["Active opportunities", "Brand contacts", "Campaign notes"],
  Mails: ["Unread messages", "Creator conversations", "Saved replies"],
  Collaboration: ["Pending approvals", "Team members", "Shared drafts"],
} as const;

// Provides useful local interactions while each section is being connected to its API.
export default function EditorSectionPage({ title, description, icon }: EditorSectionPageProps) {
  const Icon = iconMap[icon];
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedRange, setSelectedRange] = useState("This month");
  const [activeTab, setActiveTab] = useState("Overview");
  const [enabled, setEnabled] = useState(true);
  const cards = cardsBySection[title as keyof typeof cardsBySection] ?? [];
  const visibleCards = cards.filter((card) => card.toLowerCase().includes(query.toLowerCase()));

  // Shows feedback for section actions until their server workflows are connected.
  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  return (
    <main className="section-page-shell">
      <header className="section-page-topbar">
        <Link className="dashboard-brand" href="/editor"><span className="dashboard-logo"><Sparkles size={15} /></span><span>Poste.</span></Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link className="section-back-link" href="/editor"><ArrowLeft size={15} />Back to overview</Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="section-page-content">
        <div className="section-page-heading"><div className="section-page-icon"><Icon size={22} /></div><div><p className="dashboard-kicker">Editor workspace</p><h1>{title}</h1><p>{description}</p></div></div>
        <div className="section-page-toolbar"><label className="section-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} /></label><div className="section-toolbar-actions"><div className="section-select-wrap"><select value={selectedRange} onChange={(event) => setSelectedRange(event.target.value)} aria-label="Time range"><option>This month</option><option>Last 7 days</option><option>Last 90 days</option></select><ChevronDown size={14} /></div><button className="section-primary-action" type="button" onClick={() => showNotice(`${title} action started`)}><Plus size={16} />New item</button></div></div>
        <div className="section-tabs" role="tablist">{["Overview", "Activity", "Settings"].map((tab) => <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "is-active" : ""} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
        <section className="section-metric-grid">{visibleCards.map((card, index) => <article className="section-metric-card" key={card}><div className="section-metric-icon"><Icon size={17} /></div><span>{card}</span><strong>{index === 0 ? (title === "Billing" ? "Pro plan" : title === "Analytics" ? "+18.4%" : "12") : index === 1 ? (title === "Referrals" ? "€240" : "84%") : "24"}</strong><small>{selectedRange} <em>{index === 1 ? "+12.6%" : "Updated now"}</em></small></article>)}</section>
        <section className="section-workspace-card"><div><span className="section-card-kicker">{activeTab} workspace</span><h2>{title === "AI Advisor" ? "A clearer next move for your content" : title === "Billing" ? "Keep your publishing workflow moving" : `${title} at a glance`}</h2><p>{title === "AI Advisor" ? "Based on your recent engagement, Thursday at 6:00 PM is your strongest window for an educational post." : title === "Post Schedule" ? "Your upcoming publishing queue is ready to review and adjust." : "This protected workspace is ready for live data from your connected accounts."}</p></div><div className="section-workspace-actions"><button className="section-outline-action" type="button" onClick={() => showNotice("Export prepared")}>Export</button><button className="section-primary-action" type="button" onClick={() => showNotice(`${title} saved`)}><Check size={15} />Save changes</button></div></section>
        <section className="section-list-card"><div className="section-list-heading"><div><span className="section-card-kicker">Recent activity</span><h2>What needs your attention</h2></div><label className="section-toggle"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /><span />{enabled ? "Live updates" : "Paused"}</label></div>{visibleCards.length ? visibleCards.map((card, index) => <button className="section-list-row" type="button" key={`${card}-row`} onClick={() => showNotice(`${card} opened`)}><span className="section-list-number">0{index + 1}</span><span><strong>{card}</strong><small>{enabled ? "Ready for your review" : "Updates paused"}</small></span><ChevronDown className="section-row-arrow" size={15} /></button>) : <div className="section-no-results"><Check size={18} />No results for “{query}”</div>}</section>
      </div>
      {notice && <div className="section-page-toast" role="status">{notice}</div>}
    </main>
  );
}
