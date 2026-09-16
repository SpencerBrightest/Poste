"use client";

// Renders the dedicated workspace surface for an editor sidebar destination.
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Calendar, Check, FileText, Plus, Search, Sparkles, TrendingUp, Users } from "lucide-react";

interface EditorSectionPageProps {
  title: string;
  description: string;
  icon: "calendar" | "analytics" | "sponsorship" | "mail" | "collaboration";
}

const iconMap = { calendar: Calendar, analytics: TrendingUp, sponsorship: Sparkles, mail: FileText, collaboration: Users };

// Provides useful local interactions while each section is being connected to its API.
export default function EditorSectionPage({ title, description, icon }: EditorSectionPageProps) {
  const Icon = iconMap[icon];
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  // Shows feedback for section actions until their server workflows are connected.
  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  return (
    <main className="section-page-shell">
      <header className="section-page-topbar">
        <Link className="dashboard-brand" href="/editor"><span className="dashboard-logo"><Sparkles size={15} /></span><span>SocialNest</span></Link>
        <Link className="section-back-link" href="/editor"><ArrowLeft size={15} />Back to overview</Link>
      </header>
      <div className="section-page-content">
        <div className="section-page-heading"><div className="section-page-icon"><Icon size={22} /></div><div><p className="dashboard-kicker">Editor workspace</p><h1>{title}</h1><p>{description}</p></div></div>
        <div className="section-page-toolbar"><label className="section-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} /></label><button className="section-primary-action" type="button" onClick={() => showNotice(`${title} action started`)}><Plus size={16} />New item</button></div>
        <section className="section-page-empty"><div className="section-empty-icon"><Check size={22} /></div><h2>{query ? `No ${title.toLowerCase()} match your search` : `${title} is ready`}</h2><p>{query ? "Try a different search term." : "This dedicated workspace is connected to your protected editor session. Your saved items will appear here as soon as they are created."}</p><button className="section-outline-action" type="button" onClick={() => showNotice("Workspace action opened")}>Open workspace</button></section>
      </div>
      {notice && <div className="section-page-toast" role="status">{notice}</div>}
    </main>
  );
}
