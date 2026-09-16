"use client";

// Provides referral and billing workspaces with live local state.
import { useState } from "react";
import {
  Check,
  Copy,
  CreditCard,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import type { Notice, OpenDialog } from "./EditorWorkspaceTypes";

export function ReferralsPage({ notify }: { notify: Notice }) {
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState(24);
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
          <strong>${240 + (referrals - 24) * 20}.00</strong>
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
            notify("Referral link copied");
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
          <strong>{referrals}</strong>
        </div>
        <div>
          <TrendingUp size={18} />
          <span>Converted</span>
          <strong>12</strong>
        </div>
        <div>
          <WalletCards size={18} />
          <span>Lifetime earned</span>
          <strong>${480 + (referrals - 24) * 20}</strong>
        </div>
      </div>
      <div className="referral-table">
        <div className="card-head">
          <h3>Recent referral activity</h3>
          <button
            type="button"
            onClick={() => {
              setReferrals((value) => value + 1);
              notify("Referral report refreshed");
            }}
          >
            Refresh activity
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

export function BillingPage({
  notify,
  openDialog,
}: {
  notify: Notice;
  openDialog: OpenDialog;
}) {
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
