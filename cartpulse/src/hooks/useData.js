import { createContext, useContext, useState, useCallback, useEffect } from "react";
import * as mock from "../data/mockData";
import { parseCSV } from "../utils/csvParser";
import {
  createDatasetRecord, finaliseDataset, getUserDatasets,
  saveKPIResults, getKPIResults, getKPIHistory,
  saveDashboardState, loadDashboardState,
} from "../services/storageService";
import {
  checkBackendHealth, submitCSVForProcessing,
  pollJob, fetchJobResults,
} from "../services/apiService";

// ─── Default state (mock / demo data) ────────────────────────────────────────
const defaultState = {
  dataSource:      "demo",   // "demo" | "csv" | "firestore" | "backend"
  backendOnline:   false,
  datasets:        [],
  activeDatasetId: null,
  processingJob:   null,     // { progress, message, status }
  kpiHistory:      [],

  kpis: {
    revenue:         { value: "$4.21M", change: +12.4 },
    totalUsers:      { value: "2.84M",  change: +8.1  },
    totalOrders:     { value: "487K",   change: +5.7  },
    convRate:        { value: "3.8%",   change: -0.4  },
    cartAbandon:     { value: "68.4%",  change: -2.1  },
    aov:             { value: "$86.20", change: +3.2  },
    retentionW1:     { value: "18.3%",  change: +1.8  },
    sessionsPerUser: { value: "3.2",    change: +0.3  },
    dau:             { value: "94.2K",  change: +3.1  },
    wau:             { value: "412K",   change: +6.2  },
    mau:             { value: "1.41M",  change: +8.1  },
    returnRate:      { value: "34.8%",  change: +2.3  },
    ltv:             { value: "$312",   change: +18   },
  },

  dailyData:       mock.dailyData,
  monthlyRevenue:  mock.monthlyRevenue,
  funnelSteps:     mock.funnelSteps,
  deviceBreakdown: mock.deviceBreakdown,
  sourceBreakdown: mock.sourceBreakdown,
  categoryCVR:     mock.categoryCVR,
  geoData:         mock.geoData,
  rfmSegments:     mock.rfmSegments,
  cohortMatrix:    mock.cohortMatrix,
  dauSeries:       mock.dauSeries,
  hourlyActivity:  mock.hourlyActivity,
  dowActivity:     mock.dowActivity,
  newVsReturning:  mock.newVsReturning,
  aiInsights:      mock.aiInsights,
};

const DataContext = createContext(null);

