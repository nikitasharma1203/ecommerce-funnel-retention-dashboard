import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { funnelSteps, funnelByDevice, funnelBySource } from "../../data/mockData";

function FunnelBar({ step, maxCount, index, visible }) {
  const pct = (step.count / maxCount) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
      <div style={{ width: 110, fontSize: 13, color: "var(--text2)", textAlign: "right", flexShrink: 0 }}>
        {step.name}
      </div>
      <div style={{ flex: 1, background: "var(--bg3)", borderRadius: 8, height: 42, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 8,
          background: step.color,
          width: visible ? `${pct}%` : "0%",
          transition: `width 1.1s cubic-bezier(0.4,0,0.2,1) ${index * 0.12}s`,
          display: "flex", alignItems: "center", padding: "0 14px",
          fontSize: 13, fontWeight: 600, color: "#fff",
          position: "relative", overflow: "hidden",
        }}>
          <span style={{ position: "relative", zIndex: 1 }}>
            {(step.count / 1000).toFixed(0)}K
          </span>
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(255,255,255,0.08)",
          }} />
        </div>
      </div>
      <div style={{ width: 160, flexShrink: 0, display: "flex", gap: 10, fontSize: 12 }}>
        <span style={{ fontFamily: "var(--mono)", color: "var(--text)" }}>
          {(step.count / 1000).toFixed(0)}K
        </span>
        {index > 0 && (
          <span style={{ color: "var(--red)" }}>
            −{(100 - (step.count / funnelSteps[index - 1].count) * 100).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0a0e17", border: "1px solid #1e3a5f", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, color: p.fill || "#f1f5f9", fontWeight: 500 }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  );
};

export default function FunnelPage() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const dropByDevice = [
    { device: "Mobile",  abandon: 75.2 },
    { device: "Desktop", abandon: 61.1 },
    { device: "Tablet",  abandon: 64.8 },
  ];

  const dropBySource = [
    { source: "Organic",   abandon: 65.2 },
    { source: "Instagram", abandon: 58.4 },
    { source: "Email",     abandon: 70.1 },
    { source: "Paid",      abandon: 62.8 },
    { source: "Direct",    abandon: 68.3 },
  ];

  const COLORS = { Mobile: "#ef4444", Desktop: "#10b981", Tablet: "#f59e0b" };
  const SCOLORS = ["#6366f1", "#10b981", "#f59e0b", "#06b6d4", "#8b5cf6"];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Funnel Analytics</h1>
        <p className="page-sub">Purchase funnel with drop-off analysis, device & source segmentation</p>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid">
        {[
          { label: "Visit → Product View", value: "72.4%", icon: "👁" },
          { label: "Product View → Cart",  value: "12.1%", icon: "🛒" },
          { label: "Cart → Checkout",      value: "45.8%", icon: "💳" },
          { label: "Checkout → Purchase",  value: "69.0%", icon: "✅" },
        ].map((k) => (
          <div key={k.label} className="kpi-card">
            <span style={{ position: "absolute", top: 14, right: 14, fontSize: 20, opacity: 0.5 }}>{k.icon}</span>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--mono)" }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Visual Funnel */}
      <div className="section" ref={ref}>
        <div className="section-header">
          <span className="section-title">Visual Purchase Funnel</span>
          <span className="section-badge">All Devices · All Sources</span>
        </div>

        <div style={{ padding: "16px 0" }}>
          {funnelSteps.map((step, i) => (
            <div key={step.name}>
              {i > 0 && (
                <div style={{
                  textAlign: "center", color: "var(--text4)", fontSize: 11,
                  margin: "3px 0 3px 124px",
                }}>
                  ▼ Drop-off:{" "}
                  <span style={{ color: "var(--red)", fontWeight: 600 }}>
                    {(100 - (step.count / funnelSteps[i - 1].count) * 100).toFixed(1)}%
                  </span>
                  {" "}·{" "}
                  <span style={{ color: "var(--text3)" }}>
                    {((funnelSteps[i - 1].count - step.count) / 1000).toFixed(0)}K users lost
                  </span>
                </div>
              )}
              <FunnelBar step={step} maxCount={funnelSteps[0].count} index={i} visible={visible} />
            </div>
          ))}
        </div>

        {/* Funnel summary row */}
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          {funnelSteps.map((step, i) => (
            <div key={step.name} style={{
              flex: "1 1 130px", background: "var(--bg3)", borderRadius: 10,
              padding: "12px 14px", borderLeft: `3px solid ${step.color}`,
            }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>{step.name}</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--text)" }}>
                {(step.count / 1000).toFixed(1)}K
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                {i === 0 ? "100%" : `${((step.count / funnelSteps[0].count) * 100).toFixed(1)}% of visits`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device & Source drop-off */}
      <div className="grid-2">
        <div className="section">
          <div className="section-header">
            <span className="section-title">Cart Abandonment by Device</span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dropByDevice} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="device" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} domain={[50, 80]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<TT />} formatter={v => `${v}%`} />
                <Bar dataKey="abandon" radius={[6, 6, 0, 0]} name="Abandon %">
                  {dropByDevice.map((d) => (
                    <Cell key={d.device} fill={COLORS[d.device] || "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 8, textAlign: "center" }}>
            📱 Mobile is 14pp higher than desktop — critical optimization target
          </p>
        </div>

        <div className="section">
          <div className="section-header">
            <span className="section-title">Cart Abandonment by Source</span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dropBySource} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="source" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} domain={[50, 80]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<TT />} />
                <Bar dataKey="abandon" radius={[6, 6, 0, 0]} name="Abandon %">
                  {dropBySource.map((_, i) => (
                    <Cell key={i} fill={SCOLORS[i % SCOLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: 12, color: "var(--green)", marginTop: 8, textAlign: "center" }}>
            📸 Instagram has the lowest abandonment rate — scale this channel
          </p>
        </div>
      </div>
    </div>
  );
}
