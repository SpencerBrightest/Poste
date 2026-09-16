"use client";

// Provides planning, analytics, and AI advisor workspace pages.
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Check,
  ChevronDown,
  Plus,
  Sparkles,
} from "lucide-react";
import type { Notice, OpenDialog } from "./EditorWorkspaceTypes";

export function SchedulePage({ notify, openDialog }: { notify: Notice; openDialog: OpenDialog }) {
  const [view, setView] = useState("Week");
  const [day, setDay] = useState("Thu 17");
  const [posts, setPosts] = useState([
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
  ]);
  useEffect(() => {
    const timer = window.setInterval(
      () => setPosts((items) => [...items]),
      5000,
    );
    return () => window.clearInterval(timer);
  }, []);
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
          onClick={() => openDialog("schedule")}
        >
          <Plus size={16} />
          Create post
        </button>
      </div>
      <div className="schedule-summary">
        <div>
          <span>Scheduled this week</span>
          <strong>{posts.length + 9} posts</strong>
          <small>Live queue</small>
        </div>
        <div>
          <span>Next publish</span>
          <strong>Today, 6:00 PM</strong>
          <small>Instagram · Thursday tip</small>
        </div>
        <div>
          <span>Best time</span>
          <strong>6:00 PM</strong>
          <small>Based on recent posts</small>
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
          ].map((item) => (
            <button
              className={day === item ? "is-selected" : ""}
              key={item}
              type="button"
              onClick={() => setDay(item)}
            >
              {item.split(" ")[0]}
              <strong>{item.split(" ")[1]}</strong>
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
                      onClick={() => openDialog("post")}
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

export function AnalyticsPage({ notify, openDialog }: { notify: Notice; openDialog: OpenDialog }) {
  const [range, setRange] = useState("Last 30 days");
  const [platform, setPlatform] = useState("All platforms");
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="workspace-special analytics-special">
      <div className="special-toolbar">
        <div>
          <span className="eyebrow-label">
            Performance report · refresh {refresh}
          </span>
          <h2>Audience growth is trending upward</h2>
        </div>
        <div className="special-filters">
          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            <option>All platforms</option>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>Twitter</option>
          </select>
          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
          >
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button
            className="workspace-outline"
            type="button"
            onClick={() => setRefresh((value) => value + 1)}
          >
            Refresh
          </button>
        </div>
      </div>
      <div className="analytics-kpis">
        <div>
          <span>Followers</span>
          <strong>{(184160 + refresh * 41).toLocaleString()}</strong>
          <em>+3.2%</em>
        </div>
        <div>
          <span>Engagement rate</span>
          <strong>6.84%</strong>
          <em>+1.8%</em>
        </div>
        <div>
          <span>Published posts</span>
          <strong>{48 + refresh}</strong>
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
            onClick={() => openDialog("post")}
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
            <button type="button" onClick={() => openDialog("post")}>
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
              onClick={() => openDialog("post")}
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
            onClick={() => openDialog("schedule")}
          >
            Schedule a post
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdvisorPage({ notify, openDialog }: { notify: Notice; openDialog: OpenDialog }) {
  const [niche, setNiche] = useState("Creator education");
  const [selected, setSelected] = useState(0);
  const [generated, setGenerated] = useState(0);
  const ideas = useMemo(
    () => [
      {
        title: "The 15-minute content system",
        type: "Carousel",
        reason: `Your ${niche.toLowerCase()} posts outperform your average by 42%.`,
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
    [niche],
  );
  return (
    <div className="workspace-special advisor-special">
      <div className="advisor-hero">
        <div className="advisor-orb">
          <Sparkles size={25} />
        </div>
        <div>
          <span className="eyebrow-label">
            Personalized advisor · {generated} new ideas
          </span>
          <h2>Your next best post is waiting.</h2>
          <p>
            Recommendations combine your niche, audience behavior, and recent
            performance.
          </p>
        </div>
        <select
          value={niche}
          onChange={(event) => setNiche(event.target.value)}
        >
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
              onClick={() => openDialog("advisorIdea")}
            >
              <Plus size={15} />
              Use this idea
            </button>
            <button
              className="workspace-outline"
              type="button"
              onClick={() => {
                setGenerated((value) => value + 1);
                notify("More ideas generated");
              }}
            >
              Generate more
            </button>
          </div>
        </div>
      </div>
      <div className="advisor-checklist">
        <Check size={17} />
        <span>
          <strong>Strong foundation:</strong> your recent publishing cadence is
          consistent.
        </span>
      </div>
    </div>
  );
}
