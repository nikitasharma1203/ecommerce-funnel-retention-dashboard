// ─── Revenue Page ─────────────────────────────────────────────────────────────
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from "recharts";
import { useData } from "../../hooks/useData";
import KPICard from "../dashboard/KPICard";

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0a0e17", border: "1px solid #1e3a5f", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, color: p.color || "#f1f5f9", fontWeight: 500 }}>
          {p.name}: {typeof p.value === "number" && p.value > 10000 ? `$${(p.value / 1000).toFixed(0)}K` : p.value}
        </p>
      ))}
    </div>
  );
};

const CAT_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];

export function RevenuePage() {
  const { data } = useData();
  const { kpis, dailyData, monthlyRevenue, categoryCVR, dataSource } = data;
  const slice90 = (Array.isArray(dailyData) ? dailyData : []).slice(-90).map(d => ({ ...d, revenue: Math.max(0, Number(d.revenue)||0) }));
  return (
    <div>
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <h1 className="page-title">Revenue Analytics</h1>
          {dataSource === "csv" && <span style={{ fontSize:11, background:"rgba(16,185,129,0.15)", color:"var(--green)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:6, padding:"2px 8px", fontWeight:600 }}>✓ Live CSV Data</span>}
        </div>
      </div>
      <div className="kpi-grid">
        <KPICard label="Total Revenue"   value={kpis.revenue.value}    change={kpis.revenue.change}   icon="💰" accentColor="#6366f1" />
        <KPICard label="Avg Order Value" value={kpis.aov.value}        change={kpis.aov.change}       icon="💳" accentColor="#10b981" />
        <KPICard label="Total Orders"    value={kpis.totalOrders.value} change={kpis.totalOrders.change} icon="📈" accentColor="#8b5cf6" />
        <KPICard label="Top Category"    value={categoryCVR[0]?.name || "Electronics"} change={categoryCVR[0] ? `$${(categoryCVR[0].revenue/1000).toFixed(0)}K` : "$1.1M"} icon="🏆" accentColor="#f59e0b" />
      </div>
      <div className="section">
        <div className="section-header"><span className="section-title">Monthly Revenue by Category</span></div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<TT />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              {["electronics","apparel","home","beauty","sports"].map((k, i) => (
                <Bar key={k} dataKey={k} stackId="a" fill={CAT_COLORS[i]} name={k.charAt(0).toUpperCase()+k.slice(1)} radius={i===4?[4,4,0,0]:[0,0,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid-2">
        <div className="section">
          <div className="section-header"><span className="section-title">Daily Revenue Trend (90D)</span></div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={slice90} margin={{ left: -10, right: 6 }}>
                <defs><linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} interval={14} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#rg2)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="section">
          <div className="section-header"><span className="section-title">Category CVR Comparison</span></div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryCVR} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} tickFormatter={v=>`${v}%`} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} width={90} />
                <Tooltip contentStyle={{ background: "#0a0e17", border: "1px solid #1e3a5f", borderRadius: 8 }} formatter={v=>`${v}%`} />
                <Bar dataKey="cvr" fill="#8b5cf6" radius={[0,5,5,0]} name="CVR %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Conversion Page ──────────────────────────────────────────────────────────
export function ConversionPage() {
  const { data } = useData();
  const { kpis, dailyData, sourceBreakdown, dataSource } = data;
  const slice30 = (Array.isArray(dailyData) ? dailyData : []).slice(-30).map(d => ({ ...d, cvr: Math.max(0, Number(d.cvr)||0) }));
  return (
    <div>
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <h1 className="page-title">Conversion Analytics</h1>
          {dataSource === "csv" && <span style={{ fontSize:11, background:"rgba(16,185,129,0.15)", color:"var(--green)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:6, padding:"2px 8px", fontWeight:600 }}>✓ Live CSV Data</span>}
        </div>
      </div>
      <div className="kpi-grid">
        <KPICard label="Overall CVR"     value={kpis.convRate.value}   change={kpis.convRate.change}   icon="🎯" accentColor="#6366f1" />
        <KPICard label="Cart Abandonment" value={kpis.cartAbandon.value} change={kpis.cartAbandon.change} icon="🛒" accentColor="#10b981" />
        <KPICard label="Mobile CVR"      value="2.1%"                  change={-1.7}                   icon="📱" accentColor="#ef4444" />
        <KPICard label="Desktop CVR"     value="5.4%"                  change={+0.8}                   icon="🖥" accentColor="#06b6d4" />
      </div>
      <div className="section">
        <div className="section-header"><span className="section-title">Daily CVR Trend</span></div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={slice30} margin={{ left: -10, right: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} interval={4} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} tickFormatter={v=>`${v}%`} />
              <Tooltip contentStyle={{ background: "#0a0e17", border: "1px solid #1e3a5f", borderRadius: 8 }} formatter={v=>`${v}%`} />
              <Line type="monotone" dataKey="cvr" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="CVR %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid-2">
        <div className="section">
          <div className="section-header"><span className="section-title">CVR by Source</span></div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceBreakdown} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill:"#64748b",fontSize:10 }} tickLine={false} tickFormatter={v=>`${v}%`} />
                <YAxis dataKey="name" type="category" tick={{ fill:"#94a3b8",fontSize:11 }} tickLine={false} width={90} />
                <Tooltip contentStyle={{ background:"#0a0e17",border:"1px solid #1e3a5f",borderRadius:8 }} formatter={v=>`${v}%`} />
                <Bar dataKey="cvr" fill="#10b981" radius={[0,5,5,0]} name="CVR %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="section">
          <div className="section-header"><span className="section-title">CVR by Device</span></div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{device:"Mobile",cvr:2.1},{device:"Desktop",cvr:5.4},{device:"Tablet",cvr:3.8}]} margin={{ left:-10,right:20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="device" tick={{ fill:"#94a3b8",fontSize:12 }} tickLine={false} />
                <YAxis tick={{ fill:"#64748b",fontSize:10 }} tickLine={false} tickFormatter={v=>`${v}%`} />
                <Tooltip contentStyle={{ background:"#0a0e17",border:"1px solid #1e3a5f",borderRadius:8 }} formatter={v=>`${v}%`} />
                <Bar dataKey="cvr" radius={[6,6,0,0]} name="CVR %">
                  {[{fill:"#ef4444"},{fill:"#06b6d4"},{fill:"#f59e0b"}].map((c,i)=><Cell key={i} fill={c.fill}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Retention Page ───────────────────────────────────────────────────────────
export function RetentionPage() {
  return (
    <div>
      <div className="page-header"><h1 className="page-title">Retention Analytics</h1></div>
      <div className="kpi-grid">
        <KPICard label="W+1 Avg Retention" value="18.3%" change={+1.8} icon="🔄" accentColor="#6366f1" />
        <KPICard label="W+2 Avg Retention" value="10.2%" change={+0.9} icon="📅" accentColor="#8b5cf6" />
        <KPICard label="Avg Churn W+1"     value="81.7%" change={-2.1} icon="📉" accentColor="#ef4444" />
        <KPICard label="Best Cohort"        value="Wk 44" change="22.1% W+1" icon="🏅" accentColor="#10b981" />
      </div>
      <div style={{
        background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)",
        borderRadius: 12, padding: "16px 20px", marginBottom: 16,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 22 }}>💡</span>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
          View the full <strong style={{ color: "var(--accent)" }}>Cohort Heatmap</strong> in the Cohort Analysis section for the complete retention matrix across 12 cohorts and 9 week offsets.
          The steepest drop-off occurs between W+0 and W+1 — making first-week retention campaigns the highest-ROI intervention available.
        </p>
      </div>
    </div>
  );
}

// ─── Active Users Page ────────────────────────────────────────────────────────
export function ActiveUsersPage() {
  const { data } = useData();
  const { kpis, dailyData, hourlyActivity, dowActivity, dataSource } = data;

  // Defensive — ensure all values are valid numbers
  const dauSeries = (Array.isArray(dailyData) ? dailyData : [])
    .map(d => ({ date: d.date || "", dau: Math.max(0, Number(d.dau || d.users || 0)) }))
    .filter(d => d.date)
    .slice(-30);

  const safeHourly = (Array.isArray(hourlyActivity) && hourlyActivity.length === 24
    ? hourlyActivity
    : Array.from({ length: 24 }, (_, h) => ({ hour: `${h}:00`, events: 0 }))
  ).map(h => ({ ...h, events: Math.max(0, Number(h.events) || 0) }));

  const safeDow = (Array.isArray(dowActivity) && dowActivity.length > 0
    ? dowActivity
    : [{ day:"Mon",users:0 },{ day:"Tue",users:0 },{ day:"Wed",users:0 },{ day:"Thu",users:0 },{ day:"Fri",users:0 },{ day:"Sat",users:0 },{ day:"Sun",users:0 }]
  ).map(d => ({ ...d, users: Math.max(0, Number(d.users) || 0) }));

  const fmtK = v => { const n = Number(v) || 0; return n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n); };

  return (
    <div>
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <h1 className="page-title">Active Users</h1>
          {dataSource !== "demo" && <span style={{ fontSize:11, background:"rgba(16,185,129,0.15)", color:"var(--green)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:6, padding:"2px 8px", fontWeight:600 }}>✓ Live CSV Data</span>}
        </div>
      </div>
      <div className="kpi-grid">
        <KPICard label="DAU"         value={kpis.dau?.value        || "—"} change={kpis.dau?.change}        icon="👤" accentColor="#6366f1" />
        <KPICard label="WAU"         value={kpis.wau?.value        || "—"} change={kpis.wau?.change}        icon="👥" accentColor="#8b5cf6" />
        <KPICard label="MAU"         value={kpis.mau?.value        || "—"} change={kpis.mau?.change}        icon="🏢" accentColor="#06b6d4" />
        <KPICard label="Total Users" value={kpis.totalUsers?.value || "—"} change={kpis.totalUsers?.change} icon="📊" accentColor="#10b981" />
      </div>
      <div className="section">
        <div className="section-header">
          <span className="section-title">Daily Active Users</span>
          <span className="section-badge">{dataSource !== "demo" ? "CSV Data" : "30D"}</span>
        </div>
        <div style={{ height: 260 }}>
          {dauSeries.length === 0 ? (
            <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text3)", fontSize:13 }}>Upload orders.csv to see user activity</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dauSeries} margin={{ left: -10, right: 6 }}>
                <defs><linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill:"#64748b", fontSize:9 }} tickLine={false} interval={Math.max(1, Math.floor(dauSeries.length/6))} />
                <YAxis tick={{ fill:"#64748b", fontSize:10 }} tickLine={false} tickFormatter={fmtK} />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="dau" stroke="#06b6d4" strokeWidth={2} fill="url(#dauGrad)" name="DAU" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="grid-2">
        <div className="section">
          <div className="section-header"><span className="section-title">Hourly Activity Pattern</span></div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safeHourly} margin={{ left: -10, right: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" tick={{ fill:"#64748b", fontSize:9 }} tickLine={false} interval={3} />
                <YAxis tick={{ fill:"#64748b", fontSize:9 }} tickLine={false} tickFormatter={fmtK} />
                <Tooltip contentStyle={{ background:"#0a0e17", border:"1px solid #1e3a5f", borderRadius:8 }} />
                <Bar dataKey="events" fill="#6366f199" radius={[3,3,0,0]} name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="section">
          <div className="section-header"><span className="section-title">Day of Week Activity</span></div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safeDow} margin={{ left: -10, right: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill:"#94a3b8", fontSize:12 }} tickLine={false} />
                <YAxis tick={{ fill:"#64748b", fontSize:10 }} tickLine={false} tickFormatter={fmtK} />
                <Tooltip contentStyle={{ background:"#0a0e17", border:"1px solid #1e3a5f", borderRadius:8 }} />
                <Bar dataKey="users" fill="#8b5cf699" radius={[4,4,0,0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Returning Customers Page ─────────────────────────────────────────────────
export function ReturningPage() {
  const { data } = useData();
  const { kpis, newVsReturning, dataSource } = data;

  const safeNvR = (Array.isArray(newVsReturning) && newVsReturning.length > 0
    ? newVsReturning
    : [{ month:"No data", new:0, returning:0 }]
  ).map(d => ({ ...d, new: Math.max(0, Number(d.new)||0), returning: Math.max(0, Number(d.returning)||0) }));

  const fmtK = v => { const n = Number(v)||0; return n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n); };

  return (
    <div>
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <h1 className="page-title">Returning Customers</h1>
          {dataSource !== "demo" && <span style={{ fontSize:11, background:"rgba(16,185,129,0.15)", color:"var(--green)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:6, padding:"2px 8px", fontWeight:600 }}>✓ Live CSV Data</span>}
        </div>
      </div>
      <div className="kpi-grid">
        <KPICard label="Return Rate"         value={kpis.returnRate?.value || "—"} change={kpis.returnRate?.change} icon="🔁" accentColor="#6366f1" />
        <KPICard label="Avg Orders/Returner" value="4.2"   change={+0.4}  icon="🛍" accentColor="#10b981" />
        <KPICard label="LTV (Returning)"     value={kpis.ltv?.value        || "—"} change={kpis.ltv?.change}        icon="💎" accentColor="#8b5cf6" />
        <KPICard label="Repeat 30D"          value="12.4%" change={+1.1}  icon="📦" accentColor="#f59e0b" />
      </div>
      <div className="section">
        <div className="section-header"><span className="section-title">New vs Returning Customers</span></div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeNvR} margin={{ left: -10, right: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill:"#94a3b8", fontSize:11 }} tickLine={false} />
              <YAxis tick={{ fill:"#64748b", fontSize:10 }} tickLine={false} tickFormatter={fmtK} />
              <Tooltip content={<TT />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, color:"#94a3b8" }} />
              <Bar dataKey="new"       fill="#6366f199" radius={[0,0,0,0]} name="New Customers" stackId="a" />
              <Bar dataKey="returning" fill="#10b98199" radius={[4,4,0,0]} name="Returning"     stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── RFM Segments Page ────────────────────────────────────────────────────────
export function RFMPage() {
  const { data } = useData();
  const { rfmSegments } = data;
  return (
    <div>
      <div className="page-header"><h1 className="page-title">RFM Customer Segments</h1></div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="section">
          <div className="section-header"><span className="section-title">Segment Distribution</span></div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rfmSegments} layout="vertical" margin={{ left: 10, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill:"#64748b",fontSize:10 }} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} />
                <YAxis dataKey="name" type="category" tick={{ fill:"#94a3b8",fontSize:10 }} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background:"#0a0e17",border:"1px solid #1e3a5f",borderRadius:8 }} formatter={v=>`${v.toLocaleString()} users`} />
                <Bar dataKey="count" radius={[0,5,5,0]} name="Users">
                  {rfmSegments.map(s=><Cell key={s.name} fill={s.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="section">
          <div className="section-header"><span className="section-title">Revenue by Segment</span></div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rfmSegments} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill:"#64748b",fontSize:10 }} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} />
                <YAxis dataKey="name" type="category" tick={{ fill:"#94a3b8",fontSize:10 }} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background:"#0a0e17",border:"1px solid #1e3a5f",borderRadius:8 }} formatter={v=>`$${(v/1000).toFixed(0)}K`} />
                <Bar dataKey="revenue" radius={[0,5,5,0]} name="Revenue">
                  {rfmSegments.map(s=><Cell key={s.name} fill={s.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-header"><span className="section-title">Segment Details</span></div>
        {rfmSegments.map(seg => (
          <div key={seg.name} style={{ display:"flex",alignItems:"center",gap:12,padding:12,background:"var(--bg3)",borderRadius:10,marginBottom:8 }}>
            <span style={{ fontSize: 22 }}>{seg.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{seg.name} <span style={{ fontSize: 12, color: "var(--text3)" }}>({seg.pct}%)</span></div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{seg.desc}</div>
              <div style={{ height: 3, background: "var(--bg4)", borderRadius: 2, marginTop: 5, width: 200 }}>
                <div style={{ height: "100%", background: seg.color, borderRadius: 2, width: `${Math.min(100, seg.revenue / 20000)}%`, transition: "width 0.8s ease" }} />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{(seg.count / 1000).toFixed(0)}K</div>
              <div style={{ fontSize: 12, color: "var(--green)", fontFamily: "var(--mono)" }}>${(seg.revenue / 1000000).toFixed(2)}M</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Geographic Page ──────────────────────────────────────────────────────────
export function GeoPage() {
  const { data } = useData();
  const { geoData } = data;
  return (
    <div>
      <div className="page-header"><h1 className="page-title">Geographic Analysis</h1></div>
      <div className="kpi-grid">
        <KPICard label="Top Country"  value="Russia"  change="34.8% users" icon="🌍" accentColor="#6366f1" />
        <KPICard label="Highest AOV"  value="USA"     change="$142 AOV"    icon="💰" accentColor="#10b981" />
        <KPICard label="Countries"    value="47"      change="+3 new"      icon="🌐" accentColor="#8b5cf6" />
        <KPICard label="Intl Revenue" value="41%"     change={+6.2}        icon="📊" accentColor="#f59e0b" />
      </div>
      <div className="section">
        <div className="section-header">
          <span className="section-title">Revenue by Country (Top 10)</span>
          <span className="section-badge">Oct 19 – Apr 20</span>
        </div>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={geoData} layout="vertical" margin={{ left: 20, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill:"#64748b",fontSize:10 }} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} />
              <YAxis dataKey="country" type="category" tick={{ fill:"#94a3b8",fontSize:11 }} tickLine={false} width={85} />
              <Tooltip contentStyle={{ background:"#0a0e17",border:"1px solid #1e3a5f",borderRadius:8 }} formatter={v=>`$${(v/1000).toFixed(0)}K`} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[0,5,5,0]} name="Revenue">
                {geoData.map((_,i)=><Cell key={i} fill={`rgba(99,102,241,${1-i*0.08})`}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid-2">
        <div className="section">
          <div className="section-header"><span className="section-title">Conversion Rate by Country</span></div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill:"#64748b",fontSize:10 }} tickLine={false} tickFormatter={v=>`${v}%`} />
                <YAxis dataKey="country" type="category" tick={{ fill:"#94a3b8",fontSize:10 }} tickLine={false} width={85} />
                <Tooltip contentStyle={{ background:"#0a0e17",border:"1px solid #1e3a5f",borderRadius:8 }} formatter={v=>`${v}%`} />
                <Bar dataKey="cvr" fill="#10b981" radius={[0,5,5,0]} name="CVR %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="section">
          <div className="section-header"><span className="section-title">Users by Country</span></div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill:"#64748b",fontSize:10 }} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} />
                <YAxis dataKey="country" type="category" tick={{ fill:"#94a3b8",fontSize:10 }} tickLine={false} width={85} />
                <Tooltip contentStyle={{ background:"#0a0e17",border:"1px solid #1e3a5f",borderRadius:8 }} formatter={v=>`${(v/1000).toFixed(0)}K users`} />
                <Bar dataKey="users" fill="#f59e0b" radius={[0,5,5,0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
