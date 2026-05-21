import { keyFindings, recommendations, growthOpportunities } from "../../data/mockData";

function StoryBlock({ title, subtitle, color, children }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}0d, ${color}07)`,
      border: `1px solid ${color}30`,
      borderRadius: 14, padding: "24px", marginBottom: 16,
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
        {title}
      </div>
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 20 }}>{subtitle}</p>
      {children}
    </div>
  );
}

function Finding({ item }) {
  return (
    <div style={{
      display: "flex", gap: 12, marginBottom: 12, padding: "14px 16px",
      background: "rgba(0,0,0,0.15)", borderRadius: 10,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%",
        background: item.color || "var(--accent)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
      }}>
        {item.n}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
          {item.title}
          {item.impact && (
            <span style={{
              marginLeft: 8, fontSize: 11, fontWeight: 600,
              background: "rgba(16,185,129,0.12)", color: "var(--green)",
              borderRadius: 5, padding: "1px 8px",
            }}>
              {item.impact}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
          {item.body}
        </p>
      </div>
    </div>
  );
}

export default function StoryPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📖 Interactive Storytelling</h1>
        <p className="page-sub">Key findings, business recommendations, and growth opportunities from the data</p>
      </div>

      {/* Executive Summary */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
        border: "1px solid rgba(99,102,241,0.25)", borderRadius: 14, padding: "24px", marginBottom: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
              Executive Summary
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              $4.21M Revenue · 2.84M Users · 285M+ Events
            </h2>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65, maxWidth: 700 }}>
              Analysis of the Kaggle eCommerce Behavior Dataset (Oct 2019 – Apr 2020) reveals significant
              revenue leakage through mobile checkout friction, untapped retention potential, and an Instagram
              acquisition channel that dramatically outperforms all others. Total addressable improvement
              across top 5 recommendations exceeds <strong style={{ color: "var(--green)" }}>$1.25M annually</strong>.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
            {[
              { label: "Cart Abandonment", value: "68.4%", color: "var(--red)" },
              { label: "W+1 Churn", value: "81.7%", color: "var(--amber)" },
              { label: "Mobile CVR Gap", value: "−14pp", color: "var(--red)" },
              { label: "Top Opportunity", value: "+$480K", color: "var(--green)" },
            ].map(stat => (
              <div key={stat.label} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text3)", width: 120 }}>{stat.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--mono)", color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <StoryBlock
        title="📊 Key Findings"
        subtitle="What the behavioral data reveals about your eCommerce funnel"
        color="#6366f1"
      >
        {keyFindings.map(f => <Finding key={f.n} item={f} />)}
      </StoryBlock>

      {/* Recommendations */}
      <StoryBlock
        title="💡 Business Recommendations"
        subtitle="Prioritized actions by estimated annual revenue impact"
        color="#10b981"
      >
        {recommendations.map(r => <Finding key={r.n} item={r} />)}
      </StoryBlock>

      {/* Growth Opportunities */}
      <StoryBlock
        title="🚀 Growth Opportunities"
        subtitle="Medium to long-term strategic vectors for sustainable growth"
        color="#f59e0b"
      >
        {growthOpportunities.map(g => <Finding key={g.n} item={g} />)}
      </StoryBlock>

      {/* Quick-action matrix */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Priority-Impact Matrix</span>
          <span className="section-badge">Action Plan</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {[
            { quad: "Quick Wins",    color: "#10b981", items: ["1-click mobile checkout", "Instagram ad scale-up"] },
            { quad: "Major Projects",color: "#6366f1", items: ["Email onboarding drip", "Electronics rec engine"] },
            { quad: "Fill-Ins",      color: "#f59e0b", items: ["Late-night infra audit", "EU consent UI fix"] },
            { quad: "Long-Term",     color: "#8b5cf6", items: ["Champion loyalty VIP", "At-risk win-back campaign"] },
          ].map(q => (
            <div key={q.quad} style={{ background: "var(--bg3)", borderRadius: 10, padding: "14px 16px", borderTop: `2px solid ${q.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: q.color, marginBottom: 8 }}>{q.quad}</div>
              {q.items.map(item => (
                <div key={item} style={{ fontSize: 12, color: "var(--text2)", marginBottom: 5, display: "flex", gap: 6 }}>
                  <span style={{ color: q.color }}>→</span> {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
