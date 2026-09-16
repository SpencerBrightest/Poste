"use client";

// Renders contextual forms for workspace actions instead of a generic confirmation.
import { useState } from "react";
import { Check, X } from "lucide-react";
import type { DialogKind, Notice } from "./EditorWorkspaceTypes";

interface WorkspaceDialogProps {
  kind: DialogKind;
  onClose: () => void;
  notify: Notice;
}

// Provides a specific form and completion message for each workspace action.
export default function WorkspaceDialog({
  kind,
  onClose,
  notify,
}: WorkspaceDialogProps) {
  const [value, setValue] = useState("");
  const [option, setOption] = useState(
    kind === "connection"
      ? "Instagram"
      : kind === "payment"
        ? "MTN Mobile Money"
        : "Editor",
  );
  const config = {
    payment: {
      kicker: "Billing",
      title: "Manage payment method",
      body: "Update the payment method used for your next plan renewal.",
      action: "Payment method updated",
    },
    photo: {
      kicker: "Profile",
      title: "Change profile photo",
      body: "Choose a new image for your Poste profile.",
      action: "Profile photo selected",
    },
    connection: {
      kicker: "Publishing channels",
      title: "Connect a social account",
      body: "Select a channel and continue to its secure connection flow.",
      action: `${option} connection started`,
    },
    sponsorship: {
      kicker: "Partnership desk",
      title: "Add sponsorship opportunity",
      body: "Capture the brand brief so you can track deliverables and deadlines.",
      action: "Sponsorship opportunity saved",
    },
    compose: {
      kicker: "Mails",
      title: "Compose a message",
      body: "Start a new conversation with a collaborator or brand contact.",
      action: "Message draft created",
    },
    reply: {
      kicker: "Mails",
      title: "Reply to this message",
      body: "Your reply will stay attached to the current conversation.",
      action: "Reply draft created",
    },
    invite: {
      kicker: "Collaboration",
      title: "Invite a collaborator",
      body: "Give a teammate access to review and approve shared drafts.",
      action: "Invitation sent",
    },
    post: { kicker: "Scheduled content", title: "Post details", body: "Review the caption, platform, and publishing status for this scheduled post.", action: "Post details opened" },
    brief: { kicker: "Partnership desk", title: "Campaign brief", body: "Review deliverables, budget, audience fit, and the next campaign milestone.", action: "Campaign brief opened" },
    messageOptions: { kicker: "Mails", title: "Message options", body: "Choose an action for this conversation: archive, mark unread, or flag for follow-up.", action: "Message options ready" },
    schedule: { kicker: "Publishing", title: "Schedule a post", body: "Choose a time and continue in the full post composer.", action: "Post scheduler opened" },
    advisorIdea: { kicker: "AI Advisor", title: "Use this recommendation", body: "The recommendation will be copied into a new post draft for you to refine.", action: "Recommendation added to a new draft" },
    support: { kicker: "Poste support", title: "Contact support", body: "Tell us what you need help with and the support team will follow up.", action: "Support request started" },
  }[kind];

  // Completes the current contextual form only when required input exists.
  function complete() {
    if (
      (kind === "photo" ||
        kind === "invite" ||
        kind === "compose" ||
        kind === "reply") &&
      !value.trim()
    )
      return;
    onClose();
    notify(config.action);
  }

  return (
    <div
      className="workspace-dialog-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="workspace-dialog workspace-dialog-specific"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="workspace-dialog-close"
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>
        <span className="eyebrow-label">{config.kicker}</span>
        <h2 id="workspace-dialog-title">{config.title}</h2>
        <p>{config.body}</p>
        {kind === "payment" && (
          <div className="dialog-form">
            <label>
              Payment method
              <select
                value={option}
                onChange={(event) => setOption(event.target.value)}
              >
                <option>MTN Mobile Money</option>
                <option>Orange Money</option>
                <option>Visa card</option>
              </select>
            </label>
            <label>
              Account or phone number
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="e.g. 6 70 00 00 00"
              />
            </label>
          </div>
        )}
        {kind === "photo" && (
          <div className="dialog-form">
            <label>
              Profile image
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setValue(event.target.files?.[0]?.name ?? "")
                }
              />
            </label>
            {value && <small className="dialog-file-name">{value}</small>}
          </div>
        )}
        {kind === "connection" && (
          <div className="dialog-platform-options">
            {["Instagram", "Facebook", "Twitter"].map((item) => (
              <button
                className={option === item ? "is-selected" : ""}
                type="button"
                key={item}
                onClick={() => setOption(item)}
              >
                <span>{item[0]}</span>
                {item}
                <Check size={14} />
              </button>
            ))}
          </div>
        )}
        {kind === "sponsorship" && (
          <div className="dialog-form">
            <label>
              Brand or campaign
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="e.g. Campus creator campaign"
              />
            </label>
            <label>
              Budget
              <select
                value={option}
                onChange={(event) => setOption(event.target.value)}
              >
                <option>$450</option>
                <option>$850</option>
                <option>$1,200</option>
              </select>
            </label>
          </div>
        )}
        {(kind === "compose" || kind === "reply") && (
          <div className="dialog-form">
            <label>
              Message
              <textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Write your message..."
              />
            </label>
          </div>
        )}
        {kind === "invite" && (
          <div className="dialog-form">
            <label>
              Collaborator email
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                type="email"
                placeholder="name@example.com"
              />
            </label>
            <label>
              Permission
              <select
                value={option}
                onChange={(event) => setOption(event.target.value)}
              >
                <option>Editor</option>
                <option>Reviewer</option>
                <option>Admin</option>
              </select>
            </label>
          </div>
        )}
        <div className="workspace-dialog-actions">
          <button className="workspace-outline" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="workspace-primary"
            type="button"
            onClick={complete}
          >
            {kind === "connection"
              ? "Continue to connect"
              : kind === "photo"
                ? "Use photo"
                : "Save and continue"}
          </button>
        </div>
      </section>
    </div>
  );
}
