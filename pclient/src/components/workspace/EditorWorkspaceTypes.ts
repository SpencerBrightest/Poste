// Shared contracts and navigation metadata for protected editor workspaces.
import { Calendar, FileCheck2, Handshake, Lightbulb, Mail, Settings, TrendingUp, Users, WalletCards } from "lucide-react";

export type WorkspaceIcon = "calendar" | "analytics" | "advisor" | "referrals" | "billing" | "settings" | "sponsorship" | "mail" | "collaboration";
export type Notice = (message: string) => void;
export type DialogKind = "payment" | "photo" | "connection" | "sponsorship" | "compose" | "reply" | "invite" | "post" | "brief" | "messageOptions" | "schedule" | "advisorIdea" | "support";
export type OpenDialog = (kind: DialogKind) => void;

export const workspaceIcons = { calendar: Calendar, analytics: TrendingUp, advisor: Lightbulb, referrals: Users, billing: WalletCards, settings: Settings, sponsorship: Handshake, mail: Mail, collaboration: Users };
export const workspaceNavigation = [
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
