import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

export default function Topbar({ theme, onThemeToggle, onUpload, onDownloadPDF }) {
  const { user, logout } = useAuth();
  const { data } = useData();
  const name = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <header style={s.bar}>
      <div style={s.logo}>
        <div style={s.logoIcon}>🛒</div>
        <span style={s.logoText}>Cart<span style={s.accent}>Pulse</span></span>
        {data.backendOnline && (
          <span style={s.backendBadge}>⚡ Backend</span>
        )}
        {data.dataSource !== "demo" && (
          <span style={{ ...s.backendBadge, background: "rgba(16,185,129,0.15)", color: "var(--green)", borderColor: "rgba(16,185,129,0.3)" }}>
            ✓ {data.dataSource === "firestore" ? "Cloud Data" : data.dataSource === "backend" ? "Backend Data" : "CSV Data"}
          </span>
        )}
      </div>

      <div style={s.right}>
        {data.datasets.length > 0 && (
          <span style={s.datasetCount}>{data.datasets.length} dataset{data.datasets.length !== 1 ? "s" : ""}</span>
        )}
        <button style={s.btn} onClick={onUpload}>⬆ Upload CSV</button>
        <button style={{ ...s.btn, ...s.btnPrimary }} onClick={onDownloadPDF}>⬇ PDF Report</button>
        <button style={s.iconBtn} onClick={onThemeToggle} title="Toggle theme">
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        <div style={s.user}>👤 <span style={s.userName}>{name}</span></div>
        <button style={{ ...s.btn, ...s.btnDanger }} onClick={logout}>Sign Out</button>
      </div>
    </header>
  );
}

const s = {
  bar: { height: 60, background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "sticky", top: 0, zIndex: 200, flexShrink: 0 },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoIcon: { width: 30, height: 30, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 },
  logoText: { fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" },
  accent: { background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  backendBadge: { fontSize: 10, fontWeight: 600, background: "rgba(99,102,241,0.12)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 5, padding: "2px 7px" },
  right: { display: "flex", alignItems: "center", gap: 8 },
  datasetCount: { fontSize: 11, color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 5, padding: "2px 8px" },
  btn: { display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "1px solid var(--border2)", borderRadius: 8, padding: "6px 12px", color: "var(--text2)", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s" },
  btnPrimary: { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff" },
  btnDanger: { borderColor: "rgba(239,68,68,0.3)", color: "#fca5a5" },
  iconBtn: { background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16, transition: "all 0.18s" },
  user: { background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "var(--text2)", display: "flex", alignItems: "center", gap: 5 },
  userName: { maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
};
