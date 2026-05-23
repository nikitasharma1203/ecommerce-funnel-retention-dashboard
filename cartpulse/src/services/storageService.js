/**
 * CartPulse — Firestore persistence service
 * Saves KPI snapshots, dataset records, and dashboard state.
 * No file storage — only computed results are persisted.
 */

import {
  collection, doc, addDoc, setDoc, getDoc, getDocs,
  deleteDoc, query, where, orderBy, serverTimestamp, updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// ─── Dataset records (metadata only — no file upload) ─────────────────────────
export async function createDatasetRecord(userId, fileType, fileName, fileSize) {
  const docRef = await addDoc(collection(db, "datasets"), {
    userId, fileType, fileName, fileSize,
    rowCount: null,
    status: "processing",
    uploadedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function finaliseDataset(datasetId, rowCount) {
  await updateDoc(doc(db, "datasets", datasetId), {
    rowCount, status: "ready",
  });
}

export async function getUserDatasets(userId) {
  const q = query(
    collection(db, "datasets"),
    where("userId", "==", userId),
    orderBy("uploadedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteDataset(datasetId) {
  await deleteDoc(doc(db, "datasets", datasetId));
  // Also delete associated KPI results
  try {
    await deleteDoc(doc(db, "kpi_results", datasetId));
  } catch (_) {}
}

// ─── KPI results ──────────────────────────────────────────────────────────────
export async function saveKPIResults(userId, datasetId, datasetName, kpis, funnelSteps) {
  await setDoc(doc(db, "kpi_results", datasetId), {
    userId, datasetId, datasetName, kpis, funnelSteps,
    computedAt: serverTimestamp(),
  });
}

export async function getKPIResults(datasetId) {
  const snap = await getDoc(doc(db, "kpi_results", datasetId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getKPIHistory(userId) {
  const q = query(
    collection(db, "kpi_results"),
    where("userId", "==", userId),
    orderBy("computedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Dashboard state ──────────────────────────────────────────────────────────
export async function saveDashboardState(userId, state) {
  await setDoc(doc(db, "dashboard_states", userId), {
    userId, ...state, savedAt: serverTimestamp(),
  });
}

export async function loadDashboardState(userId) {
  const snap = await getDoc(doc(db, "dashboard_states", userId));
  return snap.exists() ? snap.data() : null;
}

// ─── Saved reports ────────────────────────────────────────────────────────────
export async function saveReport(userId, reportName, reportData) {
  const ref = await addDoc(collection(db, "saved_reports"), {
    userId, reportName, reportData, createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getSavedReports(userId) {
  const q = query(
    collection(db, "saved_reports"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteSavedReport(reportId) {
  await deleteDoc(doc(db, "saved_reports", reportId));
}
