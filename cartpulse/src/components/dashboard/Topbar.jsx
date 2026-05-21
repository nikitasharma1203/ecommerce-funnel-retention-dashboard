import { useAuth } from "../../hooks/useAuth";

export default function Topbar({ theme, onThemeToggle, onUpload, onDownloadPDF, anomalyCount = 2 }) {
  const { user, logout } = useAuth();
  const name = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <header style={styles.bar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🛒</div>
        <span style={styles.logoText}>
          Cart<span style={styles.logoAccent}>Pulse</span>
        </span>
        <span style={styles.version}>v2.0</span>
      </div>

      {/* Right controls */}
      <div style={styles.right}>
        {anomalyCount > 0 && (
          <div style={styles.anomaly}>
            <div style={styles.pulse} />
            {anomalyCount} anomalies detected
          </div>
        )}

        <button style={styles.btn} onClick={onUpload} title="Upload CSV data">
          ⬆ Upload CSV
        </button>

        <button style={{ ...styles.btn, ...styles.btnGradient }} onClick={onDownloadPDF} title="Download PDF report">
          ⬇ PDF Report
        </button>

        <button style={styles.iconBtn} onClick={onThemeToggle} title="Toggle theme">
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        <div style={styles.userBadge}>
          👤 <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
        </div>

        <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  );
}

const styles = {
  bar: {
    height: 60, background: "var(--bg2)", borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 20px", position: "sticky", top: 0, zIndex: 200,
    flexShrink: 0,
  },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoIcon: {
    width: 30, height: 30, background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
  },
  logoText: { fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" },
  logoAccent: { background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  version: { fontSize: 11, color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 5, padding: "1px 6px" },
  right: { display: "flex", alignItems: "center", gap: 8 },
  anomaly: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)",
    borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "#fca5a5",
  },
  pulse: {
    width: 7, height: 7, borderRadius: "50%", background: "#ef4444",
    animation: "pulse 2s ease-in-out infinite",
  },
  btn: {
    display: "flex", alignItems: "center", gap: 5,
    background: "transparent", border: "1px solid var(--border2)",
    borderRadius: 8, padding: "6px 12px", color: "var(--text2)",
    fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
    transition: "all 0.18s",
  },
  btnGradient: {
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    border: "none", color: "#fff",
  },
  btnDanger: { borderColor: "rgba(239,68,68,0.3)", color: "#fca5a5" },
  iconBtn: {
    background: "transparent", border: "1px solid var(--border)",
    borderRadius: 8, padding: "6px 10px", cursor: "pointer",
    fontSize: 16, transition: "all 0.18s",
  },
  userBadge: {
    background: "var(--bg3)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "var(--text2)",
    display: "flex", alignItems: "center", gap: 5, maxWidth: 160,
  },
};
