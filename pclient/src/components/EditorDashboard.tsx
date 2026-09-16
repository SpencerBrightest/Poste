"use client";

// Renders the interactive editor analytics workspace.
import { useState } from "react";
import Image from "next/image";
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  AtSign,
  LayoutDashboard,
  Link2,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";

interface EditorDashboardProps {
  firstName: string;
  imageUrl: string;
}

interface PlatformMetric {
  name: string;
  value: string;
  delta: string;
  color: string;
  icon: typeof AtSign;
}

const platformMetrics: PlatformMetric[] = [
  { name: "Facebook", value: "2,500", delta: "+4.8%", color: "#3b82f6", icon: Users },
  { name: "Twitter", value: "2,500", delta: "+2.1%", color: "#38bdf8", icon: Send },
  { name: "Instagram", value: "2,500", delta: "+7.4%", color: "#e879a9", icon: AtSign },
];

const chartPoints = [
  { month: "Jan", facebook: 15, twitter: 9, instagram: 5 },
  { month: "Feb", facebook: 27, twitter: 22, instagram: 16 },
  { month: "Mar", facebook: 22, twitter: 31, instagram: 25 },
  { month: "Apr", facebook: 38, twitter: 27, instagram: 32 },
  { month: "May", facebook: 35, twitter: 43, instagram: 39 },
  { month: "Jun", facebook: 49, twitter: 39, instagram: 45 },
  { month: "Jul", facebook: 42, twitter: 51, instagram: 47 },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Post Schedule", icon: Calendar },
  { label: "Analytics", icon: TrendingUp },
  { label: "Editor", icon: FileText },
  { label: "Sponsorship", icon: Link2, badge: "New" },
  { label: "Mails", icon: MessageCircle, badge: "9+" },
  { label: "Collaboration", icon: Users },
];

