import { useState, useRef } from "react";
import { parseCSV, detectFileType, deriveKPIs, buildDailyRevenue, buildFunnel } from "../../utils/csvParser";

const FILE_CONFIGS = [
  { key: "orders",    icon: "📦", title: "orders.csv",    desc: "event_time, product_id, price, user_id, event_type" },
  { key: "events",    icon: "📋", title: "events.csv",    desc: "user_id, session_id, event_type, timestamp, device" },
  { key: "customers", icon: "👥", title: "customers.csv", desc: "user_id, first_purchase, last_purchase, total_orders" },
];

export default function UploadPage({ onDataUpdate }) {
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [processing, setProcessing] = useState(false);
  const [kpis, setKpis] = useState(null);
  const [error, setError] = useState("");
  const inputRefs = { orders: useRef(), events: useRef(), customers: useRef() };

  const handleFile = async (file, key) => {
    if (!file || !file.name.endsWith(".csv")) {
      setError("Please upload a valid .csv file.");
      return;
    }
    setError("");
    setProcessing(true);
    try {
      const rows = await parseCSV(file);
      setFiles(prev => ({ ...prev, [key]: { name: file.name, rows: rows.length } }));

      // Build preview (first 5 rows)
      const cols = rows.length > 0 ? Object.keys(rows[0]) : [];
      const previewRows = rows.slice(0, 5);
      setPreviews(prev => ({ ...prev, [key]: { cols, rows: previewRows, total: rows.length } }));

      // Derive KPIs from orders file
      if (key === "orders" && rows.length > 0) {
        const derived = deriveKPIs(rows);
        setKpis(derived);
        if (onDataUpdate) onDataUpdate({ kpis: derived, dailyRevenue: buildDailyRevenue(rows), funnel: buildFunnel(rows) });
      }
    } catch (e) {
      setError(`Error parsing ${file.name}: ${e.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = (e, key) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, key);
  };

  const removeFile = (key) => {
    setFiles(prev => { const n = { ...prev }; delete n[key]; return n; });
    setPreviews(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">CSV Data Upload</h1>
        <p className="page-sub">
          Upload your dataset to override demo data · Files processed client-side (never sent to a server)
        </p>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#fca5a5", marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Upload zones */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 20 }}>
        {FILE_CONFIGS.map(({ key, icon, title, desc }) => (
          <div key={key}>
            <input
              ref={inputRefs[key]} type="file" accept=".csv" style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0], key)}
            />
            {files[key] ? (
              <div style={{
                background: "var(--bg2)", border: "1px solid var(--green)",
                borderRadius: 12, padding: "20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green)", marginBottom: 4 }}>
                  {files[key].name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>
                  {files[key].rows.toLocaleString()} rows loaded
                </div>
                <button onClick={() => removeFile(key)} style={{
                  background: "transparent", border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 8, padding: "5px 12px", color: "#fca5a5",
                  fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                }}>
                  Remove
                </button>
              </div>
            ) : (
              <div
                style={{
                  border: "2px dashed var(--border2)", borderRadius: 12, padding: "28px 20px",
                  textAlign: "center", cursor: "pointer", transition: "all 0.18s",
                }}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                onDragLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.background = ""; }}
                onDrop={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.background = ""; handleDrop(e, key); }}
                onClick={() => inputRefs[key].current?.click()}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ""; }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>{desc}</div>
                <div style={{
                  fontSize: 12, color: "var(--accent)", background: "rgba(99,102,241,0.1)",
                  borderRadius: 6, padding: "4px 12px", display: "inline-block",
                }}>
                  Click or drag to upload
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {processing && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, color: "var(--accent)", fontSize: 14 }}>
          <div style={{ width: 16, height: 16, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          Processing CSV data…
        </div>
      )}

      {/* Derived KPIs from uploaded data */}
      {kpis && (
        <div className="section" style={{ marginBottom: 16 }}>
          <div className="section-header">
            <span className="section-title">📊 Derived KPIs from Your Data</span>
            <span className="section-badge">Live</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
            {Object.entries(kpis).map(([k, v]) => (
              <div key={k} style={{ background: "var(--bg3)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  {k.replace(/([A-Z])/g, " $1").trim()}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data previews */}
      {Object.entries(previews).map(([key, preview]) => (
        <div key={key} className="section" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <span className="section-title">{key}.csv Preview — {preview.total.toLocaleString()} rows</span>
            <span className="section-badge">{preview.cols.length} columns</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ fontSize: 12, width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {preview.cols.map(c => (
                    <th key={c} style={{ padding: "6px 10px", background: "var(--bg3)", color: "var(--text2)", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap", borderBottom: "1px solid var(--border)" }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    {preview.cols.map(c => (
                      <td key={c} style={{ padding: "5px 10px", color: "var(--text2)", fontFamily: "var(--mono)", fontSize: 11, whiteSpace: "nowrap" }}>
                        {String(row[c] ?? "").slice(0, 30)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Instructions */}
      <div style={{ background: "var(--bg3)", borderRadius: 12, padding: "18px 20px", fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
        <strong style={{ color: "var(--text)", display: "block", marginBottom: 6 }}>
          📋 Expected CSV Format (Kaggle eCommerce Behavior Dataset)
        </strong>
        <code style={{ fontFamily: "var(--mono)", fontSize: 12, display: "block", marginBottom: 6 }}>
          event_time, event_type, product_id, category_id, category_code, brand, price, user_id, user_session
        </code>
        <p>
          Compatible with the{" "}
          <a href="https://www.kaggle.com/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store"
            target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
            Kaggle eCommerce Behavior Data
          </a>{" "}
          dataset used in{" "}
          <a href="https://github.com/nikitasharma1203/ecommerce-funnel-retention-dashboard"
            target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
            Nikita Sharma's analysis
          </a>.
          Any CSV with matching column names will auto-update the dashboard.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
