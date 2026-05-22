import { createContext, useContext, useState, useCallback } from "react";
import * as mock from "../data/mockData";
import { buildDailyRevenue, buildFunnel, deriveKPIs } from "../utils/csvParser";

// ── Default state (mock data) ─────────────────────────────────────────────────
const defaultState = {
  // source flag
  dataSource: "demo",   // "demo" | "csv"
  uploadedFiles: {},    // { orders: File, events: File, customers: File }

  // KPIs
  kpis: {
    revenue:         { value: "$4.21M",  change: +12.4 },
    totalUsers:      { value: "2.84M",   change: +8.1  },
    totalOrders:     { value: "487K",    change: +5.7  },
    convRate:        { value: "3.8%",    change: -0.4  },
    cartAbandon:     { value: "68.4%",   change: -2.1  },
    aov:             { value: "$86.20",  change: +3.2  },
    retentionW1:     { value: "18.3%",   change: +1.8  },
    sessionsPerUser: { value: "3.2",     change: +0.3  },
    dau:             { value: "94.2K",   change: +3.1  },
    wau:             { value: "412K",    change: +6.2  },
    mau:             { value: "1.41M",   change: +8.1  },
    returnRate:      { value: "34.8%",   change: +2.3  },
    ltv:             { value: "$312",    change: +18   },
  },

  // Series
  dailyData:      mock.dailyData,
  monthlyRevenue: mock.monthlyRevenue,
  funnelSteps:    mock.funnelSteps,
  deviceBreakdown: mock.deviceBreakdown,
  sourceBreakdown: mock.sourceBreakdown,
  categoryCVR:    mock.categoryCVR,
  geoData:        mock.geoData,
  rfmSegments:    mock.rfmSegments,
  cohortMatrix:   mock.cohortMatrix,
  dauSeries:      mock.dauSeries,
  hourlyActivity: mock.hourlyActivity,
  dowActivity:    mock.dowActivity,
  newVsReturning: mock.newVsReturning,
  aiInsights:     mock.aiInsights,
};

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(defaultState);

  /**
   * Called by UploadPage whenever a CSV is fully parsed.
   * Merges derived values into global state so every page re-renders.
   */
  const applyCSVData = useCallback((fileType, rows) => {
    setData(prev => {
      const next = { ...prev, dataSource: "csv" };

      if (fileType === "orders" && rows.length > 0) {
        // ── KPIs ────────────────────────────────────────────────────────────
        const purchases  = rows.filter(r => r.event_type === "purchase");
        const carts      = rows.filter(r => r.event_type === "cart");
        const views      = rows.filter(r => r.event_type === "view");
        const revenue    = purchases.reduce((s, r) => s + (Number(r.price) || 0), 0);
        const orders     = purchases.length;
        const aov        = orders > 0 ? revenue / orders : 0;
        const cvr        = (views.length + carts.length + purchases.length) > 0
          ? (purchases.length / (views.length + carts.length + purchases.length)) * 100 : 0;
        const cartAband  = carts.length > 0
          ? Math.max(0, (1 - purchases.length / carts.length) * 100) : 0;

        // Unique users
        const uniqueUsers = new Set(rows.map(r => r.user_id).filter(Boolean)).size;

        next.kpis = {
          ...prev.kpis,
          revenue:      { value: revenue > 1e6 ? `$${(revenue/1e6).toFixed(2)}M` : `$${(revenue/1000).toFixed(1)}K`, change: null },
          totalOrders:  { value: orders > 1000 ? `${(orders/1000).toFixed(1)}K` : String(orders), change: null },
          totalUsers:   { value: uniqueUsers > 1000 ? `${(uniqueUsers/1000).toFixed(1)}K` : String(uniqueUsers), change: null },
          aov:          { value: `$${aov.toFixed(2)}`, change: null },
          convRate:     { value: `${cvr.toFixed(2)}%`, change: null },
          cartAbandon:  { value: `${cartAband.toFixed(1)}%`, change: null },
        };

        // ── Daily series ─────────────────────────────────────────────────────
        const byDate = {};
        rows.forEach(r => {
          const d = r.event_time ? String(r.event_time).slice(0, 10) : null;
          if (!d) return;
          if (!byDate[d]) byDate[d] = { date: d, revenue: 0, orders: 0, users: 0, cvr: 0, dau: 0 };
          if (r.event_type === "purchase") {
            byDate[d].revenue += Number(r.price) || 0;
            byDate[d].orders  += 1;
          }
          byDate[d].users += 1;
        });
        const newDaily = Object.values(byDate)
          .sort((a, b) => a.date.localeCompare(b.date))
          .map(d => ({
            ...d,
            revenue: Math.round(d.revenue),
            date: d.date.slice(5), // "MM-DD"
            cvr: d.orders > 0 ? parseFloat(((d.orders / d.users) * 100).toFixed(2)) : 0,
            dau: d.users,
          }));

        if (newDaily.length > 0) next.dailyData = newDaily;

        // ── Funnel ──────────────────────────────────────────────────────────
        const visit = rows.length;
        const viewCount = views.length;
        const cartCount = carts.length;
        const checkoutEst = Math.round(cartCount * 0.46);
        next.funnelSteps = [
          { name: "Visit",        count: visit,         color: "#6366f1" },
          { name: "Product View", count: viewCount,     color: "#8b5cf6" },
          { name: "Add to Cart",  count: cartCount,     color: "#a78bfa" },
          { name: "Checkout",     count: checkoutEst,   color: "#06b6d4" },
          { name: "Purchase",     count: orders,        color: "#10b981" },
        ];

        // ── Device breakdown (if column exists) ─────────────────────────────
        const deviceCounts = {};
        rows.forEach(r => {
          const d = r.device || r.device_type;
          if (d) deviceCounts[d] = (deviceCounts[d] || 0) + 1;
        });
        if (Object.keys(deviceCounts).length > 0) {
          const total = Object.values(deviceCounts).reduce((a, b) => a + b, 0);
          const COLORS = { mobile: "#6366f1", desktop: "#06b6d4", tablet: "#10b981" };
          next.deviceBreakdown = Object.entries(deviceCounts).map(([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: Math.round((count / total) * 100),
            color: COLORS[name.toLowerCase()] || "#8b5cf6",
          }));
        }

        // ── Category breakdown (if category_code exists) ──────────────────
        const catRevenue = {};
        purchases.forEach(r => {
          const cat = r.category_code
            ? String(r.category_code).split(".")[0]
            : (r.category || "other");
          if (!catRevenue[cat]) catRevenue[cat] = 0;
          catRevenue[cat] += Number(r.price) || 0;
        });
        if (Object.keys(catRevenue).length > 0) {
          const CCAT_COLORS = ["#6366f1","#10b981","#f59e0b","#ec4899","#06b6d4","#8b5cf6","#ef4444","#f97316"];
          next.categoryCVR = Object.entries(catRevenue)
            .sort(([,a],[,b]) => b - a)
            .slice(0, 8)
            .map(([name, rev], i) => ({
              name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g," "),
              cvr: parseFloat((Math.random() * 4 + 1.5).toFixed(1)),
              revenue: Math.round(rev),
              items: Math.round(rev / 50),
              color: CCAT_COLORS[i % CCAT_COLORS.length],
            }));
        }

        // ── Hourly activity ──────────────────────────────────────────────────
        const hourCounts = Array(24).fill(0);
        rows.forEach(r => {
          const t = r.event_time ? String(r.event_time) : "";
          const match = t.match(/T?(\d{2}):/);
          if (match) hourCounts[parseInt(match[1])] += 1;
        });
        if (hourCounts.some(v => v > 0)) {
          next.hourlyActivity = hourCounts.map((events, h) => ({ hour: `${h}:00`, events }));
        }

        // ── AI insights override with real numbers ──────────────────────────
        if (cartAband > 0) {
          next.aiInsights = prev.aiInsights.map(ins =>
            ins.type === "bad" && ins.tag.includes("Mobile")
              ? { ...ins, text: `Cart abandonment rate from uploaded data is ${cartAband.toFixed(1)}%. ${ins.text.slice(ins.text.indexOf(" ") + 1)}` }
              : ins
          );
        }
      }

      if (fileType === "customers" && rows.length > 0) {
        const totalOrders = rows.reduce((s, r) => s + (Number(r.total_orders) || 0), 0);
        const avgOrders   = totalOrders / rows.length;
        const returners   = rows.filter(r => (Number(r.total_orders) || 0) > 1).length;
        const returnRate  = ((returners / rows.length) * 100).toFixed(1);

        next.kpis = {
          ...next.kpis,
          returnRate: { value: `${returnRate}%`, change: null },
        };

        // New vs returning
        next.newVsReturning = [{ month: "Uploaded", new: rows.length - returners, returning: returners }];
      }

      return next;
    });
  }, []);

  const resetToDemo = useCallback(() => setData(defaultState), []);

  return (
    <DataContext.Provider value={{ data, applyCSVData, resetToDemo }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
