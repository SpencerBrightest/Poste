"use client";

// Composes the protected editor shell with the selected page workspace.
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Bell, CircleHelp, Settings, Sparkles, X } from "lucide-react";
import WorkspaceDialog from "./workspace/WorkspaceDialog";
import { workspaceIcons, workspaceNavigation } from "./workspace/EditorWorkspaceTypes";
import type { DialogKind, Notice, OpenDialog, WorkspaceIcon } from "./workspace/EditorWorkspaceTypes";
import { AdvisorPage, AnalyticsPage, SchedulePage } from "./workspace/PlanningPages";
import { BillingPage, ReferralsPage } from "./workspace/GrowthPages";
import { CollaborationPage, MailPage, SettingsPage, SponsorshipPage } from "./workspace/OperationsPages";

interface EditorWorkspaceProps { title: string; description: string; icon: WorkspaceIcon; }

// Provides shared navigation, notices, contextual modals, and page composition.
export default function EditorWorkspace({ title, description, icon }: EditorWorkspaceProps) {
  const [notice, setNotice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogKind | null>(null);
  const Icon = workspaceIcons[icon];

  function notify(message: string) { setNotice(message); window.setTimeout(() => setNotice(""), 2800); }
  function openDialog(kind: DialogKind) { setDialog(kind); }

  return <main className="workspace-shell"><header className="workspace-topbar"><Link href="/editor" className="dashboard-brand"><span className="dashboard-logo"><Sparkles size={15} /></span><span>Poste.</span></Link><div className="workspace-top-actions"><button type="button" onClick={() => notify("Notifications are clear")} aria-label="Notifications"><Bell size={17} /></button><Link href="/editor/settings" aria-label="Settings"><Settings size={17} /></Link><button className="workspace-mobile-trigger" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><span>Menu</span></button></div></header><div className="workspace-frame"><aside className={`workspace-sidebar ${sidebarOpen ? "is-open" : ""}`}><div className="workspace-sidebar-head"><span>Workspace</span><button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={16} /></button></div><nav>{workspaceNavigation.map(([label, href, NavIcon]) => <Link className={label === title ? "is-active" : ""} href={href} key={label} onClick={() => setSidebarOpen(false)}><NavIcon size={16} /><span>{label}</span></Link>)}</nav><div className="workspace-sidebar-foot"><Link href="/editor/settings"><Settings size={15} />Settings</Link><button type="button" onClick={() => notify("Support center opened")}><CircleHelp size={15} />Help support</button></div></aside>{sidebarOpen && <button className="workspace-overlay" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}<section className="workspace-content"><div className="workspace-breadcrumb"><Link href="/editor"><ArrowLeft size={14} />Dashboard</Link><span>/</span><span>{title}</span></div><div className="workspace-title"><div className="workspace-title-icon"><Icon size={23} /></div><div><p>Editor workspace</p><h1>{title}</h1><span>{description}</span></div></div><WorkspacePage title={title} notify={notify} openDialog={openDialog} /></section></div>{dialog && <WorkspaceDialog kind={dialog} onClose={() => setDialog(null)} notify={notify} />}{notice && <div className="workspace-notice" role="status">{notice}</div>}</main>;
}

// Selects the page-specific workspace without putting page implementations in the shell.
function WorkspacePage({ title, notify, openDialog }: { title: string; notify: Notice; openDialog: OpenDialog }) {
  switch (title) {
    case "Post Schedule": return <SchedulePage notify={notify} openDialog={openDialog} />;
    case "Analytics": return <AnalyticsPage notify={notify} openDialog={openDialog} />;
    case "AI Advisor": return <AdvisorPage notify={notify} openDialog={openDialog} />;
    case "Referrals": return <ReferralsPage notify={notify} />;
    case "Billing": return <BillingPage notify={notify} openDialog={openDialog} />;
    case "Settings": return <SettingsPage notify={notify} openDialog={openDialog} />;
    case "Sponsorship": return <SponsorshipPage notify={notify} openDialog={openDialog} />;
    case "Mails": return <MailPage notify={notify} openDialog={openDialog} />;
    default: return <CollaborationPage notify={notify} openDialog={openDialog} />;
  }
}
