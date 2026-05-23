const NAV = [
  {
    section: "Analytics",
    items: [
      { id: "overview",    icon: "📊", label: "Overview" },
      { id: "revenue",     icon: "💰", label: "Revenue" },
      { id: "conversion",  icon: "🎯", label: "Conversion" },
      { id: "retention",   icon: "🔄", label: "Retention" },
      { id: "activeusers", icon: "👥", label: "Active Users" },
      { id: "returning",   icon: "⭐", label: "Returning Customers" },
    ],
  },
  {
    section: "Funnel",
    items: [
      { id: "funnel", icon: "🔽", label: "Funnel Analytics" },
    ],
  },
  {
    section: "Intelligence",
    items: [
      { id: "ai",     icon: "🤖", label: "AI Insights" },
      { id: "cohort", icon: "🗓", label: "Cohort Analysis" },
      { id: "rfm",    icon: "🏆", label: "RFM Segments" },
      { id: "geo",    icon: "🌍", label: "Geographic" },
      { id: "story",  icon: "📖", label: "Story & Insights" },
    ],
  },
  {
    section: "Data",
    items: [
      { id: "datasets", icon: "🗄", label: "My Datasets" },
      { id: "upload",   icon: "📁", label: "Upload CSV" },
    ],
  },
];

export default function Sidebar({ activePage, onChange }) {
  return (
    <nav style={s.sidebar} className="sidebar-desktop">
      {NAV.map(group => (
        <div key={group.section} style={s.group}>
          <div style={s.label}>{group.section}</div>
          {group.items.map(item => (
            <button
              key={item.id}
              style={{ ...s.item, ...(activePage === item.id ? s.active : {}) }}
              onClick={() => onChange(item.id)}
            >
              <span style={s.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}

const s = {
  sidebar: { width: 220, background: "var(--bg2)", borderRight: "1px solid var(--border)", padding: "12px 0", flexShrink: 0, overflowY: "auto", height: "calc(100vh - 60px)", position: "sticky", top: 60 },
  group: { padding: "0 10px", marginBottom: 6 },
  label: { fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.09em", padding: "8px 8px 4px" },
  item: { display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 8, border: "none", background: "transparent", color: "var(--text2)", fontSize: 13, fontWeight: 400, cursor: "pointer", width: "100%", textAlign: "left", marginBottom: 2, transition: "all 0.15s", fontFamily: "inherit" },
  active: { background: "rgba(99,102,241,0.14)", color: "var(--accent)", fontWeight: 500 },
  icon: { width: 18, textAlign: "center", fontSize: 15, flexShrink: 0 },
};