// Builds the SVG path for one audience trend line.
function makePath(key: "facebook" | "twitter" | "instagram") {
  return chartPoints
    .map((point, index) => {
      const x = 8 + index * 15.8;
      const y = 92 - point[key] * 1.4;
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
}

// Provides a responsive dashboard view with local filters and navigation state.
export default function EditorDashboard({ firstName, imageUrl }: EditorDashboardProps) {
  const { signOut } = useClerk();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [range, setRange] = useState("Monthly");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All platforms");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [modal, setModal] = useState<"social" | "schedule" | null>(null);
  const [notice, setNotice] = useState("");
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [accountsCollapsed, setAccountsCollapsed] = useState(false);
  const displayName = firstName || "Creator";
  const visibleMetrics = platformMetrics.filter(({ name }) =>
    `${name} ${selectedPlatform}`.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Shows short-lived feedback for actions that will later connect to APIs.
  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  // Toggles one of the dashboard's compact menus.
  function toggleMenu(name: string) {
    setMenuOpen((current) => (current === name ? null : name));
  }

  return (
    <div className="dashboard-shell">
      <aside className={`dashboard-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="dashboard-brand-row">
          <a className="dashboard-brand" href="/editor" aria-label="Poste dashboard">
            <span className="dashboard-logo"><Sparkles size={15} /></span>
            <span>SocialNest</span>
          </a>
          <button className="dashboard-icon-button sidebar-close" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={17} />
          </button>
        </div>
        <div className="sidebar-section">
          <button className="sidebar-section-heading" type="button" onClick={() => setMenuCollapsed((collapsed) => !collapsed)}><span>Menu</span><ChevronDown className={menuCollapsed ? "is-rotated" : ""} size={14} /></button>
          <nav className={`dashboard-nav ${menuCollapsed ? "is-collapsed" : ""}`} aria-label="Editor navigation">
            {navItems.map(({ label, icon: Icon, badge }) => (
              <button className={`dashboard-nav-item ${activeNav === label ? "is-active" : ""}`} key={label} type="button" onClick={() => { setActiveNav(label); setSidebarOpen(false); showNotice(`${label} selected`); }}>
                <Icon size={15} />
                <span>{label}</span>
                {badge && <small>{badge}</small>}
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-section accounts-section">
          <button className="sidebar-section-heading" type="button" onClick={() => setAccountsCollapsed((collapsed) => !collapsed)}><span>Your Accounts</span><ChevronDown className={accountsCollapsed ? "is-rotated" : ""} size={14} /></button>
          <div className={`account-list ${accountsCollapsed ? "is-collapsed" : ""}`}>
            <button className={selectedPlatform === "Facebook" ? "is-selected" : ""} type="button" onClick={() => setSelectedPlatform("Facebook")}><span className="account-dot facebook-dot">f</span>Facebook</button>
            <button className={selectedPlatform === "Twitter" ? "is-selected" : ""} type="button" onClick={() => setSelectedPlatform("Twitter")}><Send size={14} />Twitter</button>
            <button className={selectedPlatform === "Instagram" ? "is-selected" : ""} type="button" onClick={() => setSelectedPlatform("Instagram")}><AtSign size={14} />Instagram</button>
          </div>
        </div>
        <div className="sidebar-footer-nav">
          <button type="button" onClick={() => showNotice("Settings workspace is ready") }><Settings size={15} />Settings</button>
          <button type="button" onClick={() => showNotice("Support center opened") }><CircleHelp size={15} />Help Support</button>
          <button className="logout-link" type="button" onClick={() => void signOut({ redirectUrl: "/" })}>Log out</button>
        </div>
      </aside>

      {sidebarOpen && <button className="dashboard-overlay" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="dashboard-icon-button mobile-menu" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={19} /></button>
          <div className="dashboard-search"><Search size={15} /><input aria-label="Search dashboard" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search platforms..." /><button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search">{searchQuery && <X size={13} />}</button></div>
          <div className="dashboard-top-actions">
            <button className="dashboard-icon-button" type="button" onClick={() => { toggleMenu("messages"); }} aria-label="Messages"><MessageCircle size={16} /></button>
            <button className="dashboard-icon-button" type="button" onClick={() => { toggleMenu("notifications"); }} aria-label="Notifications"><Bell size={16} /></button>
            {menuOpen === "messages" && <div className="dashboard-popover">No new messages</div>}
            {menuOpen === "notifications" && <div className="dashboard-popover">Everything is up to date</div>}
            
            <UserButton />
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-heading-row">
            <div><p className="dashboard-kicker">Workspace / {activeNav}</p><h1>Dashboard Overview</h1></div>
            <div className="dashboard-heading-actions">
              <div className="dashboard-menu-wrap"><button className="dashboard-select" type="button" onClick={() => toggleMenu("date")}><Calendar size={14} />{range === "Monthly" ? "Nov 05, 2025 - Dec 11, 2025" : "This week"}<ChevronDown size={13} /></button>{menuOpen === "date" && <div className="dashboard-dropdown"><button type="button" onClick={() => { setRange("Monthly"); setMenuOpen(null); }}>Monthly range</button><button type="button" onClick={() => { setRange("Weekly"); setMenuOpen(null); }}>This week</button></div>}</div>
              <button className="dashboard-outline-action" type="button" onClick={() => setModal("schedule")}><Calendar size={14} />Post Schedule</button>
              <button className="dashboard-primary-action" type="button" onClick={() => setModal("social")}><Plus size={16} />Add Social</button>
            </div>
          </div>

          <section className="dashboard-grid dashboard-grid-top">
            <article className="dashboard-card overview-card">
              <div className="card-heading"><div><h2>Overview</h2><span>Nov 05 - Dec 11</span></div><div className="dashboard-menu-wrap"><button className="mini-select" type="button" onClick={() => toggleMenu("overview")}>Today <ChevronDown size={12} /></button>{menuOpen === "overview" && <div className="dashboard-dropdown dashboard-dropdown-right"><button type="button" onClick={() => { setMenuOpen(null); showNotice("Overview set to today"); }}>Today</button><button type="button" onClick={() => { setMenuOpen(null); showNotice("Overview set to yesterday"); }}>Yesterday</button></div>}</div></div>
              <div className="overview-ring"><div><strong>571</strong><span>Best Growth (Fb)</span></div></div>
              <div className="platform-metrics"><h3>{selectedPlatform === "All platforms" ? "Your Social Platforms" : `${selectedPlatform} overview`}</h3>{visibleMetrics.length ? visibleMetrics.map(({ name, value, delta, color, icon: Icon }) => <button className="platform-row" type="button" key={name} onClick={() => showNotice(`${name} analytics selected`)}><Icon size={13} style={{ color }} /><strong>{value}</strong><span>{name}</span><em>{delta}</em></button>) : <p className="empty-search">No matching platform</p>}</div>
            </article>

            <article className="dashboard-card audience-card">
              <div className="card-heading"><div><h2>Audience Growth Engagement</h2><span>Total Followers</span><strong className="audience-total">184,160 <em>+3.2%</em></strong></div><button className="mini-select" type="button" onClick={() => setRange(range === "Monthly" ? "Weekly" : "Monthly")}>{range} <ChevronDown size={12} /></button></div>
              <div className="audience-body"><div className="audience-legend">{platformMetrics.map(({ name, color }) => <div key={name}><span style={{ background: color }} />{name}<small>+ {name === "Facebook" ? "50K" : name === "Twitter" ? "30K" : "20K"}</small></div>)}</div><div className="line-chart-wrap"><svg viewBox="0 0 116 108" role="img" aria-label="Audience growth chart"><path className="chart-grid-line" d="M8 22H108 M8 45H108 M8 68H108 M8 91H108" />{(["facebook", "twitter", "instagram"] as const).map((key, index) => <path key={key} className={`chart-line chart-line-${index}`} d={makePath(key)} />)}<line className="chart-marker" x1="72" x2="72" y1="10" y2="98" /><circle className="chart-point" cx="72" cy="45" r="2.3" /></svg><div className="chart-labels">{chartPoints.map(({ month }) => <span key={month}>{month}</span>)}</div></div></div>
            </article>
          </section>

          <section className="dashboard-grid dashboard-grid-bottom">
            <article className="dashboard-card activity-card"><div className="card-heading"><div><h2>Most Active time</h2><span>12:00 AM - 02:00 PM</span></div><div className="dashboard-menu-wrap"><button className="mini-select" type="button" onClick={() => toggleMenu("activity")}>Today <ChevronDown size={12} /></button>{menuOpen === "activity" && <div className="dashboard-dropdown dashboard-dropdown-right"><button type="button" onClick={() => { setMenuOpen(null); showNotice("Activity set to today"); }}>Today</button><button type="button" onClick={() => { setMenuOpen(null); showNotice("Activity set to this week"); }}>This week</button></div>}</div></div><div className="heatmap-legend"><span><i className="legend-fb" />Facebook</span><span><i className="legend-tw" />Twitter</span><span><i className="legend-ig" />Instagram</span></div><div className="heatmap">{Array.from({ length: 56 }, (_, index) => <i key={index} className={`heat-cell heat-${(index * 7 + index % 5) % 5}`} />)}</div><div className="heatmap-days"><span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div></article>
                      <article className="dashboard-card age-card"><div className="card-heading"><h2>Audience by Age</h2><div className="dashboard-menu-wrap"><button className="mini-select" type="button" onClick={() => toggleMenu("age")}>All <ChevronDown size={12} /></button>{menuOpen === "age" && <div className="dashboard-dropdown dashboard-dropdown-right"><button type="button" onClick={() => { setMenuOpen(null); showNotice("Showing all ages"); }}>All</button><button type="button" onClick={() => { setMenuOpen(null); showNotice("Showing ages 18-28"); }}>18-28</button></div>}</div></div><div className="donut-chart"><div><strong>65%</strong></div></div><div className="age-legend"><span><i />13-17 Age</span><span><i />18-28 Age</span><span><i />29-48 Age</span><span><i />Others</span></div></article>
                      <article className="dashboard-card country-card"><div className="card-heading"><h2>Growth by Country</h2><div className="dashboard-menu-wrap"><button className="mini-select" type="button" onClick={() => toggleMenu("country")}>Today <ChevronDown size={12} /></button>{menuOpen === "country" && <div className="dashboard-dropdown dashboard-dropdown-right"><button type="button" onClick={() => { setMenuOpen(null); showNotice("Country growth set to today"); }}>Today</button><button type="button" onClick={() => { setMenuOpen(null); showNotice("Country growth set to this month"); }}>This month</button></div>}</div></div><div className="country-list"><span>🇺🇸 USA 55%</span><span>🇬🇧 UK 12%</span><span>🇧🇩 BD 26%</span><span>🇮🇹 IT 7%</span></div><div className="world-map" aria-label="Growth by country map"><span className="map-dot map-dot-blue" /><span className="map-dot map-dot-purple" /><span className="map-dot map-dot-pink" /><span className="map-dot map-dot-green" /></div></article>
          </section>

          <section className="dashboard-insight"><div className="insight-icon"><Sparkles size={18} /></div><div><strong>Keep your momentum going, {displayName}</strong><p>Your Facebook audience is growing fastest this week. Schedule your next post for Thursday at 6:00 PM.</p></div><button className="insight-action" type="button" onClick={() => showNotice("Advisor recommendations are ready")}>View advisor <ChevronRight size={15} /></button><button className="insight-more" type="button" onClick={() => showNotice("Insight options opened")} aria-label="More insight options"><MoreHorizontal size={17} /></button></section>
        </div>
      </main>
      {notice && <div className="dashboard-toast" role="status">{notice}</div>}
      {modal && <div className="dashboard-modal-backdrop" role="presentation" onClick={() => setModal(null)}><section className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="dashboard-modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setModal(null)} aria-label="Close dialog"><X size={16} /></button><span className="modal-kicker">Poste workspace</span><h2 id="dashboard-modal-title">{modal === "social" ? "Connect a social account" : "Schedule a post"}</h2><p>{modal === "social" ? "Choose a channel to connect to your publishing workspace." : "Your scheduler is ready for the next post. Choose a channel to continue."}</p><div className="modal-actions"><button type="button" onClick={() => { setModal(null); showNotice("Facebook connection started"); }}><span className="account-dot facebook-dot">f</span>Facebook</button><button type="button" onClick={() => { setModal(null); showNotice("Instagram connection started"); }}><AtSign size={15} />Instagram</button><button type="button" onClick={() => { setModal(null); showNotice("Twitter connection started"); }}><Send size={15} />Twitter</button></div></section></div>}
    </div>
  );
}
