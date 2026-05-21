export default function KPICard({ label, value, change, icon, accentColor = "#6366f1" }) {
  const isUp      = typeof change === "number" ? change > 0 : String(change).startsWith("+") || String(change).startsWith("▲");
  const isDown    = typeof change === "number" ? change < 0 : String(change).startsWith("-") || String(change).startsWith("▼");
  const changeStr = typeof change === "number"
    ? `${change > 0 ? "▲" : change < 0 ? "▼" : "—"} ${Math.abs(change)}%`
    : change;

  return (
    <div style={styles.card}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = accentColor;
        e.currentTarget.style.boxShadow = `0 8px 24px ${accentColor}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Glow blob */}
      <div style={{ ...styles.glow, background: accentColor }} />

      <span style={styles.icon}>{icon}</span>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
      <div style={{
        ...styles.change,
        color: isUp ? "var(--green)" : isDown ? "var(--red)" : "var(--text3)",
      }}>
        {changeStr}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden",
    transition: "transform 0.18s, border-color 0.18s, box-shadow 0.18s",
  },
  glow: {
    position: "absolute", bottom: -20, right: -20,
    width: 80, height: 80, borderRadius: "50%",
    filter: "blur(22px)", opacity: 0.1, pointerEvents: "none",
  },
  icon: { position: "absolute", top: 16, right: 16, fontSize: 20, opacity: 0.5 },
  label: { fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 },
  value: { fontSize: 26, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--text)", lineHeight: 1.1, marginBottom: 6 },
  change: { fontSize: 12, fontWeight: 500 },
};
