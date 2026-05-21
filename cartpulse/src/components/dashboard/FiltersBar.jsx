export default function FiltersBar({ filters, onChange }) {
  const s = styles;
  return (
    <div style={s.bar}>
      <label style={s.label}>Period:</label>
      <select style={s.sel} value={filters.period} onChange={e => onChange({ ...filters, period: e.target.value })}>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="6m">Last 6 months</option>
        <option value="all">All time</option>
      </select>

      <label style={s.label}>Compare:</label>
      <select style={s.sel} value={filters.compare} onChange={e => onChange({ ...filters, compare: e.target.value })}>
        <option value="prev_period">Previous period</option>
        <option value="prev_year">Previous year</option>
      </select>

      <label style={s.label}>Device:</label>
      <select style={s.sel} value={filters.device} onChange={e => onChange({ ...filters, device: e.target.value })}>
        <option value="all">All devices</option>
        <option value="mobile">Mobile</option>
        <option value="desktop">Desktop</option>
        <option value="tablet">Tablet</option>
      </select>

      <label style={s.label}>Source:</label>
      <select style={s.sel} value={filters.source} onChange={e => onChange({ ...filters, source: e.target.value })}>
        <option value="all">All sources</option>
        <option value="organic">Organic</option>
        <option value="instagram">Instagram</option>
        <option value="email">Email</option>
        <option value="paid">Paid Search</option>
        <option value="direct">Direct</option>
      </select>

      <div style={s.spacer} />

      <span style={s.live}>
        <span style={s.dot} /> Live data
      </span>
    </div>
  );
}

const styles = {
  bar: {
    display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 12, padding: "10px 16px", marginBottom: 18,
  },
  label: { fontSize: 12, color: "var(--text3)" },
  sel: {
    background: "var(--bg3)", border: "1px solid var(--border)",
    borderRadius: 7, padding: "5px 9px", color: "var(--text)",
    fontSize: 12, outline: "none", cursor: "pointer", fontFamily: "inherit",
  },
  spacer: { flex: 1 },
  live: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 11, color: "var(--green)",
  },
  dot: {
    display: "inline-block", width: 7, height: 7,
    borderRadius: "50%", background: "var(--green)",
    animation: "pulse 2s ease-in-out infinite",
  },
};
