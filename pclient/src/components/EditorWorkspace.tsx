"use client";

// Renders distinct editor workspaces for scheduling, analytics, advising, growth, billing, and collaboration.
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  CircleHelp,
  Copy,
  CreditCard,
  FileCheck2,
  Filter,
  Handshake,
  Lightbulb,
  Mail,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";

interface EditorWorkspaceProps {
  title: string;
  description: string;
  icon: WorkspaceIcon;
}
type WorkspaceIcon =
  | "calendar"
  | "analytics"
  | "advisor"
  | "referrals"
  | "billing"
  | "settings"
  | "sponsorship"
  | "mail"
  | "collaboration";
type Notice = (message: string) => void;
type DialogKind = "payment" | "photo" | "connection" | "sponsorship" | "compose" | "reply" | "invite";
type OpenDialog = (kind: DialogKind) => void;

const iconMap = {
  calendar: Calendar,
  analytics: TrendingUp,
  advisor: Lightbulb,
  referrals: Users,
  billing: WalletCards,
  settings: Settings,
  sponsorship: Handshake,
  mail: Mail,
  collaboration: Users,
};
const navLinks = [
  ["Post Schedule", "/editor/post-schedule", Calendar],
  ["Analytics", "/editor/analytics", TrendingUp],
  ["AI Advisor", "/editor/advisor", Lightbulb],
  ["Editor", "/editor/new-post", FileCheck2],
  ["Referrals", "/editor/referrals", Users],
  ["Billing", "/editor/billing", WalletCards],
  ["Sponsorship", "/editor/sponsorship", Handshake],
  ["Mails", "/editor/mails", Mail],
  ["Collaboration", "/editor/collaboration", Users],
] as const;

