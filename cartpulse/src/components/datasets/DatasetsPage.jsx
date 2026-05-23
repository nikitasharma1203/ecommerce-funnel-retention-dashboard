import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";
import { deleteDataset } from "../../services/storageService";

const STATUS_STYLE = {
  ready:      { color: "#10b981", bg: "rgba(16,185,129,0.1)",  icon: "✅" },
  processing: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: "⏳" },
  uploaded:   { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  icon: "📤" },
  error:      { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: "❌" },
};

function fmt(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fmtDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function DatasetsPage() {
  const { user } = useAuth();
  const { data, loadSavedDataset, resetToDemo } = useData();
  const { datasets, activeDatasetId, kpiHistory } = data;
  const [deleting, setDeleting] = useState(null);
  const [loading,  setLoading]  = useState(null);

  const handleLoad = async (dataset) => {
    setLoading(dataset.id);
    await loadSavedDataset(dataset.id);
    setLoading(null);
  };

  const handleDelete = async (dataset) => {
    if (!window.confirm(`Delete "${dataset.fileName}"? This cannot be undone.`)) return;
    setDeleting(dataset.id);
    try {
      await deleteDataset(dataset.id);
      window.location.reload(); // simplest refresh
    } catch (e) {
      alert("Delete failed: " + e.message);
    } finally {
      setDeleting(null);
    }
  };

  const isDemo = !user || user.isDemo;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Datasets</h1>
        <p className="page-sub">All uploaded CSVs — reload any previous analysis instantly</p>
      </div>

      {isDemo && (
        <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:12, padding:"16px 20px", marginBottom:20, display:"flex", gap:12 }}>
          <span style={{ fontSize:22 }}>⚠️</span>
          <div>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>Sign in to enable persistent datasets</div>
            <p style={{ fontSize:13, color:"var(--text2)" }}>
              You're using the demo account. Sign up with email to save your CSV uploads to the cloud and reload them on any device.
            </p>
          </div>
        </div>
      )}

      {/* Dataset list */}
      {datasets.length === 0 ? (
        <div className="section" style={{ textAlign:"center", padding:"48px 24px" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📂</div>
          <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>No datasets yet</div>
          <p style={{ fontSize:13, color:"var(--text3)" }}>
            Upload a CSV on the Upload page — it will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="section">
          <div className="section-header">
            <span className="section-title">Uploaded Datasets ({datasets.length})</span>
            <button onClick={resetToDemo} style={{ fontSize:12, background:"transparent", border:"1px solid var(--border)", borderRadius:7, padding:"5px 12px", color:"var(--text3)", cursor:"pointer", fontFamily:"inherit" }}>
              ↩ Reset to Demo
            </button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {datasets.map(ds => {
              const st = STATUS_STYLE[ds.status] || STATUS_STYLE.uploaded;
              const isActive = ds.id === activeDatasetId;
              return (
                <div key={ds.id} style={{
                  display:"flex", alignItems:"center", gap:14, padding:"14px 16px",
                  background: isActive ? "rgba(99,102,241,0.07)" : "var(--bg3)",
                  border: `1px solid ${isActive ? "rgba(99,102,241,0.35)" : "var(--border)"}`,
                  borderRadius:10, transition:"all 0.15s",
                }}>
                  <div style={{ fontSize:24 }}>
                    { ds.fileType === "orders" ? "📦" : ds.fileType === "events" ? "📋" : "👥" }
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"flex", alignItems:"center", gap:8 }}>
                      {ds.fileName}
                      {isActive && <span style={{ fontSize:10, background:"rgba(99,102,241,0.15)", color:"var(--accent)", borderRadius:4, padding:"1px 7px" }}>ACTIVE</span>}
                    </div>
                    <div style={{ fontSize:12, color:"var(--text3)", marginTop:3, display:"flex", gap:12 }}>
                      <span>{ds.rowCount ? `${ds.rowCount.toLocaleString()} rows` : "—"}</span>
                      <span>{fmt(ds.fileSize)}</span>
                      <span>{fmtDate(ds.uploadedAt)}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, background:st.bg, borderRadius:6, padding:"4px 10px" }}>
                    <span style={{ fontSize:13 }}>{st.icon}</span>
                    <span style={{ fontSize:12, color:st.color, fontWeight:500 }}>{ds.status}</span>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button
                      disabled={ds.status !== "ready" || loading === ds.id}
                      onClick={() => handleLoad(ds)}
                      style={{ background: isActive ? "var(--bg4)" : "var(--accent)", border:"none", borderRadius:7, padding:"6px 14px", color:"#fff", fontSize:12, fontWeight:600, cursor: ds.status === "ready" ? "pointer" : "not-allowed", fontFamily:"inherit", opacity: ds.status !== "ready" ? 0.5 : 1 }}
                    >
                      {loading === ds.id ? "Loading…" : isActive ? "Loaded" : "Load"}
                    </button>
                    <button
                      disabled={deleting === ds.id}
                      onClick={() => handleDelete(ds)}
                      style={{ background:"transparent", border:"1px solid rgba(239,68,68,0.3)", borderRadius:7, padding:"6px 12px", color:"#fca5a5", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}
                    >
                      {deleting === ds.id ? "…" : "🗑"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KPI History — month-over-month */}
      {kpiHistory.length > 1 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">📈 Historical KPI Comparison</span>
            <span className="section-badge">{kpiHistory.length} snapshots</span>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr>
                  {["Dataset","Revenue","Orders","CVR","Cart Abandon","AOV","Uploaded"].map(h => (
                    <th key={h} style={{ padding:"8px 12px", background:"var(--bg3)", color:"var(--text2)", fontWeight:600, textAlign:"left", whiteSpace:"nowrap", borderBottom:"1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpiHistory.map((snap, i) => (
                  <tr key={snap.id} style={{ borderBottom:"1px solid var(--border)" }}>
                    <td style={{ padding:"8px 12px", color:"var(--text)", fontWeight:500 }}>{snap.datasetName || `Snapshot ${i+1}`}</td>
                    <td style={{ padding:"8px 12px", color:"var(--green)", fontFamily:"var(--mono)" }}>{snap.kpis?.revenue?.value || "—"}</td>
                    <td style={{ padding:"8px 12px", fontFamily:"var(--mono)" }}>{snap.kpis?.totalOrders?.value || "—"}</td>
                    <td style={{ padding:"8px 12px", fontFamily:"var(--mono)" }}>{snap.kpis?.convRate?.value || "—"}</td>
                    <td style={{ padding:"8px 12px", fontFamily:"var(--mono)" }}>{snap.kpis?.cartAbandon?.value || "—"}</td>
                    <td style={{ padding:"8px 12px", fontFamily:"var(--mono)" }}>{snap.kpis?.aov?.value || "—"}</td>
                    <td style={{ padding:"8px 12px", color:"var(--text3)" }}>{fmtDate(snap.computedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
