/**
 * FastAPI backend client.
 * Set REACT_APP_API_URL in .env to your backend URL.
 * All calls fall back gracefully if backend is unreachable.
 */

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

async function authHeader(user) {
  if (!user || user.isDemo) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch { return false; }
}

export async function submitCSVForProcessing(user, file, fileType, datasetId) {
  const headers = await authHeader(user);
  const form = new FormData();
  form.append("file", file);
  form.append("file_type", fileType);
  form.append("dataset_id", datasetId || "new");
  const res = await fetch(`${BASE}/api/datasets/process`, { method: "POST", headers, body: form });
  if (!res.ok) throw new Error(`Backend error: ${res.status}`);
  return res.json();
}

export async function pollJob(jobId, onStatus, ms = 1500) {
  return new Promise((resolve, reject) => {
    const iv = setInterval(async () => {
      try {
        const res = await fetch(`${BASE}/api/jobs/${jobId}`);
        const data = await res.json();
        if (onStatus) onStatus(data);
        if (data.status === "completed") { clearInterval(iv); resolve(data); }
        else if (data.status === "failed") { clearInterval(iv); reject(new Error(data.message)); }
      } catch (e) { clearInterval(iv); reject(e); }
    }, ms);
  });
}

export async function fetchJobResults(user, jobId) {
  const headers = await authHeader(user);
  const [kpiRes, funnelRes] = await Promise.all([
    fetch(`${BASE}/api/datasets/${jobId}/kpis`,   { headers }).then(r => r.json()),
    fetch(`${BASE}/api/datasets/${jobId}/funnel`, { headers }).then(r => r.json()),
  ]);
  return { kpis: kpiRes, funnel: funnelRes };
}

export async function fetchKPIHistory(user) {
  const headers = await authHeader(user);
  const res = await fetch(`${BASE}/api/analytics/history`, { headers });
  return res.ok ? res.json() : { trend: [] };
}

export async function saveReportBackend(user, reportName, reportData) {
  const headers = { ...(await authHeader(user)), "Content-Type": "application/json" };
  const res = await fetch(`${BASE}/api/reports`, {
    method: "POST", headers,
    body: JSON.stringify({ report_name: reportName, report_data: reportData }),
  });
  return res.ok ? res.json() : null;
}
