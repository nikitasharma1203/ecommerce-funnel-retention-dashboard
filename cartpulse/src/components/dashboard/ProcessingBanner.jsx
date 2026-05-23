import { useData } from "../../hooks/useData";

export default function ProcessingBanner() {
  const { data } = useData();
  const { processingJob } = data;

  if (!processingJob) return null;

  const isError = processingJob.status === "error";
  const isDone  = processingJob.status === "completed";

  return (
    <div style={{
      position: "fixed",
      bottom: 24, left: "50%",
      transform: "translateX(-50%)",
      zIndex: 500,
      background: isError ? "rgba(239,68,68,0.95)" : "rgba(15,26,45,0.97)",
      border: `1px solid ${isError ? "rgba(239,68,68,0.5)" : "rgba(99,130,180,0.3)"}`,
      borderRadius: 12,
      padding: "14px 22px",
      minWidth: 340,
      boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      backdropFilter: "blur(12px)",
      animation: "fadeUp 0.3s ease",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {/* Spinner or status icon */}
        {!isError && !isDone && (
          <div style={{
            width: 18, height: 18, flexShrink: 0,
            border: "2px solid rgba(99,102,241,0.3)",
            borderTopColor: "#6366f1",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }} />
        )}
        {isError && <span style={{ fontSize:18 }}>❌</span>}
        {isDone  && <span style={{ fontSize:18 }}>✅</span>}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#f1f5f9", marginBottom:4 }}>
            {isError ? "Processing failed" : isDone ? "Processing complete" : `Processing ${processingJob.fileType}.csv…`}
          </div>
          <div style={{ fontSize:12, color:"#94a3b8" }}>
            {processingJob.message || "Please wait…"}
          </div>
        </div>

        {/* Progress bar */}
        {!isError && typeof processingJob.progress === "number" && (
          <div style={{ width:80, flexShrink:0 }}>
            <div style={{ height:4, background:"rgba(99,130,180,0.2)", borderRadius:2, overflow:"hidden" }}>
              <div style={{
                height:"100%",
                width: `${processingJob.progress}%`,
                background: isDone ? "var(--green)" : "var(--accent)",
                borderRadius:2,
                transition: "width 0.4s ease",
              }} />
            </div>
            <div style={{ fontSize:10, color:"#64748b", textAlign:"right", marginTop:2 }}>
              {processingJob.progress}%
            </div>
          </div>
        )}
      </div>

      {/* Phase 2 job ID badge */}
      {processingJob.jobId && (
        <div style={{ marginTop:8, fontSize:10, color:"#475569", fontFamily:"var(--mono)" }}>
          Job: {processingJob.jobId.slice(0, 16)}…
        </div>
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
      `}</style>
    </div>
  );
}
