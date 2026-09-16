"use client";

// Renders the interactive social post composer and platform previews.
import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import {
  AtSign,
  Bold,
  Calendar,
  Check,
  ChevronDown,
  FileText,
  ImagePlus,
  Italic,
  Link,
  List,
  ListOrdered,
  Menu,
  MessageCircle,
  Paperclip,
  Send,
  Sparkles,
  X,
} from "lucide-react";

interface ContentStudioProps {
  firstName: string;
  imageUrl: string;
}

type PreviewPlatform = "Instagram" | "Twitter" | "LinkedIn";
type PublishMode = "now" | "schedule";

const emojis = ["😀", "🔥", "✨", "❤️", "🚀", "👏", "📈", "☕"];

// Provides a responsive content studio with a synchronized social preview.
export default function ContentStudio({ firstName, imageUrl }: ContentStudioProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState<PreviewPlatform>("Instagram");
  const [mode, setMode] = useState<PublishMode>("now");
  const [scheduleDate, setScheduleDate] = useState("2026-09-16T10:00");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkField, setShowLinkField] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [mediaUrl, setMediaUrl] = useState("/workspace_preview.jpg");
  const [mediaName, setMediaName] = useState("workspace_preview.jpg");
  const [notice, setNotice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const displayName = firstName || "Creator";
  const characterLimit = platform === "Twitter" ? 280 : 2200;

  // Displays temporary feedback for local editor actions and API-ready actions.
  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  // Inserts formatting markers around the current selection in the caption field.
  function formatSelection(prefix: string, suffix = prefix) {
    const editor = editorRef.current;
    if (!editor) return;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = caption.slice(start, end) || "your text";
    const nextCaption = `${caption.slice(0, start)}${prefix}${selected}${suffix}${caption.slice(end)}`;
    setCaption(nextCaption);
    requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  }

  // Adds a local media file and turns it into the live preview image.
  function handleMediaChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMediaName(file.name);
    setMediaUrl(URL.createObjectURL(file));
    showNotice(`${file.name} attached`);
  }

  // Saves the current composer state as a draft placeholder until persistence is connected.
  function saveDraft() {
    showNotice(`Draft saved for ${displayName}`);
  }

  // Validates the composer before simulating a publish or scheduled post.
  function publishPost() {
    if (!caption.trim()) {
      showNotice("Write a caption before publishing");
      editorRef.current?.focus();
      return;
    }
    showNotice(mode === "now" ? `Post published to ${platform}` : `Post scheduled for ${scheduleDate.replace("T", " ")}`);
  }

  return (
    <div className="studio-shell">
      <header className="studio-mobile-header">
        <a className="dashboard-brand" href="/editor"><span className="dashboard-logo"><Sparkles size={15} /></span><span>SocialNest</span></a>
        <button className="studio-menu-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open editor navigation"><Menu size={20} /></button>
      </header>
      <aside className={`studio-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="studio-brand-row"><a className="dashboard-brand" href="/editor"><span className="dashboard-logo"><Sparkles size={15} /></span><span>SocialNest</span></a><button className="studio-menu-button studio-close" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close editor navigation"><X size={18} /></button></div>
        <p className="studio-sidebar-label">Create</p>
        <a className="studio-side-link is-active" href="/editor/new-post"><FileText size={16} />New post</a>
        <a className="studio-side-link" href="/editor"><MessageCircle size={16} />Back to overview</a>
        <a className="studio-side-link" href="/editor"><Calendar size={16} />Post schedule</a>
        <div className="studio-side-note"><Sparkles size={16} /><strong>AI advisor</strong><span>Turn an idea into a stronger caption.</span><button type="button" onClick={() => showNotice("AI advisor opened")}>Get ideas <Send size={13} /></button></div>
      </aside>
      {sidebarOpen && <button className="studio-overlay" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close editor navigation" />}

      <main className="studio-main">
        <div className="studio-breadcrumb"><a href="/editor">Dashboard</a><span>/</span><strong>New Post</strong></div>
        <div className="studio-layout">
          <section className="studio-composer" aria-labelledby="studio-heading">
            <div className="studio-heading-row"><div><p className="studio-kicker">Content studio</p><h1 id="studio-heading">New Post</h1></div><span className="studio-status"><span />Autosaved just now</span></div>
            <div className="studio-field-label"><span>Caption</span><span>{caption.length}/{characterLimit}</span></div>
            <div className="studio-editor-box">
              <div className="studio-toolbar" aria-label="Formatting toolbar">
                <button type="button" onClick={() => formatSelection("**")} aria-label="Bold"><Bold size={19} /></button><button type="button" onClick={() => formatSelection("_")} aria-label="Italic"><Italic size={19} /></button><button type="button" onClick={() => setShowLinkField((visible) => !visible)} aria-label="Add link"><Link size={19} /></button><button type="button" onClick={() => formatSelection("1. ", "")} aria-label="Numbered list"><ListOrdered size={19} /></button><button type="button" onClick={() => formatSelection("- ", "")} aria-label="Bullet list"><List size={19} /></button><button type="button" onClick={() => setShowLinkField((visible) => !visible)} aria-label="Attach link"><Paperclip size={19} /></button>
              </div>
              {showLinkField && <div className="studio-link-field"><Link size={15} /><input value={linkValue} onChange={(event) => setLinkValue(event.target.value)} placeholder="Paste a link" aria-label="Post link" /><button type="button" onClick={() => { setCaption((current) => `${current}${current ? " " : ""}${linkValue}`); setLinkValue(""); setShowLinkField(false); }}>Insert</button></div>}
              <textarea ref={editorRef} value={caption} maxLength={characterLimit} onChange={(event) => setCaption(event.target.value)} placeholder="What's on your mind?..." aria-label="Post caption" />
            </div>
            <div className="studio-caption-actions"><div className="emoji-wrap"><button className="emoji-button" type="button" onClick={() => setShowEmojiPicker((visible) => !visible)}>😀 <span>Emoji Picker</span></button>{showEmojiPicker && <div className="emoji-picker">{emojis.map((emoji) => <button key={emoji} type="button" onClick={() => { setCaption((current) => `${current}${emoji}`); setShowEmojiPicker(false); }}>{emoji}</button>)}</div>}</div><span>{caption.length}/{characterLimit}</span></div>
            <button className="studio-upload" type="button" onClick={() => fileRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) { setMediaName(file.name); setMediaUrl(URL.createObjectURL(file)); showNotice(`${file.name} attached`); } }}><input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleMediaChange} /><ImagePlus size={30} /><strong>{mediaName === "workspace_preview.jpg" ? "Upload Media" : mediaName}</strong><span>or Drag &amp; Drop files here</span></button>
          </section>

          <section className="studio-preview-panel" aria-labelledby="preview-heading">
            <div className="studio-heading-row"><div><p className="studio-kicker">Live output</p><h2 id="preview-heading">Social Media Preview</h2></div><span className="preview-live"><span />Live</span></div>
            <div className="preview-tabs">{(["Instagram", "Twitter", "LinkedIn"] as PreviewPlatform[]).map((name) => <button className={platform === name ? "is-active" : ""} key={name} type="button" onClick={() => setPlatform(name)}>{name === "Instagram" ? <AtSign size={22} /> : name === "Twitter" ? <Send size={22} /> : <span className="linkedin-mark">in</span>}{name}</button>)}</div>
            <div className={`social-preview-card preview-${platform.toLowerCase()}`}>
              <div className="preview-account"><div className="preview-avatar">{imageUrl ? <Image src={imageUrl} alt="" width={35} height={35} unoptimized /> : <span>{displayName[0]}</span>}</div><strong>{displayName}</strong><span className="preview-more">•••</span></div>
              <Image className="preview-media" src={mediaUrl} alt="Attached post media" width={500} height={320} unoptimized />
              <div className="preview-actions"><span>♥</span><MessageCircle size={20} /><Send size={20} /><span>♡</span></div>
              <p className="preview-caption"><strong>{displayName}</strong> {caption || "Share a simple idea with your audience and start a conversation."}</p>
              {linkValue && <p className="preview-link">{linkValue}</p>}
            </div>
          </section>
        </div>
        <footer className="studio-publish-bar"><div className="publish-mode"><label><input type="radio" checked={mode === "now"} onChange={() => setMode("now")} />Post Now</label><label><input type="radio" checked={mode === "schedule"} onChange={() => setMode("schedule")} />Schedule</label>{mode === "schedule" && <label className="studio-date-input"><Calendar size={17} /><input type="datetime-local" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} /></label>}</div><div className="publish-actions"><button className="studio-draft-button" type="button" onClick={saveDraft}>Draft</button><button className="studio-publish-button" type="button" onClick={publishPost}><Check size={17} />{mode === "now" ? "Publish Post" : "Schedule Post"}</button></div></footer>
        {notice && <div className="studio-toast" role="status">{notice}</div>}
      </main>
    </div>
  );
}