// ─── Parse CSV rows into dashboard state ─────────────────────────────────────
function buildSnapshot(rows, fileType) {
  if (fileType !== "orders" || !rows.length) return {};

  const purchases = rows.filter(r => r.event_type === "purchase");
  const carts     = rows.filter(r => r.event_type === "cart");
  const views     = rows.filter(r => r.event_type === "view");
  const revenue   = purchases.reduce((s, r) => s + (Number(r.price) || 0), 0);
  const orders    = purchases.length;
  const aov       = orders > 0 ? revenue / orders : 0;
  const cvr       = rows.length > 0 ? (orders / rows.length) * 100 : 0;
  const abandon   = carts.length > 0 ? Math.max(0, (1 - orders / carts.length) * 100) : 0;
  const users     = new Set(rows.map(r => r.user_id).filter(Boolean)).size;

  // KPIs
  const fmt = v => v >= 1e6 ? `$${(v/1e6).toFixed(2)}M` : `$${(v/1000).toFixed(1)}K`;
  const fmtN = v => v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `${(v/1e3).toFixed(1)}K` : String(v);
  const kpis = {
    revenue:     { value: fmt(revenue),           change: null },
    totalOrders: { value: fmtN(orders),           change: null },
    totalUsers:  { value: fmtN(users),            change: null },
    aov:         { value: `$${aov.toFixed(2)}`,   change: null },
    convRate:    { value: `${cvr.toFixed(2)}%`,   change: null },
    cartAbandon: { value: `${abandon.toFixed(1)}%`, change: null },
  };

  // Daily series
  const byDate = {};
  rows.forEach(r => {
    const d = r.event_time ? String(r.event_time).slice(0, 10) : null;
    if (!d) return;
    if (!byDate[d]) byDate[d] = { date: d, revenue: 0, orders: 0, users: 0 };
    if (r.event_type === "purchase") { byDate[d].revenue += Number(r.price) || 0; byDate[d].orders++; }
    byDate[d].users++;
  });
  const dailyData = Object.values(byDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      ...d,
      date:    d.date.slice(5),
      revenue: Math.round(d.revenue),
      dau:     d.users,
      cvr:     d.orders > 0 ? +((d.orders / d.users) * 100).toFixed(2) : 0,
    }));

  // Funnel
  const funnelSteps = [
    { name: "Visit",        count: rows.length,                    color: "#6366f1" },
    { name: "Product View", count: views.length,                   color: "#8b5cf6" },
    { name: "Add to Cart",  count: carts.length,                   color: "#a78bfa" },
    { name: "Checkout",     count: Math.round(carts.length * 0.46),color: "#06b6d4" },
    { name: "Purchase",     count: orders,                         color: "#10b981" },
  ];

  // Hourly
  const hc = Array(24).fill(0);
  rows.forEach(r => {
    const m = r.event_time ? String(r.event_time).match(/T?(\d{2}):/) : null;
    if (m) hc[parseInt(m[1])]++;
  });
  const hourlyActivity = hc.map((events, h) => ({ hour: `${h}:00`, events }));

  // Device breakdown
  const dc = {};
  rows.forEach(r => { const d = r.device || r.device_type; if (d) dc[d] = (dc[d] || 0) + 1; });
  const tot = Object.values(dc).reduce((a, b) => a + b, 0) || 1;
  const DCOLS = { mobile: "#6366f1", desktop: "#06b6d4", tablet: "#10b981" };
  const deviceBreakdown = Object.keys(dc).length > 0
    ? Object.entries(dc).map(([n, c]) => ({
        name:  n.charAt(0).toUpperCase() + n.slice(1),
        value: Math.round((c / tot) * 100),
        color: DCOLS[n.toLowerCase()] || "#8b5cf6",
      }))
    : mock.deviceBreakdown;

  return {
    kpis,
    funnelSteps,
    hourlyActivity,
    deviceBreakdown,
    dailyData: dailyData.length > 0 ? dailyData : mock.dailyData,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function DataProvider({ children }) {
  const [data, setData] = useState(defaultState);

  // Check if backend is running
  useEffect(() => {
    if (process.env.REACT_APP_API_URL) {
      checkBackendHealth().then(online => setData(p => ({ ...p, backendOnline: online })));
    }
  }, []);

  // Called from App on login — restore Firestore-persisted state
  const loadUserData = useCallback(async (user) => {
    if (!user || user.isDemo) return;
    try {
      const [datasets, saved, kpiHistory] = await Promise.all([
        getUserDatasets(user.uid),
        loadDashboardState(user.uid).catch(() => null),
        getKPIHistory(user.uid).catch(() => []),
      ]);
      setData(p => ({
        ...p,
        datasets,
        kpiHistory,
        ...(saved?.kpis
          ? { kpis: { ...p.kpis, ...saved.kpis }, activeDatasetId: saved.activeDatasetId, dataSource: "firestore" }
          : {}),
      }));
    } catch (e) {
      console.warn("Firestore restore failed (continuing with demo data):", e.message);
    }
  }, []);

  // Main upload handler — routes through backend if online, else client-side
  const uploadCSV = useCallback(async (file, fileType, user) => {
    setData(p => ({ ...p, processingJob: { progress: 5, message: "Reading file…", status: "processing" } }));

    try {
      // ── If backend is online → route through FastAPI ────────────────────
      if (data.backendOnline && !user?.isDemo) {
        setData(p => ({ ...p, processingJob: { progress: 10, message: "Submitting to backend…", status: "processing" } }));
        const { job_id, dataset_id } = await submitCSVForProcessing(user, file, fileType, "new");

        await pollJob(job_id, ({ progress, message }) =>
          setData(p => ({ ...p, processingJob: { progress, message, status: "processing" } }))
        );

        const { kpis: kpiResult, funnel } = await fetchJobResults(user, job_id);
        setData(p => ({
          ...p,
          kpis:          { ...p.kpis, ...(kpiResult.kpis || {}) },
          funnelSteps:   funnel.steps || p.funnelSteps,
          dailyData:     kpiResult.daily_series || p.dailyData,
          hourlyActivity: kpiResult.hourly || p.hourlyActivity,
          processingJob: null,
          dataSource:    "backend",
          activeDatasetId: dataset_id,
        }));

        // Refresh dataset list
        const datasets = await getUserDatasets(user.uid).catch(() => p => p.datasets);
        setData(p => ({ ...p, datasets }));
        return { jobId: job_id, rowCount: null };
      }

      // ── Client-side processing ──────────────────────────────────────────
      setData(p => ({ ...p, processingJob: { progress: 20, message: "Parsing CSV…", status: "processing" } }));
      const rows = await parseCSV(file);

      setData(p => ({ ...p, processingJob: { progress: 60, message: "Computing KPIs…", status: "processing" } }));
      const snap = buildSnapshot(rows, fileType);

      // Immediate dashboard update
      setData(p => ({ ...p, ...snap, dataSource: "csv", processingJob: { progress: 80, message: "Saving to cloud…", status: "processing" } }));

      // Persist KPI snapshot to Firestore (no file upload — just computed results)
      if (user && !user.isDemo) {
        const datasetId = await createDatasetRecord(user.uid, fileType, file.name, file.size);
        await saveKPIResults(user.uid, datasetId, file.name, snap.kpis || {}, snap.funnelSteps || []);
        await finaliseDataset(datasetId, rows.length);
        await saveDashboardState(user.uid, { kpis: snap.kpis, activeDatasetId: datasetId });
        const datasets = await getUserDatasets(user.uid);
        setData(p => ({ ...p, datasets, activeDatasetId: datasetId, dataSource: "firestore", processingJob: null }));
        return { datasetId, rowCount: rows.length };
      }

      setData(p => ({ ...p, processingJob: null }));
      return { rowCount: rows.length };

    } catch (e) {
      setData(p => ({ ...p, processingJob: { progress: 0, message: e.message, status: "error" } }));
      setTimeout(() => setData(p => ({ ...p, processingJob: null })), 4000);
      return { error: e.message };
    }
  // eslint-disable-next-line
  }, [data.backendOnline]);

  // Load a previously saved dataset from Firestore
  const loadSavedDataset = useCallback(async (datasetId) => {
    try {
      const result = await getKPIResults(datasetId);
      if (!result) return;
      setData(p => ({
        ...p,
        kpis:          { ...p.kpis, ...result.kpis },
        funnelSteps:   result.funnelSteps || p.funnelSteps,
        activeDatasetId: datasetId,
        dataSource:    "firestore",
      }));
    } catch (e) { console.error("loadSavedDataset:", e); }
  }, []);

  const resetToDemo = useCallback(() => setData(defaultState), []);

  return (
    <DataContext.Provider value={{ data, uploadCSV, loadSavedDataset, loadUserData, resetToDemo }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
}
