import { useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

const FILE_CONFIGS = [
  { key: "orders",    icon: "📦", title: "orders.csv",    desc: "event_time, event_type, product_id, price, user_id" },
  { key: "events",    icon: "📋", title: "events.csv",    desc: "user_id, session_id, event_type, timestamp, device" },
  { key: "customers", icon: "👥", title: "customers.csv", desc: "user_id, first_purchase, last_purchase, total_orders" },
];

export default function UploadPage() {
  const { user } = useAuth();
  const { data, uploadCSV, resetToDemo } = useData();
  const [files, setFiles]       = useState({});
  const [previews, setPreviews] = useState({});
  const [processing, setProc]   = useState(null);
  const [toast, setToast]       = useState("");
  const [error, setError]       = useState("");
  const inputRefs = { orders: useRef(), events: useRef(), customers: useRef() };

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const handleFile = async (file, key) => {
    if (!file?.name.endsWith(".csv")) { setError("Please upload a valid .csv file."); return; }
    setError(""); setProc(key);

    // Quick preview — read first ~50KB
    try {
      const slice = file.slice(0, 51200);
      const text  = await slice.text();
      const lines = text.split("\n").filter(Boolean);
      const cols  = lines[0]?.split(",").map(c => c.trim().replace(/"/g, "")) || [];
      const rows  = lines.slice(1, 6).map(line => {
        const vals = line.split(",");
        return Object.fromEntries(cols.map((c, i) => [c, (vals[i] || "").trim().replace(/"/g, "")]));
      });
      setPreviews(p => ({ ...p, [key]: { cols, rows, total: "…" } }));
    } catch (_) {}

    setFiles(p => ({ ...p, [key]: { name: file.name, rows: null } }));

    // Full processing via useData
    const result = await uploadCSV(file, key, user);

    if (result?.error) {
      setError(`Error processing ${file.name}: ${result.error}`);
    } else {
      const rowCount = result?.rowCount;
      setFiles(p => ({ ...p, [key]: { name: file.name, rows: rowCount } }));
      if (rowCount) setPreviews(p => ({ ...p, [key]: { ...p[key], total: rowCount } }));
      showToast(`✓ ${file.name} loaded${rowCount ? ` — ${rowCount.toLocaleString()} rows` : ""} — dashboard updated`);
    }
    setProc(null);
  };

  const handleDrop = (e, key) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "";
    e.currentTarget.style.background  = "";
    handleFile(e.dataTransfer.files[0], key);
  };

  const removeFile = key => {
    setFiles(p => { const n = { ...p }; delete n[key]; return n; });
    setPreviews(p => { const n = { ...p }; delete n[key]; return n; });
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:999, background:"rgba(16,185,129,0.97)", color:"#fff", borderRadius:10, padding:"12px 20px", fontSize:13, fontWeight:600, boxShadow:"0 8px 24px rgba(0,0,0,0.4)", animation:"fadeUp 0.3s ease" }}>
          {toast}
        </div>
      )}

      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div>
            <h1 className="page-title">CSV Data Upload</h1>
            <p className="page-sub">Upload your dataset — dashboard updates instantly · Files processed client-side</p>
          </div>
          {data.dataSource !== "demo" && (
            <button onClick={() => { resetToDemo(); setFiles({}); setPreviews({}); showToast("Reverted to demo data"); }}
              style={{ background:"transparent", border:"1px solid var(--border2)", borderRadius:8, padding:"7px 14px", color:"var(--text2)", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
              ↩ Reset to Demo Data
            </button>
          )}
        </div>
      </div>

      {/* Live data indicator */}
      {data.dataSource !== "demo" && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.22)", borderRadius:10, padding:"10px 16px", marginBottom:20 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--green)", animation:"pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize:13, color:"var(--green)", fontWeight:600 }}>
            Dashboard is showing your live {data.dataSource === "firestore" ? "cloud-synced" : data.dataSource === "backend" ? "backend-processed" : "CSV"} data
          </span>
          {user && !user.isDemo && data.dataSource === "firestore" && (
            <span style={{ fontSize:12, color:"var(--text3)", marginLeft:4 }}>— saved to your account</span>
          )}
        </div>
      )}

      {/* Backend indicator */}
      {data.backendOnline && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(99,102,241,0.07)", border:"1px solid rgba(99,102,241,0.22)", borderRadius:10, padding:"10px 16px", marginBottom:16 }}>
          <span style={{ fontSize:13 }}>⚡</span>
          <span style={{ fontSize:13, color:"var(--accent)", fontWeight:500 }}>
            FastAPI backend is online — uploads will be processed server-side with full Pandas analytics
          </span>
        </div>
      )}

      {error && (
        <div style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.22)", borderRadius:10, padding:"10px 16px", fontSize:13, color:"#fca5a5", marginBottom:16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Upload zones */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16, marginBottom:20 }}>
        {FILE_CONFIGS.map(({ key, icon, title, desc }) => (
          <div key={key}>
            <input ref={inputRefs[key]} type="file" accept=".csv" style={{ display:"none" }}
              onChange={e => handleFile(e.target.files[0], key)} />

            {processing === key ? (
              <div style={{ background:"var(--bg2)", border:"1px solid var(--accent)", borderRadius:12, padding:"28px 20px", textAlign:"center" }}>
                <div style={{ width:32, height:32, border:"3px solid var(--accent)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite", margin:"0 auto 12px" }} />
                <div style={{ fontSize:13, color:"var(--accent)" }}>Processing {title}…</div>
                {data.processingJob && (
                  <div style={{ fontSize:12, color:"var(--text3)", marginTop:6 }}>{data.processingJob.message}</div>
                )}
              </div>
            ) : files[key] ? (
              <div style={{ background:"var(--bg2)", border:"1px solid var(--green)", borderRadius:12, padding:20, textAlign:"center" }}>
                <div style={{ fontSize:28, marginBottom:8 }}>✅</div>
                <div style={{ fontSize:14, fontWeight:600, color:"var(--green)", marginBottom:4 }}>{files[key].name}</div>
                <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12 }}>
                  {files[key].rows ? `${files[key].rows.toLocaleString()} rows loaded` : "Processing…"}
                </div>
                <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                  <button onClick={() => inputRefs[key].current?.click()} style={{ background:"transparent", border:"1px solid var(--border2)", borderRadius:7, padding:"5px 12px", color:"var(--text2)", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Replace</button>
                  <button onClick={() => removeFile(key)} style={{ background:"transparent", border:"1px solid rgba(239,68,68,0.3)", borderRadius:7, padding:"5px 12px", color:"#fca5a5", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Remove</button>
                </div>
              </div>
            ) : (
              <div
                style={{ border:"2px dashed var(--border2)", borderRadius:12, padding:"28px 20px", textAlign:"center", cursor:"pointer", transition:"all 0.18s" }}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.background="rgba(99,102,241,0.04)"; }}
                onDragLeave={e => { e.currentTarget.style.borderColor=""; e.currentTarget.style.background=""; }}
                onDrop={e => handleDrop(e, key)}
                onClick={() => inputRefs[key].current?.click()}
                onMouseEnter={e => e.currentTarget.style.borderColor="var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor=""}
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

      {/* What updates */}
      <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.07),rgba(139,92,246,0.04))", border:"1px solid rgba(99,102,241,0.18)", borderRadius:12, padding:"16px 20px", marginBottom:20, display:"flex", gap:16 }}>
        <span style={{ fontSize:22 }}>🔄</span>
        <div>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>What updates automatically when you upload orders.csv</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["Revenue KPIs","Order Count","AOV","CVR","Cart Abandon %","Daily Revenue Chart","Purchase Funnel","Hourly Activity","Device Breakdown","AI Insights"].map(item => (
              <span key={item} style={{ fontSize:11, background:"rgba(99,102,241,0.1)", color:"var(--accent)", borderRadius:5, padding:"2px 8px" }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CSV Previews */}
      {Object.entries(previews).map(([key, preview]) => (
        <div key={key} className="section" style={{ marginBottom:14 }}>
          <div className="section-header">
            <span className="section-title">{key}.csv Preview {preview.total !== "…" ? `— ${Number(preview.total).toLocaleString()} rows` : ""}</span>
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

      {/* Format guide */}
      <div style={{ background:"var(--bg3)", borderRadius:12, padding:"18px 20px", fontSize:13, color:"var(--text2)", lineHeight:1.7 }}>
        <strong style={{ color:"var(--text)", display:"block", marginBottom:6 }}>📋 Expected CSV Format</strong>
        <code style={{ fontFamily:"var(--mono)", fontSize:12, display:"block", background:"var(--bg4)", padding:"8px 12px", borderRadius:6, marginBottom:8 }}>
          event_time, event_type, product_id, category_id, category_code, brand, price, user_id, user_session
        </code>
        Compatible with the{" "}
        <a href="https://www.kaggle.com/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store" target="_blank" rel="noopener noreferrer" style={{ color:"var(--accent)" }}>
          Kaggle eCommerce Behavior Dataset
        </a>{" "}
        used in this project's analysis.
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
