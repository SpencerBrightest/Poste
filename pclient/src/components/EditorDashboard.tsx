"use client";

// Renders the interactive editor analytics workspace.
import { useState, useEffect } from "react";
import Link from "next/link";
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
  Wallet as WalletIcon,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import { usePosts } from "@/lib/hooks/use-posts";
import { useSocialAccounts } from "@/lib/hooks/use-social-accounts";
import type { DashboardData } from "@/lib/actions/analytics";

interface EditorDashboardProps {
  firstName: string;
  imageUrl: string;
  dashboardData: DashboardData | null;
}

const navItems = [
  { label: "Dashboard", href: "/editor", icon: LayoutDashboard },
  { label: "Post Schedule", href: "/editor/post-schedule", icon: Calendar },
  { label: "Analytics", href: "/editor/analytics", icon: TrendingUp },
  { label: "AI Advisor", href: "/editor/advisor", icon: Sparkles },
  { label: "Editor", href: "/editor/new-post", icon: FileText },
  { label: "Referrals", href: "/editor/referrals", icon: Users },
  { label: "Billing", href: "/editor/billing", icon: WalletIcon },
  { label: "Sponsorship", href: "/editor/sponsorship", icon: Link2, badge: "New" },
  { label: "Mails", href: "/editor/mails", icon: MessageCircle, badge: "9+" },
  { label: "Collaboration", href: "/editor/collaboration", icon: Users },
];

