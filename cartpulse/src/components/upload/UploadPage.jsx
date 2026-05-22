import { useState, useRef } from "react";
import { parseCSV } from "../../utils/csvParser";
import { useData } from "../../hooks/useData";

const FILE_CONFIGS = [
  { key: "orders",    icon: "📦", title: "orders.csv",    desc: "event_time, product_id, price, user_id, event_type" },
  { key: "events",    icon: "📋", title: "events.csv",    desc: "user_id, session_id, event_type, timestamp, device" },
  { key: "customers", icon: "👥", title: "customers.csv", desc: "user_id, first_purchase, last_purchase, total_orders" },
];

export default function UploadPage() {
  const { data, applyCSVData, resetToDemo } = useData();
  const [files, setFiles]       = useState({});
  const [previews, setPreviews] = useState({});
  const [processing, setProcessing] = useState(null); // key being processed
  const [toast, setToast]       = useState("");
  const [error, setError]       = useState("");
  const inputRefs = {
    orders:    useRef(),
    events:    useRef(),
    customers: useRef(),
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleFile = async (file, key) => {
    if (!file || !file.name.endsWith(".csv")) {
      setError("Please upload a valid .csv file.");
      return;
    }
    setError("");
    setProcessing(key);

    try {
      const rows = await parseCSV(file);
      setFiles(prev => ({ ...prev, [key]: { name: file.name, rows: rows.length } }));

      // Build table preview (first 5 rows)
      const cols = rows.length > 0 ? Object.keys(rows[0]) : [];
      setPreviews(prev => ({ ...prev, [key]: { cols, rows: rows.slice(0, 5), total: rows.length } }));

      // *** THIS IS THE KEY CALL — pushes parsed data into global DataContext ***
      applyCSVData(key, rows);

      showToast(`✓ ${file.name} loaded — dashboard updated with ${rows.length.toLocaleString()} rows`);
    } catch (e) {
      setError(`Error parsing ${file.name}: ${e.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleDrop = (e, key) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "";
    e.currentTarget.style.background  = "";
    handleFile(e.dataTransfer.files[0], key);
  };

  const removeFile = (key) => {
    setFiles(prev    => { const n = { ...prev };    delete n[key]; return n; });
    setPreviews(prev => { const n = { ...prev };    delete n[key]; return n; });
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, right:24, zIndex:999,
          background:"rgba(16,185,129,0.95)", color:"#fff",
          borderRadius:10, padding:"12px 20px", fontSize:13, fontWeight:600,
          boxShadow:"0 8px 24px rgba(0,0,0,0.4)",
          animation:"fadeUp 0.3s ease",
        }}>
          {toast}
        </div>
      )}

      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h1 className="page-title">CSV Data Upload</h1>
            <p className="page-sub">Upload files to update the entire dashboard · All processing is client-side</p>
          </div>
          {data.dataSource === "csv" && (
            <button onClick={() => { resetToDemo(); setFiles({}); setPreviews({}); showToast("Reverted to demo data"); }}
              style={{ background:"transparent", border:"1px solid var(--border2)", borderRadius:8, padding:"7px 14px", color:"var(--text2)", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
              ↩ Reset to Demo Data
            </button>
          )}
        </div>
      </div>

      {/* Live indicator */}
      {data.dataSource === "csv" && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:10, padding:"10px 16px", marginBottom:20 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--green)", animation:"pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize:13, color:"var(--green)", fontWeight:600 }}>
            Dashboard is showing your live CSV data
          </span>
          <span style={{ fontSize:12, color:"var(--text3)", marginLeft:4 }}>
            — all KPIs, charts, and funnel updated
          </span>
        </div>
      )}

      {error && (
        <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"10px 16px", fontSize:13, color:"#fca5a5", marginBottom:16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Upload zones */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16, marginBottom:20 }}>
        {FILE_CONFIGS.map(({ key, icon, title, desc }) => (
          <div key={key}>
            <input ref={inputRefs[key]} type="file" accept=".csv" style={{ display:"none" }}
              onChange={e => handleFile(e.target.files[0], key)} />

            {files[key] ? (
              /* ── Loaded state ── */
              <div style={{ background:"var(--bg2)", border:"1px solid var(--green)", borderRadius:12, padding:20, textAlign:"center" }}>
                <div style={{ fontSize:28, marginBottom:8 }}>✅</div>
                <div style={{ fontSize:14, fontWeight:600, color:"var(--green)", marginBottom:4 }}>{files[key].name}</div>
                <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12 }}>
                  {files[key].rows.toLocaleString()} rows loaded
                </div>
                <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                  <button onClick={() => inputRefs[key].current?.click()} style={{ background:"transparent", border:"1px solid var(--border2)", borderRadius:7, padding:"5px 12px", color:"var(--text2)", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                    Replace
                  </button>
                  <button onClick={() => removeFile(key)} style={{ background:"transparent", border:"1px solid rgba(239,68,68,0.3)", borderRadius:7, padding:"5px 12px", color:"#fca5a5", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                    Remove
                  </button>
                </div>
              </div>
            ) : processing === key ? (
              /* ── Processing state ── */
              <div style={{ background:"var(--bg2)", border:"1px solid var(--accent)", borderRadius:12, padding:"28px 20px", textAlign:"center" }}>
                <div style={{ width:32, height:32, border:"3px solid var(--accent)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite", margin:"0 auto 12px" }} />
                <div style={{ fontSize:13, color:"var(--accent)" }}>Processing {title}…</div>
              </div>
            ) : (
              /* ── Empty/drop zone ── */
              <div
                style={{ border:"2px dashed var(--border2)", borderRadius:12, padding:"28px 20px", textAlign:"center", cursor:"pointer", transition:"all 0.18s" }}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.background="rgba(99,102,241,0.04)"; }}
                onDragLeave={e => { e.currentTarget.style.borderColor=""; e.currentTarget.style.background=""; }}
                onDrop={e => handleDrop(e, key)}
                onClick={() => inputRefs[key].current?.click()}
                onMouseEnter={e => { e.currentTarget.style.borderColor="var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=""; }}
              >
                <div style={{ fontSize:28, marginBottom:8 }}>{icon}</div>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{title}</div>
                <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12 }}>{desc}</div>
                <div style={{ fontSize:12, color:"var(--accent)", background:"rgba(99,102,241,0.1)", borderRadius:6, padding:"4px 12px", display:"inline-block" }}>
                  Click or drag to upload
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* What updates banner */}
      <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.07),rgba(139,92,246,0.04))", border:"1px solid rgba(99,102,241,0.18)", borderRadius:12, padding:"16px 20px", marginBottom:20, display:"flex", gap:16 }}>
        <span style={{ fontSize:22 }}>🔄</span>
        <div>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>What auto-updates when you upload orders.csv</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {["Revenue KPIs","Order Count","AOV","CVR","Cart Abandon %","Daily Revenue Chart","Purchase Funnel","Hourly Activity","Device Breakdown","Category CVR","AI Insights"].map(item => (
              <span key={item} style={{ fontSize:11, background:"rgba(99,102,241,0.1)", color:"var(--accent)", borderRadius:5, padding:"2px 8px" }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CSV Previews */}
      {Object.entries(previews).map(([key, preview]) => (
        <div key={key} className="section" style={{ marginBottom:14 }}>
          <div className="section-header">
            <span className="section-title">{key}.csv Preview — {preview.total.toLocaleString()} rows</span>
            <span className="section-badge">{preview.cols.length} columns</span>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ fontSize:12, width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  {preview.cols.map(c => (
                    <th key={c} style={{ padding:"6px 10px", background:"var(--bg3)", color:"var(--text2)", fontWeight:600, textAlign:"left", whiteSpace:"nowrap", borderBottom:"1px solid var(--border)" }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, i) => (
                  <tr key={i} style={{ borderBottom:"1px solid var(--border)" }}>
                    {preview.cols.map(c => (
                      <td key={c} style={{ padding:"5px 10px", color:"var(--text2)", fontFamily:"var(--mono)", fontSize:11, whiteSpace:"nowrap" }}>
                        {String(row[c] ?? "").slice(0, 32)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Format reference */}
      <div style={{ background:"var(--bg3)", borderRadius:12, padding:"18px 20px", fontSize:13, color:"var(--text2)", lineHeight:1.7 }}>
        <strong style={{ color:"var(--text)", display:"block", marginBottom:6 }}>📋 Expected CSV Format (Kaggle eCommerce Behavior Dataset)</strong>
        <code style={{ fontFamily:"var(--mono)", fontSize:12, display:"block", background:"var(--bg4)", padding:"8px 12px", borderRadius:6, marginBottom:8 }}>
          event_time, event_type, product_id, category_id, category_code, brand, price, user_id, user_session
        </code>
        <p>Compatible with the <a href="https://www.kaggle.com/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store" target="_blank" rel="noopener noreferrer" style={{ color:"var(--accent)" }}>Kaggle eCommerce Behavior Data</a> dataset used in <a href="https://github.com/nikitasharma1203/ecommerce-funnel-retention-dashboard" target="_blank" rel="noopener noreferrer" style={{ color:"var(--accent)" }}>Nikita Sharma's analysis</a>. Any CSV with matching column names auto-updates the dashboard.</p>
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
