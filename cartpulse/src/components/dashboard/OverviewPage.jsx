import KPICard from "./KPICard";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useData } from "../../hooks/useData";
import { safeChartData, safeSlice, safeArray } from "../../utils/dataHelpers";

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(10,14,23,0.97)", border:"1px solid rgba(99,130,180,0.25)", borderRadius:10, padding:"10px 14px" }}>
      <p style={{ fontSize:12, color:"#94a3b8", marginBottom:4 }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ fontSize:13, color:p.color||"#f1f5f9", fontWeight:500 }}>
          {p.name}: {typeof p.value==="number" && p.value>10000 ? `$${(p.value/1000).toFixed(0)}K` : (p.value ?? 0)}
        </p>
      ))}
    </div>
  );
};

const EmptyChart = ({ message = "No data available" }) => (
  <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text3)", fontSize:13 }}>
    {message}
  </div>
);

export default function OverviewPage() {
  const { data } = useData();
  const { kpis, dailyData, deviceBreakdown, sourceBreakdown, rfmSegments, dataSource } = data;

  // Safe sanitized data
  const revenueData = safeChartData(safeSlice(dailyData, 30), ["revenue"]);
  const safeDevices = safeArray(deviceBreakdown, [{ name: "No data", value: 100, color: "#334155" }]);
  const safeSources = safeArray(sourceBreakdown);
  const safeRFM     = safeArray(rfmSegments);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Overview Dashboard</h1>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <p className="page-sub">eCommerce behavioral analytics · 285M+ events</p>
          {dataSource !== "demo" && (
            <span style={{ fontSize:11, background:"rgba(16,185,129,0.15)", color:"var(--green)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:6, padding:"2px 8px", fontWeight:600 }}>
              ✓ Live CSV Data
            </span>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <KPICard label="Total Revenue"    value={kpis.revenue?.value      || "—"} change={kpis.revenue?.change}         icon="💰" accentColor="#6366f1" />
        <KPICard label="Total Users"      value={kpis.totalUsers?.value   || "—"} change={kpis.totalUsers?.change}       icon="👥" accentColor="#8b5cf6" />
        <KPICard label="Total Orders"     value={kpis.totalOrders?.value  || "—"} change={kpis.totalOrders?.change}      icon="🛍" accentColor="#06b6d4" />
        <KPICard label="Conversion Rate"  value={kpis.convRate?.value     || "—"} change={kpis.convRate?.change}         icon="🎯" accentColor="#f59e0b" />
        <KPICard label="Cart Abandonment" value={kpis.cartAbandon?.value  || "—"} change={kpis.cartAbandon?.change}      icon="🛒" accentColor="#ef4444" />
        <KPICard label="Avg Order Value"  value={kpis.aov?.value          || "—"} change={kpis.aov?.change}              icon="💳" accentColor="#10b981" />
        <KPICard label="W+1 Retention"    value={kpis.retentionW1?.value  || "—"} change={kpis.retentionW1?.change}      icon="🔄" accentColor="#ec4899" />
        <KPICard label="Sessions / User"  value={kpis.sessionsPerUser?.value || "—"} change={kpis.sessionsPerUser?.change} icon="📊" accentColor="#f97316" />
      </div>

      {/* Revenue trend + device pie */}
      <div className="grid-2" style={{ marginBottom:16 }}>
        <div className="section">
          <div className="section-header">
            <span className="section-title">Daily Revenue Trend</span>
            <span className="section-badge">{dataSource !== "demo" ? "CSV Data" : "Last 30 Days"}</span>
          </div>
          <div style={{ height:260 }}>
            {revenueData.length === 0 ? <EmptyChart message="Upload orders.csv to see revenue trend" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top:4, right:4, left:-10, bottom:0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill:"#64748b", fontSize:10 }} tickLine={false}
                    interval={Math.max(1, Math.floor(revenueData.length / 8))} />
                  <YAxis tick={{ fill:"#64748b", fontSize:10 }} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`} />
                  <Tooltip content={<TT />} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2}
                    fill="url(#revGrad)" name="Revenue" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <span className="section-title">Device Segmentation</span>
            {dataSource !== "demo" && <span style={{ fontSize:11, color:"var(--green)" }}>● Live</span>}
          </div>
          <div style={{ height:260, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={safeDevices} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {safeDevices.map((d,i) => <Cell key={i} fill={d.color || "#6366f1"} />)}
                </Pie>
                <Tooltip formatter={v=>`${v}%`} contentStyle={{ background:"#0a0e17", border:"1px solid #1e3a5f", borderRadius:8 }} />
                <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize:12, color:"#94a3b8" }} />
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
          <div style={{ height:240 }}>
            {safeSources.length === 0 ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeSources} layout="vertical" margin={{ left:20, right:20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill:"#64748b", fontSize:10 }} tickLine={false} tickFormatter={v=>`${v}%`} />
                  <YAxis dataKey="name" type="category" tick={{ fill:"#94a3b8", fontSize:11 }} tickLine={false} width={90} />
                  <Tooltip contentStyle={{ background:"#0a0e17", border:"1px solid #1e3a5f", borderRadius:8 }} formatter={v=>`${v}%`} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0,5,5,0]} name="Traffic %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <span className="section-title">Top Customer Segments</span>
          </div>
          {safeRFM.length === 0 ? (
            <EmptyChart message="Upload orders.csv to see segments" />
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {safeRFM.map(seg => (
                <div key={seg.name} style={{ display:"flex", alignItems:"center", gap:8, padding:10, background:"var(--bg3)", borderRadius:8 }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:seg.color || "#6366f1", flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:500, color:"var(--text)" }}>{seg.name}</div>
                    <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--mono)" }}>
                      {((seg.count || 0)/1000).toFixed(0)}K · ${((seg.revenue || 0)/1000000).toFixed(1)}M
                    </div>
                    <div style={{ height:3, background:"var(--bg4)", borderRadius:2, marginTop:4 }}>
                      <div style={{ height:"100%", background:seg.color||"#6366f1", borderRadius:2, width:`${Math.min(100,(seg.revenue||0)/20000)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
