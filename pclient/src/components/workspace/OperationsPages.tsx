"use client";

// Provides settings, sponsorship, mail, and collaboration workspaces.
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Filter,
  Handshake,
  MessageCircle,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import type { Notice, OpenDialog } from "./EditorWorkspaceTypes";

export function SettingsPage({
  notify,
  openDialog,
}: {
  notify: Notice;
  openDialog: OpenDialog;
}) {
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState(true);
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
              checked={email}
              onChange={(event) => setEmail(event.target.checked)}
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
            <button type="button" onClick={() => openDialog("connection")}>
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
                onClick={() =>
                  index === 0
                    ? notify(`${account} connection settings opened`)
                    : openDialog("connection")
                }
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

export function SponsorshipPage({
  notify,
  openDialog,
}: {
  notify: Notice;
  openDialog: OpenDialog;
}) {
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
  const visible = items.filter(
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
        {visible.map((item, index) => (
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
                      onClick={() => openDialog("brief")}
              >
                View brief <ArrowUpRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="workspace-empty-state">
          No {filter.toLowerCase()} opportunities yet.
        </div>
      )}
    </div>
  );
}

export function MailPage({
  notify,
  openDialog,
}: {
  notify: Notice;
  openDialog: OpenDialog;
}) {
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
  const visible = messages.filter((message) =>
    `${message.from} ${message.subject} ${message.preview}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const active = visible[selected] ?? visible[0] ?? messages[0];
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
          {visible.map((message, index) => (
            <button
              className={
                active.subject === message.subject ? "is-selected" : ""
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
          {!visible.length && (
            <div className="workspace-empty-state">No messages found.</div>
          )}
        </div>
        <article className="mail-reader">
          <div className="mail-reader-head">
            <span className="mail-avatar">{active.from[0]}</span>
            <div>
              <strong>{active.from}</strong>
              <small>Today at 10:24 AM</small>
            </div>
            <button
              type="button"
                    onClick={() => openDialog("messageOptions")}
            >
              <ChevronDown size={16} />
            </button>
          </div>
          <h2>{active.subject}</h2>
          <p>Hi James,</p>
          <p>
            {active.preview} We would love to explore a thoughtful collaboration
            that fits the audience you are already building on Poste.
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

export function CollaborationPage({
  notify,
  openDialog,
}: {
  notify: Notice;
  openDialog: OpenDialog;
}) {
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
                      onClick={() => openDialog("schedule")}
              >
                <ArrowUpRight size={15} />
              </button>
            </article>
          ))}
          {!approved.length && (
            <div className="board-empty">
              <Settings size={22} />
              <span>Approved drafts will appear here.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
