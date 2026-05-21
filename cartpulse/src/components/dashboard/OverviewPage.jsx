import KPICard from "../dashboard/KPICard";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { kpiSummary, dailyData, deviceBreakdown, sourceBreakdown, rfmSegments } from "../../data/mockData";

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(10,14,23,0.97)", border: "1px solid rgba(99,130,180,0.25)", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, color: p.color || "#f1f5f9", fontWeight: 500 }}>
          {p.name}: {typeof p.value === "number" && p.value > 10000 ? `$${(p.value / 1000).toFixed(0)}K` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function OverviewPage() {
  const slice30 = dailyData.slice(-30);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Overview Dashboard</h1>
        <p className="page-sub">eCommerce behavioral analytics · Oct 2019 – Apr 2020 · 285M+ events</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <KPICard label="Total Revenue"     value="$4.21M"  change={+12.4} icon="💰" accentColor="#6366f1" />
        <KPICard label="Total Users"       value="2.84M"   change={+8.1}  icon="👥" accentColor="#8b5cf6" />
        <KPICard label="Total Orders"      value="487K"    change={+5.7}  icon="🛍" accentColor="#06b6d4" />
        <KPICard label="Conversion Rate"   value="3.8%"    change={-0.4}  icon="🎯" accentColor="#f59e0b" />
        <KPICard label="Cart Abandonment"  value="68.4%"   change={-2.1}  icon="🛒" accentColor="#ef4444" />
        <KPICard label="Avg Order Value"   value="$86.20"  change={+3.2}  icon="💳" accentColor="#10b981" />
        <KPICard label="W+1 Retention"     value="18.3%"   change={+1.8}  icon="🔄" accentColor="#ec4899" />
        <KPICard label="Sessions / User"   value="3.2"     change={+0.3}  icon="📊" accentColor="#f97316" />
      </div>

      {/* Revenue trend + device pie */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="section">
          <div className="section-header">
            <span className="section-title">Daily Revenue Trend (30D)</span>
            <span className="section-badge">Last 30 Days</span>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={slice30} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} interval={4} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <span className="section-title">Device Segmentation</span>
          </div>
          <div style={{ height: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={deviceBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {deviceBreakdown.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: "#0a0e17", border: "1px solid #1e3a5f", borderRadius: 8 }} />
                <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Source breakdown + RFM segments */}
      <div className="grid-2">
        <div className="section">
          <div className="section-header">
            <span className="section-title">Traffic Source Breakdown</span>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceBreakdown} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} width={90} />
                <Tooltip contentStyle={{ background: "#0a0e17", border: "1px solid #1e3a5f", borderRadius: 8 }} formatter={v => `${v}%`} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 5, 5, 0]} name="Traffic %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <span className="section-title">Top Customer Segments</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {rfmSegments.map(seg => (
              <div key={seg.name} style={segStyle.item}>
                <div style={{ ...segStyle.dot, background: seg.color }} />
                <div style={{ flex: 1 }}>
                  <div style={segStyle.name}>{seg.name}</div>
                  <div style={segStyle.val}>{(seg.count / 1000).toFixed(0)}K · ${(seg.revenue / 1000000).toFixed(1)}M</div>
                  <div style={segStyle.barOuter}>
                    <div style={{ ...segStyle.barInner, width: `${Math.min(100, seg.revenue / 20000)}%`, background: seg.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const segStyle = {
  item: { display: "flex", alignItems: "center", gap: 8, padding: 10, background: "var(--bg3)", borderRadius: 8 },
  dot: { width: 9, height: 9, borderRadius: "50%", flexShrink: 0 },
  name: { fontSize: 12, fontWeight: 500, color: "var(--text)" },
  val: { fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" },
  barOuter: { height: 3, background: "var(--bg4)", borderRadius: 2, marginTop: 4 },
  barInner: { height: "100%", borderRadius: 2, transition: "width 0.8s ease" },
};
