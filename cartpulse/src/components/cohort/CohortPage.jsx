import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { cohortWeeks, cohortOffsets, cohortMatrix, avgRetentionByWeek } from "../../data/mockData";
import KPICard from "../dashboard/KPICard";

function heatColor(v) {
  if (v >= 100) return "#6366f1";
  if (v >= 20)  return `rgba(99,102,241,${(0.3 + v / 100 * 0.7).toFixed(2)})`;
  if (v >= 10)  return `rgba(16,185,129,${(0.25 + v / 20 * 0.6).toFixed(2)})`;
  if (v >= 5)   return `rgba(245,158,11,${(0.3 + v / 10 * 0.5).toFixed(2)})`;
  return `rgba(239,68,68,${(0.2 + v / 5 * 0.4).toFixed(2)})`;
}

const avgData = avgRetentionByWeek.map((v, i) => ({
  week: cohortOffsets[i + 1],
  retention: v,
}));

const curveData = cohortOffsets.map((offset, oi) => {
  const entry = { week: offset };
  cohortWeeks.slice(0, 4).forEach((w, wi) => {
    entry[w] = cohortMatrix[wi][oi];
  });
  return entry;
});

const CURVE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];

export default function CohortPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cohort Retention Analysis</h1>
        <p className="page-sub">Weekly cohort retention · Oct 2019 – Apr 2020</p>
      </div>

      <div className="kpi-grid">
        <KPICard label="W+1 Avg Retention" value="18.3%" change={+1.8}  icon="🔄" accentColor="#6366f1" />
        <KPICard label="W+2 Avg Retention" value="10.2%" change={+0.9}  icon="📅" accentColor="#8b5cf6" />
        <KPICard label="W+4 Avg Retention" value="5.6%"  change={+0.4}  icon="📊" accentColor="#06b6d4" />
        <KPICard label="Best Cohort"       value="Wk 44" change="22.1% W+1" icon="🏅" accentColor="#10b981" />
      </div>

      {/* Heatmap */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Cohort Heatmap — Weekly Retention %</span>
          <span className="section-badge">12 Cohorts · 9 Weeks</span>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
          {[
            { label: "100% (Base)", color: "#6366f1" },
            { label: "20%+", color: "rgba(99,102,241,0.8)" },
            { label: "10–20%", color: "rgba(16,185,129,0.7)" },
            { label: "5–10%", color: "rgba(245,158,11,0.7)" },
            { label: "<5%", color: "rgba(239,68,68,0.6)" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text3)" }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "separate", borderSpacing: 3, fontSize: 11, width: "100%" }}>
            <thead>
              <tr>
                <th style={{ padding: "5px 12px 5px 0", color: "var(--text3)", fontWeight: 600, textAlign: "left", fontSize: 11 }}>
                  Cohort
                </th>
                {cohortOffsets.map(o => (
                  <th key={o} style={{ padding: "5px 6px", color: "var(--text3)", fontWeight: 500, textAlign: "center", whiteSpace: "nowrap", fontSize: 11 }}>
                    {o}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortWeeks.map((week, wi) => (
                <tr key={week}>
                  <td style={{ padding: "4px 12px 4px 0", color: "var(--text2)", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>
                    {week}
                  </td>
                  {cohortOffsets.map((_, oi) => {
                    const available = oi < cohortOffsets.length - wi;
                    const val = cohortMatrix[wi][oi];
                    return (
                      <td key={oi} title={available ? `${week} ${cohortOffsets[oi]}: ${val}%` : "—"}
                        style={{
                          padding: "5px 7px", textAlign: "center",
                          borderRadius: 5, fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500,
                          minWidth: 42, cursor: "default",
                          background: available ? heatColor(val) : "var(--bg3)",
                          color: available ? "#fff" : "var(--text4)",
                          transition: "transform 0.1s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.zIndex = 1; e.currentTarget.style.position = "relative"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                      >
                        {available ? `${val}%` : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retention curves + avg bar */}
      <div className="grid-2">
        <div className="section">
          <div className="section-header">
            <span className="section-title">Retention Curves (Top 4 Cohorts)</span>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curveData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: "#0a0e17", border: "1px solid #1e3a5f", borderRadius: 8, fontSize: 12 }} formatter={v => `${v}%`} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                {cohortWeeks.slice(0, 4).map((w, i) => (
                  <Line key={w} type="monotone" dataKey={w} stroke={CURVE_COLORS[i]}
                    strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <span className="section-title">Average Retention by Week Offset</span>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgData} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: "#0a0e17", border: "1px solid #1e3a5f", borderRadius: 8 }} formatter={v => `${v}%`} />
                <Bar dataKey="retention" radius={[5, 5, 0, 0]} name="Avg Retention %">
                  {avgData.map((_, i) => (
                    <rect key={i} fill={`rgba(99,102,241,${1 - i * 0.1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insight callout */}
      <div style={{
        background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)",
        borderRadius: 12, padding: "16px 20px", marginTop: 0,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 22 }}>💡</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Cohort Insight</div>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
            Week 44 (Oct 2019) cohort shows the highest W+1 retention at 22.1%, likely due to holiday season
            intent. The steepest drop-off occurs between W+0 and W+1 (81.7% churn), making first-week
            retention campaigns the single highest-ROI intervention available.
          </p>
        </div>
      </div>
    </div>
  );
}
