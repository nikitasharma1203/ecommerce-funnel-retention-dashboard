import { useState } from "react";
import { aiInsights } from "../../data/mockData";

const typeColors = {
  good: { border: "#10b981", tag: "rgba(16,185,129,0.12)", tagText: "#10b981", glow: "rgba(16,185,129,0.08)" },
  bad:  { border: "#ef4444", tag: "rgba(239,68,68,0.12)",  tagText: "#ef4444", glow: "rgba(239,68,68,0.08)"  },
  warn: { border: "#f59e0b", tag: "rgba(245,158,11,0.12)", tagText: "#f59e0b", glow: "rgba(245,158,11,0.08)" },
};

function InsightCard({ insight, expanded, onToggle }) {
  const c = typeColors[insight.type] || typeColors.warn;
  return (
    <div
      style={{
        background: "var(--bg3)", borderRadius: 12,
        borderLeft: `3px solid ${c.border}`,
        padding: 16, cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        boxShadow: expanded ? `0 4px 20px ${c.glow}` : "none",
      }}
      onClick={onToggle}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ fontSize: 22, marginBottom: 8 }}>{insight.icon}</div>

      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
        {insight.title}
      </div>

      <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.55, marginBottom: 10 }}>
        {insight.text}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: expanded ? 12 : 0 }}>
        <span style={{ fontSize: 11, background: c.tag, color: c.tagText, borderRadius: 5, padding: "2px 8px" }}>
          {insight.tag}
        </span>
        {insight.impact && (
          <span style={{ fontSize: 11, background: "rgba(6,182,212,0.1)", color: "#06b6d4", borderRadius: 5, padding: "2px 8px" }}>
            💰 {insight.impact}
          </span>
        )}
      </div>

      {expanded && (
        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 0,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 12, color: "var(--text3)" }}>Recommended action:</span>
          <span style={{
            fontSize: 12, fontWeight: 600, color: "var(--accent)",
            background: "rgba(99,102,241,0.1)", borderRadius: 6, padding: "3px 10px",
          }}>
            → {insight.action}
          </span>
        </div>
      )}
    </div>
  );
}

export default function AIPage() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? aiInsights
    : aiInsights.filter(i => i.type === filter);

  const counts = {
    all:  aiInsights.length,
    bad:  aiInsights.filter(i => i.type === "bad").length,
    warn: aiInsights.filter(i => i.type === "warn").length,
    good: aiInsights.filter(i => i.type === "good").length,
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          AI Insights Panel{" "}
          <span style={{
            fontSize: 13, fontWeight: 600,
            background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))",
            border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8,
            padding: "3px 10px", color: "#a5b4fc", verticalAlign: "middle",
          }}>
            ✨ AI-Powered
          </span>
        </h1>
        <p className="page-sub">
          Rule-based insights from behavioral data · Ready for Gemini / OpenAI upgrade
        </p>
      </div>

      {/* Anomaly callout */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)",
        borderRadius: 10, padding: "10px 16px", marginBottom: 20, flexWrap: "wrap",
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s ease-in-out infinite" }} />
        <span style={{ fontSize: 13, color: "#fca5a5", fontWeight: 500 }}>
          Anomaly detected: Cart abandonment spike on mobile · Nov 14–18, 2019
        </span>
        <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: "auto" }}>
          Likely cause: Payment gateway latency during peak hours
        </span>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {[
          { key: "all",  label: `All (${counts.all})`,        color: "#6366f1" },
          { key: "bad",  label: `⚠️ Issues (${counts.bad})`,  color: "#ef4444" },
          { key: "warn", label: `🔔 Watch (${counts.warn})`,  color: "#f59e0b" },
          { key: "good", label: `✅ Wins (${counts.good})`,   color: "#10b981" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
            border: `1px solid ${filter === f.key ? f.color : "var(--border)"}`,
            background: filter === f.key ? `${f.color}15` : "transparent",
            color: filter === f.key ? f.color : "var(--text2)",
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          }}>
            {f.label}
          </button>
        ))}

        <button style={{
          marginLeft: "auto", padding: "6px 14px", borderRadius: 8,
          border: "1px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)",
          color: "var(--accent)", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
        }}>
          🤖 Generate with Gemini API
        </button>
      </div>

      {/* Insights grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
        {filtered.map((insight, i) => (
          <InsightCard
            key={i}
            insight={insight}
            expanded={expanded === i}
            onToggle={() => setExpanded(expanded === i ? null : i)}
          />
        ))}
      </div>

      {/* Coming soon banner */}
      <div style={{
        marginTop: 20, background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))",
        border: "1px solid rgba(99,102,241,0.18)", borderRadius: 12, padding: "20px 24px",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <span style={{ fontSize: 32 }}>🚀</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
            Upgrade to Live AI Insights
          </div>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.55 }}>
            Connect a Gemini or OpenAI API key to generate dynamic insights from your uploaded CSV data.
            The system will automatically detect anomalies, identify trends, and generate prioritized
            recommendations — updated every time you upload new data.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {["Gemini 1.5 Pro", "GPT-4o", "Claude Sonnet"].map(m => (
              <span key={m} style={{
                fontSize: 11, background: "rgba(99,102,241,0.12)", color: "var(--accent)",
                borderRadius: 6, padding: "3px 10px", border: "1px solid rgba(99,102,241,0.2)",
              }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
