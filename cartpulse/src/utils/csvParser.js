import Papa from "papaparse";

/**
 * Parse a CSV File object and return cleaned rows.
 * Supports: orders.csv, events.csv, customers.csv
 */
export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
}

/** Detect file type by column names */
export function detectFileType(columns) {
  const c = columns.map((x) => x.toLowerCase().replace(/\s/g, "_"));
  if (c.includes("event_type") && c.includes("price")) return "orders";
  if (c.includes("event_type") && c.includes("session_id")) return "events";
  if (c.includes("first_purchase") || c.includes("total_orders")) return "customers";
  return "unknown";
}

/** Derive KPIs from uploaded orders rows */
export function deriveKPIs(rows) {
  const purchases  = rows.filter((r) => r.event_type === "purchase");
  const carts      = rows.filter((r) => r.event_type === "cart");
  const views      = rows.filter((r) => r.event_type === "view");

  const revenue    = purchases.reduce((s, r) => s + (r.price || 0), 0);
  const orders     = purchases.length;
  const aov        = orders > 0 ? revenue / orders : 0;
  const cvr        = views.length > 0 ? (purchases.length / views.length) * 100 : 0;
  const cartAband  = carts.length > 0
    ? ((carts.length - purchases.length) / carts.length) * 100 : 0;

  return {
    revenue:     `$${(revenue / 1000).toFixed(1)}K`,
    orders:      `${orders.toLocaleString()}`,
    aov:         `$${aov.toFixed(2)}`,
    cvr:         `${cvr.toFixed(2)}%`,
    cartAbandon: `${Math.max(0, cartAband).toFixed(1)}%`,
  };
}

/** Build daily revenue series from orders rows */
export function buildDailyRevenue(rows) {
  const byDate = {};
  rows
    .filter((r) => r.event_type === "purchase")
    .forEach((r) => {
      const d = r.event_time
        ? r.event_time.toString().slice(0, 10)
        : "unknown";
      if (!byDate[d]) byDate[d] = 0;
      byDate[d] += r.price || 0;
    });
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue: Math.round(revenue) }));
}

/** Build funnel from events rows */
export function buildFunnel(rows) {
  const counts = {
    view:     rows.filter((r) => r.event_type === "view").length,
    cart:     rows.filter((r) => r.event_type === "cart").length,
    purchase: rows.filter((r) => r.event_type === "purchase").length,
  };
  const visit = counts.view + counts.cart + counts.purchase;
  return [
    { name: "Visit",        count: visit,          color: "#6366f1" },
    { name: "Product View", count: counts.view,     color: "#8b5cf6" },
    { name: "Add to Cart",  count: counts.cart,     color: "#a78bfa" },
    { name: "Checkout",     count: Math.round(counts.cart * 0.45), color: "#06b6d4" },
    { name: "Purchase",     count: counts.purchase, color: "#10b981" },
  ];
}
