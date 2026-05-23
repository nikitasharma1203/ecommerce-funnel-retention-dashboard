/**
 * CartPulse — Data safety helpers
 * Ensures chart data is always valid arrays with numeric values.
 * Prevents blank/crash screens when CSV data has missing fields.
 */

/** Ensure every item in an array has a numeric value for a given key */
export function safeChartData(arr, numericKeys = []) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  return arr.map(item => {
    const safe = { ...item };
    numericKeys.forEach(k => {
      const v = Number(safe[k]);
      safe[k] = isNaN(v) ? 0 : v;
    });
    return safe;
  });
}

/** Safe slice — returns empty array instead of crashing */
export function safeSlice(arr, n) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  return arr.slice(-n);
}

/** Returns fallback if array is empty or invalid */
export function safeArray(arr, fallback = []) {
  return Array.isArray(arr) && arr.length > 0 ? arr : fallback;
}

/** Ensure a KPI object has .value and .change */
export function safeKPI(kpi, defaultValue = "—") {
  if (!kpi) return { value: defaultValue, change: null };
  return { value: kpi.value || defaultValue, change: kpi.change ?? null };
}

/** Build DAU series safely from dailyData */
export function buildDAUSeries(dailyData) {
  if (!Array.isArray(dailyData) || dailyData.length === 0) return [];
  return dailyData.map(d => ({
    date: d.date || "",
    dau:  Number(d.dau || d.users || d.orders || 0),
  })).filter(d => d.date);
}

/** Build hourly activity — always returns 24 entries */
export function safeHourly(hourlyActivity) {
  const base = Array.from({ length: 24 }, (_, h) => ({ hour: `${h}:00`, events: 0 }));
  if (!Array.isArray(hourlyActivity) || hourlyActivity.length === 0) return base;
  return hourlyActivity.map((h, i) => ({
    hour:   h.hour || `${i}:00`,
    events: Number(h.events) || 0,
  }));
}