// Builds an SVG path from the dashboard's persisted monthly counts.
function makePath(chartPoints: DashboardData["chartPoints"], key: "posts" | "published") {
  const maximum = Math.max(...chartPoints.map((point) => point[key]), 1);
  return chartPoints
    .map((point, index) => {
      const x = chartPoints.length > 1 ? 8 + index * (100 / (chartPoints.length - 1)) : 58;
      const y = 92 - (point[key] / maximum) * 70;
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
}

// Provides a responsive dashboard view with local filters and navigation state.
export default function EditorDashboard({ firstName, imageUrl, dashboardData }: EditorDashboardProps) {
  const { signOut } = useClerk();
  const activeNav = "Dashboard";
  const [range, setRange] = useState("Monthly");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All platforms");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [modal, setModal] = useState<"social" | "schedule" | null>(null);
  const [notice, setNotice] = useState("");
  const [connectingSocial, setConnectingSocial] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [accountsCollapsed, setAccountsCollapsed] = useState(false);
  const displayName = firstName || "Creator";
  
  const { data: posts } = usePosts();
  const { data: socialAccounts, isLoading: accountsLoading } = useSocialAccounts();
  
  const platformMetrics = dashboardData?.platformMetrics ?? [];
  const chartPoints = dashboardData?.chartPoints ?? [];
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

  // Start the supported X OAuth flow from the dashboard.
  async function connectXAccount() {
    setConnectingSocial(true);
    try {
      const response = await fetch("/api/oauth/twitter/connect");
      const result = await response.json() as { authUrl?: string; error?: string };
      if (!response.ok || !result.authUrl) {
        throw new Error(result.error ?? "Unable to start X connection");
      }
      window.location.assign(result.authUrl);
    } catch (error) {
      setConnectingSocial(false);
      showNotice(error instanceof Error ? error.message : "Unable to start X connection");
    }
  }

  return (
    <div className="dashboard-shell">
      <aside className={`dashboard-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="dashboard-brand-row">
          <Link className="dashboard-brand" href="/editor" aria-label="Poste dashboard">
            <span className="dashboard-logo"><Sparkles size={15} /></span>
            <span>SocialNest</span>
          </Link>
          <button className="dashboard-icon-button sidebar-close" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={17} />
          </button>
        </div>
        <div className="sidebar-section">
          <button className="sidebar-section-heading" type="button" onClick={() => setMenuCollapsed((collapsed) => !collapsed)}><span>Menu</span><ChevronDown className={menuCollapsed ? "is-rotated" : ""} size={14} /></button>
          <nav className={`dashboard-nav ${menuCollapsed ? "is-collapsed" : ""}`} aria-label="Editor navigation">
            {navItems.map(({ label, href, icon: Icon, badge }) => (
              <Link className={`dashboard-nav-item ${activeNav === label ? "is-active" : ""}`} href={href} key={label} onClick={() => setSidebarOpen(false)}>
                <Icon size={15} />
                <span>{label}</span>
                {badge && <small>{badge}</small>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="sidebar-section accounts-section">
          <button className="sidebar-section-heading" type="button" onClick={() => setAccountsCollapsed((collapsed) => !collapsed)}><span>Your Accounts</span><ChevronDown className={accountsCollapsed ? "is-rotated" : ""} size={14} /></button>
          <div className={`account-list ${accountsCollapsed ? "is-collapsed" : ""}`}>
            {accountsLoading ? (
              <p>Loading accounts...</p>
            ) : socialAccounts && socialAccounts.length > 0 ? (
              socialAccounts.map((account) => (
                <button 
                  key={account.id} 
                  className={selectedPlatform === account.platform ? "is-selected" : ""} 
                  type="button" 
                  onClick={() => setSelectedPlatform(account.platform)}
                >
                  {account.platform}
                </button>
              ))
            ) : (
              <>
                <button className={selectedPlatform === "Facebook" ? "is-selected" : ""} type="button" onClick={() => setSelectedPlatform("Facebook")}><span className="account-dot facebook-dot">f</span>Facebook</button>
                <button className={selectedPlatform === "Twitter" ? "is-selected" : ""} type="button" onClick={() => setSelectedPlatform("Twitter")}><Send size={14} />Twitter</button>
                <button className={selectedPlatform === "Instagram" ? "is-selected" : ""} type="button" onClick={() => setSelectedPlatform("Instagram")}><AtSign size={14} />Instagram</button>
              </>
            )}
          </div>
        </div>
        <div className="sidebar-footer-nav">
          <Link className="sidebar-footer-link" href="/editor/settings"><Settings size={15} />Settings</Link>
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
              <div className="dashboard-menu-wrap"><button className="dashboard-select" type="button" onClick={() => toggleMenu("date")}><Calendar size={14} />{range === "Monthly" ? "Last 7 months" : "This week"}<ChevronDown size={13} /></button>{menuOpen === "date" && <div className="dashboard-dropdown"><button type="button" onClick={() => { setRange("Monthly"); setMenuOpen(null); }}>Last 7 months</button><button type="button" onClick={() => { setRange("Weekly"); setMenuOpen(null); }}>This week</button></div>}</div>
              <Link className="dashboard-outline-action" href="/editor/post-schedule"><Calendar size={14} />Post Schedule</Link>
              <button className="dashboard-primary-action" type="button" onClick={() => setModal("social")}><Plus size={16} />Add Social</button>
            </div>
          </div>

          <section className="dashboard-grid dashboard-grid-top">
            <article className="dashboard-card overview-card">
              <div className="card-heading"><div><h2>Overview</h2><span>Nov 05 - Dec 11</span></div><div className="dashboard-menu-wrap"><button className="mini-select" type="button" onClick={() => toggleMenu("overview")}>Today <ChevronDown size={12} /></button>{menuOpen === "overview" && <div className="dashboard-dropdown dashboard-dropdown-right"><button type="button" onClick={() => { setMenuOpen(null); showNotice("Overview set to today"); }}>Today</button><button type="button" onClick={() => { setMenuOpen(null); showNotice("Overview set to yesterday"); }}>Yesterday</button></div>}</div></div>
              <div className="overview-ring"><div><strong>{dashboardData?.totalPosts ?? posts?.length ?? 0}</strong><span>Total Posts</span></div></div>
              <div className="platform-metrics"><h3>{selectedPlatform === "All platforms" ? "Posts by platform" : `${selectedPlatform} overview`}</h3>{visibleMetrics.length ? visibleMetrics.map(({ name, value, published, color }) => <button className="platform-row" type="button" key={name} onClick={() => setSelectedPlatform(name)}><Send size={13} style={{ color }} /><strong>{value}</strong><span>{name}</span><em>{published} published</em></button>) : <p className="empty-search">No matching platform</p>}</div>
            </article>

            <article className="dashboard-card audience-card">
              <div className="card-heading"><div><h2>Publishing activity</h2><span>Posts created and published</span><strong className="audience-total">{dashboardData?.publishedPosts ?? 0} <em>published</em></strong></div><button className="mini-select" type="button" onClick={() => setRange(range === "Monthly" ? "Weekly" : "Monthly")}>{range} <ChevronDown size={12} /></button></div>
              <div className="audience-body"><div className="audience-legend"><div><span style={{ background: "#69a4ea" }} />Created<small>{dashboardData?.totalPosts ?? 0} total</small></div><div><span style={{ background: "#40bdcc" }} />Published<small>{dashboardData?.publishedPosts ?? 0} total</small></div><div><span style={{ background: "#4e79d3" }} />Scheduled<small>{dashboardData?.scheduledPosts ?? 0} total</small></div></div><div className="line-chart-wrap"><svg viewBox="0 0 116 108" role="img" aria-label="Publishing activity chart"><path className="chart-grid-line" d="M8 22H108 M8 45H108 M8 68H108 M8 91H108" /><path className="chart-line chart-line-0" d={makePath(chartPoints, "posts")} /><path className="chart-line chart-line-1" d={makePath(chartPoints, "published")} /></svg><div className="chart-labels">{chartPoints.map(({ month }) => <span key={month}>{month}</span>)}</div></div></div>
            </article>
          </section>

          <section className="dashboard-grid dashboard-grid-bottom">
            <article className="dashboard-card activity-card"><div className="card-heading"><div><h2>Content status</h2><span>Current organization totals</span></div></div><div className="platform-metrics"><div className="platform-row"><FileText size={13} /><strong>{dashboardData?.draftPosts ?? 0}</strong><span>Draft posts</span></div><div className="platform-row"><Calendar size={13} /><strong>{dashboardData?.scheduledPosts ?? 0}</strong><span>Scheduled posts</span></div><div className="platform-row"><Send size={13} /><strong>{dashboardData?.publishedPosts ?? 0}</strong><span>Published posts</span></div></div></article>
            <article className="dashboard-card age-card"><div className="card-heading"><h2>Engagement totals</h2></div><div className="donut-chart"><div><strong>{dashboardData?.engagementRate.toFixed(1) ?? "0.0"}%</strong></div></div><div className="age-legend"><span><i />{dashboardData?.likes ?? 0} Likes</span><span><i />{dashboardData?.comments ?? 0} Comments</span><span><i />{dashboardData?.shares ?? 0} Shares</span><span><i />{dashboardData?.impressions ?? 0} Impressions</span></div></article>
            <article className="dashboard-card country-card"><div className="card-heading"><h2>Connected channels</h2></div><div className="country-list">{platformMetrics.length ? platformMetrics.map(({ name, value }) => <span key={name}>{name} {value} posts</span>) : <span>No posts yet</span>}</div><div className="world-map" aria-label="Connected channel summary"><span className="map-dot map-dot-blue" /><span className="map-dot map-dot-green" /></div><p className="empty-search">{dashboardData?.connectedAccounts ?? 0} social account{dashboardData?.connectedAccounts === 1 ? "" : "s"} connected.</p></article>
          </section>

          <section className="dashboard-insight"><div className="insight-icon"><Sparkles size={18} /></div><div><strong>Keep your momentum going, {displayName}</strong><p>{dashboardData?.scheduledPosts ? `You have ${dashboardData.scheduledPosts} scheduled post${dashboardData.scheduledPosts === 1 ? "" : "s"} ready for publishing.` : "Create and schedule your next post to start building a publishing rhythm."}</p></div><Link className="insight-action" href="/editor/new-post">Create post <ChevronRight size={15} /></Link><button className="insight-more" type="button" onClick={() => showNotice("Dashboard data is synced from your workspace")} aria-label="Show sync status"><MoreHorizontal size={17} /></button></section>
        </div>
      </main>
      {notice && <div className="dashboard-toast" role="status">{notice}</div>}
      {modal && <div className="dashboard-modal-backdrop" role="presentation" onClick={() => setModal(null)}><section className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="dashboard-modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setModal(null)} aria-label="Close dialog"><X size={16} /></button><span className="modal-kicker">Poste workspace</span><h2 id="dashboard-modal-title">Connect a social account</h2><p>Connect X to publish posts and sync account activity. Other providers will appear when their OAuth flows are enabled.</p><div className="modal-actions"><button type="button" disabled={connectingSocial} onClick={() => void connectXAccount()}><Send size={15} />{connectingSocial ? "Connecting X..." : "Connect X / Twitter"}</button></div></section></div>}
    </div>
  );
}