// Provides the protected workspace navigation and route-specific product surface.
export default function EditorWorkspace({
  title,
  description,
  icon,
}: EditorWorkspaceProps) {
  const [notice, setNotice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogKind | null>(null);
  const Icon = iconMap[icon];
  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }
  function openDialog(kind: DialogKind) {
    setDialog(kind);
  }
  return (
    <main className="workspace-shell">
      <header className="workspace-topbar">
        <Link href="/editor" className="dashboard-brand">
          <span className="dashboard-logo">
            <Sparkles size={15} />
          </span>
          <span>SocialNest</span>
        </Link>
        <div className="workspace-top-actions">
          <button
            type="button"
            onClick={() => notify("Notifications are clear")}
            aria-label="Notifications"
          >
            <Bell size={17} />
          </button>
          <Link href="/editor/settings" aria-label="Settings">
            <Settings size={17} />
          </Link>
          <button
            className="workspace-mobile-trigger"
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </header>
      <div className="workspace-frame">
        <aside className={`workspace-sidebar ${sidebarOpen ? "is-open" : ""}`}>
          <div className="workspace-sidebar-head">
            <span>Workspace</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
          </div>
          <nav>
            {navLinks.map(([label, href, NavIcon]) => (
              <Link
                className={label === title ? "is-active" : ""}
                href={href}
                key={label}
                onClick={() => setSidebarOpen(false)}
              >
                <NavIcon size={16} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="workspace-sidebar-foot">
            <Link href="/editor/settings">
              <Settings size={15} />
              Settings
            </Link>
            <button
              type="button"
              onClick={() => notify("Support center opened")}
            >
              <CircleHelp size={15} />
              Help support
            </button>
          </div>
        </aside>
        {sidebarOpen && (
          <button
            className="workspace-overlay"
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
        )}
        <section className="workspace-content">
          <div className="workspace-breadcrumb">
            <Link href="/editor">
              <ArrowLeft size={14} />
              Dashboard
            </Link>
            <span>/</span>
            <span>{title}</span>
          </div>
          <div className="workspace-title">
            <div className="workspace-title-icon">
              <Icon size={23} />
            </div>
            <div>
              <p>Editor workspace</p>
              <h1>{title}</h1>
              <span>{description}</span>
            </div>
          </div>
          {renderWorkspace(title, notify, openDialog)}
        </section>
      </div>
      {dialog && <WorkspaceDialog kind={dialog} onClose={() => setDialog(null)} notify={notify} />}
      {notice && (
        <div className="workspace-notice" role="status">
          {notice}
        </div>
      )}
    </main>
  );
}

// Renders the correct form and completion action for a workspace modal.
function WorkspaceDialog({ kind, onClose, notify }: { kind: DialogKind; onClose: () => void; notify: Notice }) {
  const [value, setValue] = useState("");
  const [option, setOption] = useState(kind === "connection" ? "Instagram" : kind === "payment" ? "MTN Mobile Money" : "Editor");
  const config = {
    payment: { kicker: "Billing", title: "Manage payment method", body: "Update the payment method used for your next plan renewal.", action: "Payment method updated" },
    photo: { kicker: "Profile", title: "Change profile photo", body: "Choose a new image for your Poste profile.", action: "Profile photo selected" },
    connection: { kicker: "Publishing channels", title: "Connect a social account", body: "Select a channel and continue to its secure connection flow.", action: `${option} connection started` },
    sponsorship: { kicker: "Partnership desk", title: "Add sponsorship opportunity", body: "Capture the brand brief so you can track deliverables and deadlines.", action: "Sponsorship opportunity saved" },
    compose: { kicker: "Mails", title: "Compose a message", body: "Start a new conversation with a collaborator or brand contact.", action: "Message draft created" },
    reply: { kicker: "Mails", title: "Reply to this message", body: "Your reply will stay attached to the current conversation.", action: "Reply draft created" },
    invite: { kicker: "Collaboration", title: "Invite a collaborator", body: "Give a teammate access to review and approve shared drafts.", action: "Invitation sent" },
  }[kind];

  function complete() {
    if ((kind === "photo" || kind === "invite" || kind === "compose" || kind === "reply") && !value.trim()) return;
    onClose();
    notify(config.action);
  }

  return <div className="workspace-dialog-backdrop" role="presentation" onClick={onClose}><section className="workspace-dialog workspace-dialog-specific" role="dialog" aria-modal="true" aria-labelledby="workspace-dialog-title" onClick={(event) => event.stopPropagation()}><button className="workspace-dialog-close" type="button" onClick={onClose} aria-label="Close dialog"><X size={16} /></button><span className="eyebrow-label">{config.kicker}</span><h2 id="workspace-dialog-title">{config.title}</h2><p>{config.body}</p>{kind === "payment" && <div className="dialog-form"><label>Payment method<select value={option} onChange={(event) => setOption(event.target.value)}><option>MTN Mobile Money</option><option>Orange Money</option><option>Visa card</option></select></label><label>Account or phone number<input value={value} onChange={(event) => setValue(event.target.value)} placeholder="e.g. 6 70 00 00 00" /></label></div>}{kind === "photo" && <div className="dialog-form"><label>Profile image<input type="file" accept="image/*" onChange={(event) => setValue(event.target.files?.[0]?.name ?? "")} /></label>{value && <small className="dialog-file-name">{value}</small>}</div>}{kind === "connection" && <div className="dialog-platform-options">{["Instagram", "Facebook", "Twitter"].map((item) => <button className={option === item ? "is-selected" : ""} type="button" key={item} onClick={() => setOption(item)}><span>{item[0]}</span>{item}<Check size={14} /></button>)}</div>}{kind === "sponsorship" && <div className="dialog-form"><label>Brand or campaign<input value={value} onChange={(event) => setValue(event.target.value)} placeholder="e.g. Campus creator campaign" /></label><label>Budget<select value={option} onChange={(event) => setOption(event.target.value)}><option>$450</option><option>$850</option><option>$1,200</option></select></label></div>}{(kind === "compose" || kind === "reply") && <div className="dialog-form"><label>Message<textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder="Write your message..." /></label></div>}{kind === "invite" && <div className="dialog-form"><label>Collaborator email<input value={value} onChange={(event) => setValue(event.target.value)} type="email" placeholder="name@example.com" /></label><label>Permission<select value={option} onChange={(event) => setOption(event.target.value)}><option>Editor</option><option>Reviewer</option><option>Admin</option></select></label></div>}<div className="workspace-dialog-actions"><button className="workspace-outline" type="button" onClick={onClose}>Cancel</button><button className="workspace-primary" type="button" onClick={complete}>{kind === "connection" ? "Continue to connect" : kind === "photo" ? "Use photo" : "Save and continue"}</button></div></section></div>;
}

// Selects a purpose-built UI for each editor destination.
function renderWorkspace(title: string, notify: Notice, openDialog: OpenDialog) {
  switch (title) {
    case "Post Schedule":
      return <SchedulePage notify={notify} />;
    case "Analytics":
      return <AnalyticsPage notify={notify} />;
    case "AI Advisor":
      return <AdvisorPage notify={notify} />;
    case "Referrals":
      return <ReferralsPage notify={notify} />;
    case "Billing":
      return <BillingPage notify={notify} openDialog={openDialog} />;
    case "Settings":
      return <SettingsPage notify={notify} openDialog={openDialog} />;
    case "Sponsorship":
      return <SponsorshipPage notify={notify} openDialog={openDialog} />;
    case "Mails":
      return <MailPage notify={notify} openDialog={openDialog} />;
    default:
      return <CollaborationPage notify={notify} openDialog={openDialog} />;
  }
}

function SchedulePage({ notify }: { notify: Notice }) {
  const [view, setView] = useState("Week");
  const [selectedDay, setSelectedDay] = useState("Thu 17");
  const posts = [
    {
      time: "09:00",
      title: "5 tools every creator should know",
      platform: "Instagram",
      tone: "blue",
    },
    {
      time: "13:30",
      title: "Behind the scenes: building Poste",
      platform: "Twitter",
      tone: "green",
    },
    {
      time: "18:00",
      title: "Your Thursday growth tip",
      platform: "Facebook",
      tone: "purple",
    },
  ];
  return (
    <div className="workspace-special schedule-special">
      <div className="special-toolbar">
        <div className="segmented-control">
          {["Day", "Week", "Month"].map((item) => (
            <button
              className={view === item ? "is-active" : ""}
              key={item}
              type="button"
              onClick={() => setView(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          className="workspace-primary"
          type="button"
          onClick={() => notify("Opening the post composer")}
        >
          <Plus size={16} />
          Create post
        </button>
      </div>
      <div className="schedule-summary">
        <div>
          <span>Scheduled this week</span>
          <strong>12 posts</strong>
          <small>+4 from last week</small>
        </div>
        <div>
          <span>Next publish</span>
          <strong>Today, 6:00 PM</strong>
          <small>Instagram · Thursday tip</small>
        </div>
        <div>
          <span>Best time</span>
          <strong>6:00 PM</strong>
          <small>Based on 28 posts</small>
        </div>
      </div>
      <div className="schedule-board">
        <div className="schedule-days">
          {[
            "Mon 14",
            "Tue 15",
            "Wed 16",
            "Thu 17",
            "Fri 18",
            "Sat 19",
            "Sun 20",
          ].map((day) => (
            <button
              className={selectedDay === day ? "is-selected" : ""}
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
            >
              {day.split(" ")[0]}
              <strong>{day.split(" ")[1]}</strong>
            </button>
          ))}
        </div>
        <div className="schedule-timeline">
          {["09:00", "12:00", "15:00", "18:00"].map((time) => (
            <div className="schedule-row" key={time}>
              <span>{time}</span>
              <div>
                {posts
                  .filter((post) => post.time === time)
                  .map((post) => (
                    <button
                      className={`scheduled-post ${post.tone}`}
                      type="button"
                      key={post.title}
                      onClick={() => notify(`${post.title} opened`)}
                    >
                      <strong>{post.title}</strong>
                      <small>{post.platform} · Draft ready</small>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage({ notify }: { notify: Notice }) {
  const [range, setRange] = useState("Last 30 days");
  const [platform, setPlatform] = useState("All platforms");
  return (
    <div className="workspace-special analytics-special">
      <div className="special-toolbar">
        <div>
          <span className="eyebrow-label">Performance report</span>
          <h2>Audience growth is trending upward</h2>
        </div>
        <div className="special-filters">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option>All platforms</option>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>Twitter</option>
          </select>
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>
      <div className="analytics-kpis">
        <div>
          <span>Followers</span>
          <strong>184,160</strong>
          <em>+3.2%</em>
        </div>
        <div>
          <span>Engagement rate</span>
          <strong>6.84%</strong>
          <em>+1.8%</em>
        </div>
        <div>
          <span>Published posts</span>
          <strong>48</strong>
          <em>+12%</em>
        </div>
        <div>
          <span>Profile visits</span>
          <strong>21.4K</strong>
          <em>+8.6%</em>
        </div>
      </div>
      <div className="analytics-chart-card">
        <div className="card-head">
          <div>
            <span className="eyebrow-label">
              {platform} · {range}
            </span>
            <h3>Follower growth</h3>
          </div>
          <button
            type="button"
            onClick={() => notify("Analytics CSV prepared")}
          >
            Export report <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="analytics-chart">
          <div className="chart-y">
            <span>200K</span>
            <span>150K</span>
            <span>100K</span>
            <span>50K</span>
            <span>0</span>
          </div>
          <div className="chart-area">
            <svg viewBox="0 0 700 230" preserveAspectRatio="none">
              <path
                className="analytics-fill"
                d="M0 190 C80 170 100 185 150 145 S230 152 290 112 S365 138 420 83 S500 103 550 61 S630 73 700 22 L700 230 L0 230Z"
              />
              <path
                className="analytics-line"
                d="M0 190 C80 170 100 185 150 145 S230 152 290 112 S365 138 420 83 S500 103 550 61 S630 73 700 22"
              />
            </svg>
            <div className="chart-x">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
        </div>
      </div>
      <div className="analytics-bottom">
        <div className="analytics-table-card">
          <div className="card-head">
            <h3>Top performing posts</h3>
            <button type="button" onClick={() => notify("All posts opened")}>
              View all
            </button>
          </div>
          {[
            "A simple system for consistent content",
            "3 lessons from our first 10K followers",
            "What I learned building in public",
          ].map((post, index) => (
            <button
              className="top-post-row"
              type="button"
              key={post}
              onClick={() => notify(`${post} opened`)}
            >
              <span>0{index + 1}</span>
              <strong>{post}</strong>
              <em>{["12.8%", "10.4%", "8.9%"][index]}</em>
            </button>
          ))}
        </div>
        <div className="best-times-card">
          <span className="eyebrow-label">Best posting window</span>
          <strong>Thursday · 6:00 PM</strong>
          <p>
            Posts published here earn 34% more engagement than your weekly
            average.
          </p>
          <button
            className="workspace-primary"
            type="button"
            onClick={() => notify("Schedule opened")}
          >
            Schedule a post
          </button>
        </div>
      </div>
    </div>
  );
}

function AdvisorPage({ notify }: { notify: Notice }) {
  const [niche, setNiche] = useState("Creator education");
  const [selected, setSelected] = useState(0);
  const ideas = useMemo(
    () => [
      {
        title: "The 15-minute content system",
        type: "Carousel",
        reason: "Your educational posts outperform your average by 42%.",
        time: "Thursday · 6:00 PM",
      },
      {
        title: "Behind the build: one honest lesson",
        type: "Short video",
        reason: "Personal stories are driving the most comments this month.",
        time: "Saturday · 11:30 AM",
      },
      {
        title: "Three tools I use every morning",
        type: "Single image",
        reason: "Practical list posts are easiest for your audience to save.",
        time: "Monday · 8:00 AM",
      },
    ],
    [],
  );
  return (
    <div className="workspace-special advisor-special">
      <div className="advisor-hero">
        <div className="advisor-orb">
          <Sparkles size={25} />
        </div>
        <div>
          <span className="eyebrow-label">Personalized advisor</span>
          <h2>Your next best post is waiting.</h2>
          <p>
            Recommendations combine your niche, audience behavior, and recent
            performance.
          </p>
        </div>
        <select value={niche} onChange={(e) => setNiche(e.target.value)}>
          <option>Creator education</option>
          <option>Fashion & lifestyle</option>
          <option>Small business</option>
          <option>Student life</option>
        </select>
      </div>
      <div className="advisor-layout">
        <div className="idea-stack">
          {ideas.map((idea, index) => (
            <button
              className={`advisor-idea ${selected === index ? "is-selected" : ""}`}
              type="button"
              key={idea.title}
              onClick={() => setSelected(index)}
            >
              <span className="idea-number">0{index + 1}</span>
              <div>
                <small>{idea.type}</small>
                <h3>{idea.title}</h3>
                <p>{idea.reason}</p>
              </div>
              <ChevronDown size={17} />
            </button>
          ))}
        </div>
        <div className="advisor-detail">
          <span className="eyebrow-label">Recommended next move</span>
          <h3>{ideas[selected].title}</h3>
          <p>{ideas[selected].reason}</p>
          <div className="advisor-time">
            <Calendar size={17} />
            <div>
              <span>Suggested time</span>
              <strong>{ideas[selected].time}</strong>
            </div>
          </div>
          <div className="advisor-actions">
            <button
              className="workspace-primary"
              type="button"
              onClick={() => notify("Idea added to composer")}
            >
              <Plus size={15} />
              Use this idea
            </button>
            <button
              className="workspace-outline"
              type="button"
              onClick={() => notify("More ideas generated")}
            >
              Generate more
            </button>
          </div>
        </div>
      </div>
      <div className="advisor-checklist">
        <Check size={17} />
        <span>
          <strong>Strong foundation:</strong> your last 7 posts have a
          consistent publishing cadence.
        </span>
      </div>
    </div>
  );
}

function ReferralsPage({ notify }: { notify: Notice }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="workspace-special referrals-special">
      <div className="referral-hero">
        <div>
          <span className="eyebrow-label">Creator rewards</span>
          <h2>Grow together, earn together.</h2>
          <p>
            Invite creators to Poste and earn credit when they activate a paid
            plan.
          </p>
        </div>
        <div className="referral-balance">
          <span>Available credit</span>
          <strong>$240.00</strong>
          <small>+ $60 this month</small>
        </div>
      </div>
      <div className="referral-link-card">
        <div>
          <span className="eyebrow-label">Your referral link</span>
          <strong>poste.app/join/james-edward</strong>
        </div>
        <button
          className="workspace-primary"
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(
              "https://poste.app/join/james-edward",
            );
            setCopied(true);
            notify(copied ? "Link copied again" : "Referral link copied");
          }}
        >
          <Copy size={15} />
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      <div className="referral-stats">
        <div>
          <Users size={18} />
          <span>Total referrals</span>
          <strong>24</strong>
        </div>
        <div>
          <TrendingUp size={18} />
          <span>Converted</span>
          <strong>12</strong>
        </div>
        <div>
          <WalletCards size={18} />
          <span>Lifetime earned</span>
          <strong>$480</strong>
        </div>
      </div>
      <div className="referral-table">
        <div className="card-head">
          <h3>Recent referral activity</h3>
          <button
            type="button"
            onClick={() => notify("Referral report exported")}
          >
            Export report
          </button>
        </div>
        {[
          "Mabel N. · Pro plan",
          "Chris T. · Signed up",
          "Brenda F. · Business plan",
        ].map((item, index) => (
          <div className="referral-row" key={item}>
            <span className="referral-avatar">{item[0]}</span>
            <strong>{item}</strong>
            <em>{index === 1 ? "Pending" : "+$20"}</em>
            <small>{index + 1}d ago</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingPage({ notify, openDialog }: { notify: Notice; openDialog: OpenDialog }) {
  const [plan, setPlan] = useState("Pro");
  return (
    <div className="workspace-special billing-special">
      <div className="billing-current">
        <div>
          <span className="eyebrow-label">Current plan</span>
          <h2>{plan} workspace</h2>
          <p>Your plan renews on October 16, 2026.</p>
        </div>
        <span className="billing-status">
          <Check size={13} />
          Active
        </span>
      </div>
      <div className="billing-plans">
        {[
          {
            name: "Free",
            price: "0",
            features: [
              "10 scheduled posts",
              "1 social account",
              "Basic analytics",
            ],
          },
          {
            name: "Pro",
            price: "19",
            features: ["Unlimited posts", "5 social accounts", "AI advisor"],
          },
          {
            name: "Business",
            price: "49",
            features: [
              "Unlimited everything",
              "Team collaboration",
              "Priority support",
            ],
          },
        ].map((item) => (
          <article
            className={plan === item.name ? "is-current" : ""}
            key={item.name}
          >
            <span>{item.name}</span>
            <strong>
              ${item.price}
              <small>/month</small>
            </strong>
            <ul>
              {item.features.map((feature) => (
                <li key={feature}>
                  <Check size={14} />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setPlan(item.name);
                notify(`${item.name} plan selected`);
              }}
            >
              {plan === item.name ? "Current plan" : "Choose plan"}
            </button>
          </article>
        ))}
      </div>
      <div className="payment-card">
        <div>
          <CreditCard size={20} />
          <div>
            <strong>MTN Mobile Money</strong>
            <span>•••• 0924 · Default payment method</span>
          </div>
        </div>
        <button
          className="workspace-outline"
          type="button"
          onClick={() => openDialog("payment")}
        >
          Manage
        </button>
      </div>
    </div>
  );
}

function SettingsPage({ notify, openDialog }: { notify: Notice; openDialog: OpenDialog }) {
  const [saved, setSaved] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  return (
    <div className="workspace-special settings-special">
      <div className="settings-grid">
        <section className="settings-card profile-card">
          <div className="settings-avatar">JE</div>
          <div>
            <span className="eyebrow-label">Profile</span>
            <h2>James Edward</h2>
            <p>Creator education · Bamenda, Cameroon</p>
          </div>
          <button
            className="workspace-outline"
            type="button"
            onClick={() => openDialog("photo")}
          >
            Change photo
          </button>
        </section>
        <section className="settings-card">
          <div className="card-head">
            <div>
              <span className="eyebrow-label">Account details</span>
              <h3>How Poste knows you</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setSaved(true);
                notify("Profile saved");
              }}
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>
          <label>
            Full name
            <input defaultValue="James Edward" />
          </label>
          <label>
            Email address
            <input defaultValue="james@socialnest.co" type="email" />
          </label>
          <label>
            Creator niche
            <select defaultValue="Creator education">
              <option>Creator education</option>
              <option>Small business</option>
              <option>Student life</option>
            </select>
          </label>
        </section>
        <section className="settings-card">
          <div className="card-head">
            <div>
              <span className="eyebrow-label">Notifications</span>
              <h3>Stay in the loop</h3>
            </div>
          </div>
          <label className="settings-toggle">
            <span>
              <strong>Weekly performance digest</strong>
              <small>A short summary of your audience growth.</small>
            </span>
            <input
              type="checkbox"
              checked={emailUpdates}
              onChange={(e) => setEmailUpdates(e.target.checked)}
            />
            <i />
          </label>
          <label className="settings-toggle">
            <span>
              <strong>Post reminders</strong>
              <small>Get notified before scheduled content goes live.</small>
            </span>
            <input type="checkbox" defaultChecked />
            <i />
          </label>
        </section>
        <section className="settings-card connections-card">
          <div className="card-head">
            <div>
              <span className="eyebrow-label">Connected accounts</span>
              <h3>Publishing channels</h3>
            </div>
            <button
              type="button"
              onClick={() => openDialog("connection")}
            >
              <Plus size={15} />
              Connect
            </button>
          </div>
          {["Instagram", "Facebook", "Twitter"].map((account, index) => (
            <div className="connection-row" key={account}>
              <span className={`connection-icon connection-${index}`}>
                {account[0]}
              </span>
              <strong>{account}</strong>
              <small>{index === 0 ? "Connected" : "Not connected"}</small>
              <button
                type="button"
                onClick={() => notify(`${account} connection settings opened`)}
              >
                {index === 0 ? "Manage" : "Connect"}
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function SponsorshipPage({ notify, openDialog }: { notify: Notice; openDialog: OpenDialog }) {
  const [filter, setFilter] = useState("All");
  const items = [
    {
      title: "Campus creator campaign",
      status: "Active",
      details: "$850 · 3 deliverables",
    },
    {
      title: "Tech tools launch",
      status: "In review",
      details: "$1,200 · Product launch",
    },
    {
      title: "Local coffee partnership",
      status: "Completed",
      details: "$450 · 2 posts",
    },
  ];
  const visibleItems = items.filter(
    (item) => filter === "All" || item.status === filter,
  );
  return (
    <div className="workspace-special sponsorship-special">
      <div className="sponsor-hero">
        <div>
          <span className="eyebrow-label">Partnership desk</span>
          <h2>Opportunities that fit your audience.</h2>
          <p>
            Keep brand conversations, deliverables, and campaign notes
            organized.
          </p>
        </div>
        <button
          className="workspace-primary"
          type="button"
          onClick={() => openDialog("sponsorship")}
        >
          <Plus size={15} />
          Add opportunity
        </button>
      </div>
      <div className="sponsor-filters">
        {["All", "Active", "In review", "Completed"].map((item) => (
          <button
            className={filter === item ? "is-active" : ""}
            key={item}
            type="button"
            onClick={() => setFilter(item)}
          >
            <Filter size={13} />
            {item}
          </button>
        ))}
      </div>
      <div className="sponsor-grid">
        {visibleItems.map((item, index) => (
          <article key={item.title}>
            <div className={`sponsor-cover cover-${index % 3}`}>
              <Handshake size={24} />
            </div>
            <div>
              <span className="sponsor-status">{item.status}</span>
              <h3>{item.title}</h3>
              <p>{item.details}</p>
              <button
                type="button"
                onClick={() => notify(`${item.title} opened`)}
              >
                View brief <ArrowUpRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!visibleItems.length && (
        <div className="workspace-empty-state">
          No {filter.toLowerCase()} opportunities yet.
        </div>
      )}
    </div>
  );
}

function MailPage({ notify, openDialog }: { notify: Notice; openDialog: OpenDialog }) {
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState("");
  const messages = [
    {
      from: "Maya from Buffer",
      subject: "Collaboration opportunity",
      preview: "We loved your recent creator systems post...",
    },
    {
      from: "Poste team",
      subject: "Your weekly digest is ready",
      preview: "Here is what moved in your workspace this week...",
    },
    {
      from: "Chris Thompson",
      subject: "Draft feedback",
      preview: "The revised caption looks great. One small...",
    },
  ];
  const visibleMessages = messages.filter((message) =>
    `${message.from} ${message.subject} ${message.preview}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const activeMessage =
    visibleMessages[selected] ?? visibleMessages[0] ?? messages[0];
  return (
    <div className="workspace-special mail-special">
      <div className="mail-toolbar">
        <button
          className="workspace-primary"
          type="button"
          onClick={() => openDialog("compose")}
        >
          <Plus size={15} />
          Compose
        </button>
        <label>
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            placeholder="Search messages"
          />
        </label>
      </div>
      <div className="mail-layout">
        <div className="mail-list">
          {visibleMessages.map((message, index) => (
            <button
              className={
                activeMessage.subject === message.subject ? "is-selected" : ""
              }
              type="button"
              key={message.subject}
              onClick={() => setSelected(index)}
            >
              <span className="mail-avatar">{message.from[0]}</span>
              <div>
                <strong>{message.from}</strong>
                <b>{message.subject}</b>
                <small>{message.preview}</small>
              </div>
              <time>{index + 1}h</time>
            </button>
          ))}
          {!visibleMessages.length && (
            <div className="workspace-empty-state">No messages found.</div>
          )}
        </div>
        <article className="mail-reader">
          <div className="mail-reader-head">
            <span className="mail-avatar">{activeMessage.from[0]}</span>
            <div>
              <strong>{activeMessage.from}</strong>
              <small>Today at 10:24 AM</small>
            </div>
            <button
              type="button"
              onClick={() => notify("Message options opened")}
            >
              <ChevronDown size={16} />
            </button>
          </div>
          <h2>{activeMessage.subject}</h2>
          <p>Hi James,</p>
          <p>
            {activeMessage.preview} We would love to explore a thoughtful
            collaboration that fits the audience you are already building on
            Poste.
          </p>
          <button
            className="workspace-primary"
            type="button"
            onClick={() => openDialog("reply")}
          >
            <MessageCircle size={15} />
            Reply
          </button>
        </article>
      </div>
    </div>
  );
}

function CollaborationPage({ notify, openDialog }: { notify: Notice; openDialog: OpenDialog }) {
  const [approved, setApproved] = useState<string[]>([]);
  const drafts = [
    "Thursday growth tip",
    "Creator systems carousel",
    "Bamenda student spotlight",
  ];
  const pending = drafts.filter((draft) => !approved.includes(draft));
  return (
    <div className="workspace-special collaboration-special">
      <div className="collaboration-hero">
        <div>
          <span className="eyebrow-label">Shared workspace</span>
          <h2>Keep every draft moving.</h2>
          <p>Review, comment, and approve content with your collaborators.</p>
        </div>
        <button
          className="workspace-primary"
          type="button"
          onClick={() => openDialog("invite")}
        >
          <Plus size={15} />
          Invite collaborator
        </button>
      </div>
      <div className="collaboration-board">
        <div>
          <div className="board-heading">
            <h3>Needs review</h3>
            <span>{pending.length}</span>
          </div>
          {pending.map((draft) => (
            <article className="collab-card" key={draft}>
              <span className="collab-avatar">{draft[0]}</span>
              <div>
                <strong>{draft}</strong>
                <small>Edited 24 minutes ago · James</small>
              </div>
              <button
                type="button"
                onClick={() => {
                  setApproved((items) => [...items, draft]);
                  notify(`${draft} approved`);
                }}
              >
                <Check size={15} />
              </button>
            </article>
          ))}
        </div>
        <div>
          <div className="board-heading">
            <h3>Approved</h3>
            <span>{approved.length}</span>
          </div>
          {approved.map((draft) => (
            <article className="collab-card is-approved" key={draft}>
              <Check size={16} />
              <div>
                <strong>{draft}</strong>
                <small>Ready to schedule</small>
              </div>
              <button
                type="button"
                onClick={() => notify("Draft schedule opened")}
              >
                <ArrowUpRight size={15} />
              </button>
            </article>
          ))}
          {!approved.length && (
            <div className="board-empty">
              <FileCheck2 size={22} />
              <span>Approved drafts will appear here.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
